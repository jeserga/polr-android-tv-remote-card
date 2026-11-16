/** Optimistic selection only. The server owns actuation and confirmation. */
export class VolumeIntent {
  public target?: number;
  public confirmed = 0;
  public pending = false;
  public error?: string;
  private queued?: number;
  private timer?: ReturnType<typeof setTimeout>;
  private queuedAt = 0;
  private busy = false;
  private generation = 0;
  private ack?: string;
  private failedRevision?: number;
  private server: Record<string, any> = {};
  public constructor(
    private readonly step: number,
    private readonly send: (percent: number) => Promise<{ context?: { id?: string } }>,
    private readonly changed: () => void,
    private readonly now = () => Date.now(),
  ) {}
  public get value(): number { return this.target ?? this.confirmed; }
  public observe(level: number, server: Record<string, any>): void {
    this.confirmed = level;
    this.server = server;
    this.applyServer();
  }
  private applyServer(): void {
    if (this.failedRevision !== undefined && (this.server.volume_revision ?? 0) <= this.failedRevision) return;
    this.failedRevision = undefined;
    if (this.busy || this.queued !== undefined || this.timer) return;
    if (this.ack && this.server.volume_request_id !== this.ack) return;
    this.ack = undefined;
    this.pending = this.server.volume_status === 'applying';
    this.error = this.server.volume_error ?? undefined;
    this.target = this.pending || this.error ? (this.server.volume_target ?? this.confirmed / 100) * 100 : undefined;
  }
  public choose(level: number): void {
    if (!Number.isFinite(level)) return;
    this.target = Math.max(0, Math.min(100, Math.round(level / this.step) * this.step));
    this.queued = this.target;
    this.pending = true;
    this.error = undefined;
    this.failedRevision = undefined;
    this.ack = undefined;
    this.changed();
    if (this.busy) return;
    if (!this.timer) this.queuedAt = this.now();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.timer = undefined; void this.flush(); }, Math.max(0, Math.min(70, 160 - (this.now() - this.queuedAt))));
  }
  public dispose(): void {
    ++this.generation;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.queued = undefined;
    this.busy = false;
  }
  private async flush(): Promise<void> {
    if (this.queued === undefined || this.busy) return;
    const target = this.queued;
    const generation = this.generation;
    this.queued = undefined;
    this.busy = true;
    try {
      const response = await this.send(target);
      if (generation !== this.generation) return;
      this.busy = false;
      this.ack = response.context?.id;
      if (this.queued !== undefined) await this.flush();
      else this.applyServer();
      this.changed();
    } catch {
      if (generation !== this.generation) return;
      this.busy = false;
      if (this.queued !== undefined) { await this.flush(); return; }
      this.failedRevision = this.server.volume_revision ?? 0;
      this.pending = false;
      this.queued = undefined;
      this.error = 'No se ha podido enviar el volumen solicitado.';
      this.changed();
    }
  }
}
