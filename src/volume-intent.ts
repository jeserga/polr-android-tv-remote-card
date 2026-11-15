/** One replaceable volume target, at most one short batch in flight. */
export class VolumeIntent {
  public target?: number;
  public confirmed = 0;
  public error?: string;
  private estimated = 0;
  private busy = false;
  private timer?: ReturnType<typeof setTimeout>;
  private timeout?: ReturnType<typeof setTimeout>;
  private queuedAt = 0;
  private sentAt = 0;
  private generation = 0;
  private observedAt = 0;
  private corrections = 0;

  public constructor(
    private readonly step: number,
    private readonly send: (direction: 1 | -1, count: number) => Promise<unknown>,
    private readonly changed: () => void,
    private readonly now = () => Date.now(),
    private readonly confirmationMs = 12_000,
  ) {}

  public get value(): number { return this.target ?? this.confirmed; }
  public get pending(): boolean { return this.target !== undefined; }

  public observe(level: number, observedAt: number): void {
    if (observedAt < this.observedAt) return;
    this.observedAt = observedAt;
    this.confirmed = level;
    if (!this.pending) this.estimated = level;
    // An old reading at the target must not acknowledge a later reversal.
    if (this.pending && !this.busy && !this.timer && this.close(this.estimated, this.target!)
      && observedAt * 1000 > this.sentAt + 200) {
      if (this.close(level, this.target!) || (this.corrections >= 2 && Math.abs(level - this.target!) <= this.step)) {
        this.target = undefined;
        this.estimated = level;
        clearTimeout(this.timeout);
      } else if (this.corrections < 3) {
        // ARC can merge repeated keys. Correct from a fresh reading rather
        // than presenting the number of transmitted keys as real volume.
        ++this.corrections;
        this.estimated = level;
        clearTimeout(this.timeout);
        void this.flush();
      } else {
        this.fail("La barra no ha confirmado el porcentaje solicitado. Se muestra el volumen real.");
      }
    }
  }

  public choose(level: number): void {
    if (!Number.isFinite(level)) return;
    if (!this.pending) { this.estimated = this.confirmed; this.corrections = 0; }
    this.target = Math.max(0, Math.min(100, Math.round(level / this.step) * this.step));
    this.error = undefined;
    if (!this.busy) clearTimeout(this.timeout);
    this.changed();
    if (this.busy) return;
    if (!this.timer) this.queuedAt = this.now();
    clearTimeout(this.timer);
    // Debounce taps, but start within 160 ms even during a long drag.
    this.timer = setTimeout(() => { this.timer = undefined; void this.flush(); },
      Math.max(0, Math.min(70, 160 - (this.now() - this.queuedAt))));
  }

  public dispose(): void {
    ++this.generation;
    clearTimeout(this.timer);
    clearTimeout(this.timeout);
    this.timer = undefined;
    this.timeout = undefined;
    this.busy = false;
    this.target = undefined;
    this.error = undefined;
    this.sentAt = 0;
  }

  private close(a: number, b: number): boolean { return Math.abs(a - b) < this.step / 2 + 0.001; }

  private fail(message: string): void {
    this.dispose();
    this.estimated = this.confirmed;
    this.error = message;
    this.changed();
  }

  private async flush(): Promise<void> {
    if (this.target === undefined || this.busy) return;
    const delta = Math.round((this.target - this.estimated) / this.step);
    if (!delta) {
      if (!this.sentAt && this.close(this.confirmed, this.target)) {
        this.target = undefined;
        this.changed();
      } else {
        this.timeout = setTimeout(() => this.fail("No se ha podido confirmar el volumen. Comprueba el valor real e inténtalo de nuevo."), this.confirmationMs);
      }
      return;
    }
    const direction = delta > 0 ? 1 : -1;
    const count = Math.min(5, Math.abs(delta));
    const generation = this.generation;
    this.busy = true;
    this.timeout = setTimeout(() => this.fail("La TV no responde al cambio de volumen."), this.confirmationMs);
    try {
      await this.send(direction, count);
      if (generation !== this.generation) return;
      clearTimeout(this.timeout);
      this.estimated = Math.max(0, Math.min(100, this.estimated + direction * count * this.step));
      this.sentAt = this.now();
      this.busy = false;
      this.changed();
      // Read the latest target after awaiting; intermediate intents are gone.
      await this.flush();
    } catch {
      if (generation === this.generation) this.fail("No se ha podido cambiar el volumen. Inténtalo de nuevo.");
    }
  }
}
