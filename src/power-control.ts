import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./kit/types";
import type { Playback } from "./playback-model";
import { countdown, durationSeconds, exactMadridTime, madridInput, type IdleStandby, type ScheduledPowerOff } from "./power-model";

declare global { interface HTMLElementTagNameMap { "polr-power-control": PowerControl; } }

@customElement("polr-power-control")
class PowerControl extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() entryId?: string;
  @property({ type: Boolean }) tvOn = false;
  @property({ attribute: false }) playback: Playback = {};
  @property({ attribute: false }) powerOff: ScheduledPowerOff = {};
  @property({ attribute: false }) idleStandby: IdleStandby = {};
  @state() private expanded = false;
  @state() private mode: "duration" | "clock" = "duration";
  @state() private hours = "0";
  @state() private minutes = "30";
  @state() private seconds = "0";
  @state() private at = madridInput(Date.now() + 30 * 60000);
  @state() private estimatedItem?: string;
  private estimatedAtIso?: string;
  @state() private busy = false;
  @state() private error = "";
  @state() private now = Date.now() / 1000;
  private ticker?: ReturnType<typeof setInterval>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.ticker = setInterval(() => { this.now = Date.now() / 1000; }, 1000);
  }
  override disconnectedCallback(): void { super.disconnectedCallback(); clearInterval(this.ticker); }

  private async service(name: string, data: Record<string, unknown>): Promise<void> {
    if (!this.hass || this.busy) return;
    this.busy = true; this.error = "";
    try { await this.hass.callService("tv_guide", name, { entry_id: this.entryId, ...data }); }
    catch (error) { this.error = error instanceof Error ? error.message : String(error); }
    finally { this.busy = false; }
  }

  private async schedule(): Promise<void> {
    if (!this.tvOn) { this.error = "Enciende la TV para programar el apagado."; return; }
    if (this.mode === "duration") {
      const seconds = durationSeconds(this.hours, this.minutes, this.seconds);
      if (seconds === null) { this.error = "Introduce de 1 segundo a 30 días; minutos y segundos entre 0 y 59."; return; }
      await this.service("schedule_power_off", { duration_seconds: seconds });
    } else {
      if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(this.at)) { this.error = "Selecciona una fecha y hora válidas."; return; }
      if (this.estimatedItem && this.estimatedItem !== this.playback.item_id) { this.error = "La reproducción ha cambiado; vuelve a calcular el final."; return; }
      await this.service("schedule_power_off", { turn_off_at: this.estimatedAtIso || this.at });
    }
  }

  private async usePlaybackEnd(): Promise<void> {
    if (!this.hass || this.busy) return;
    this.busy = true; this.error = "";
    try {
      const result = await this.hass.callWS<{ turn_off_at: string; item_id: string }>({ type: "tv_guide/playback_end", entry_id: this.entryId });
      if (result.item_id !== this.playback.item_id) throw new Error("La reproducción ha cambiado; vuelve a calcular el final.");
      this.at = result.turn_off_at.slice(0, 19);
      this.estimatedItem = result.item_id;
      this.estimatedAtIso = result.turn_off_at;
      this.mode = "clock";
    } catch (error) { this.error = error instanceof Error ? error.message : String(error); }
    finally { this.busy = false; }
  }

  protected override render() {
    const deadline = this.powerOff.active && typeof this.powerOff.deadline === "number" ? this.powerOff.deadline : null;
    const effective = this.idleStandby.effective_hours;
    return html`<section aria-label="Apagado de la TV">
      <button class="section-toggle" type="button" aria-expanded=${this.expanded} @click=${() => { this.expanded = !this.expanded; this.error = ""; }}>
        <ha-icon icon="mdi:timer-outline"></ha-icon><span>Apagado programado</span><ha-icon icon=${this.expanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${deadline !== null ? html`<div class="status" role="status">Se apagará el ${exactMadridTime(deadline)} <span>· Quedan ${countdown(deadline, this.now)}</span></div>` : nothing}
      ${this.powerOff.error ? html`<div class="error" role="alert">${this.powerOff.error}</div>` : nothing}
      ${this.expanded ? html`<div class="body">
        <div class="modes" role="group" aria-label="Forma de programar el apagado">
          <button type="button" class=${this.mode === "duration" ? "selected" : ""} @click=${() => { this.mode = "duration"; this.estimatedItem = undefined; this.estimatedAtIso = undefined; }}>Dentro de</button>
          <button type="button" class=${this.mode === "clock" ? "selected" : ""} @click=${() => { this.mode = "clock"; this.estimatedItem = undefined; this.estimatedAtIso = undefined; }}>A una hora</button>
        </div>
        ${this.mode === "duration" ? html`<div class="duration">
          <label>Horas<input type="number" min="0" max="720" step="1" inputmode="numeric" .value=${this.hours} @input=${(e: Event) => { this.hours = (e.target as HTMLInputElement).value; }}></label>
          <label>Minutos<input type="number" min="0" max="59" step="1" inputmode="numeric" .value=${this.minutes} @input=${(e: Event) => { this.minutes = (e.target as HTMLInputElement).value; }}></label>
          <label>Segundos<input type="number" min="0" max="59" step="1" inputmode="numeric" .value=${this.seconds} @input=${(e: Event) => { this.seconds = (e.target as HTMLInputElement).value; }}></label>
        </div>` : html`<div class="clock">
          <label for="sleep-at">Fecha y hora de Madrid</label><input id="sleep-at" type="datetime-local" step="1" .value=${this.at} @input=${(e: Event) => { this.at = (e.target as HTMLInputElement).value; this.estimatedItem = undefined; this.estimatedAtIso = undefined; }}>
          <button type="button" ?disabled=${this.busy || !this.tvOn} @click=${this.usePlaybackEnd}>Al terminar lo que se reproduce</button>
          ${this.estimatedItem ? html`<small>Hora fija calculada con la reproducción actual.</small>` : nothing}
        </div>`}
        <div class="actions"><button class="primary" type="button" ?disabled=${this.busy || !this.tvOn} @click=${this.schedule}>${this.busy ? "Un momento…" : deadline !== null ? "Cambiar apagado" : "Programar apagado"}</button>
          ${deadline !== null ? html`<button type="button" ?disabled=${this.busy} @click=${() => this.service("cancel_power_off", {})}>Cancelar apagado</button>` : nothing}</div>
        ${!this.tvOn ? html`<small>Enciende la TV para programar un apagado.</small>` : nothing}
        <div class="idle"><div><strong>Evitar apagado por inactividad</strong><small>${this.idleStandby.enabled ? this.idleStandby.pending ? "Aplicando ajuste…" : `Activo: ${effective ?? "?"} horas sin interacción` : "Ajuste de fábrica de la TV"}</small></div>
          <button type="button" role="switch" aria-checked=${Boolean(this.idleStandby.enabled)} ?disabled=${this.busy} @click=${() => this.service("set_idle_standby", { enabled: !this.idleStandby.enabled })}>${this.idleStandby.enabled ? "Desactivar" : "Activar"}</button></div>
        ${this.idleStandby.error ? html`<div class="error" role="alert">${this.idleStandby.error}</div>` : nothing}
        ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}
      </div>` : nothing}
    </section>`;
  }

  static override styles = css`
    :host{display:block}section{border-top:1px solid var(--divider-color,#ddd);border-bottom:1px solid var(--divider-color,#ddd);font-size:13px}
    button,input{font:inherit}button{min-height:42px;border:0;border-radius:10px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer;padding:7px 12px}button:disabled{opacity:.5;cursor:default}
    .section-toggle{display:flex;align-items:center;gap:8px;width:100%;padding:8px 16px;background:transparent;text-align:left}.section-toggle span{flex:1;font-weight:600}.section-toggle ha-icon{--mdc-icon-size:20px}
    .status{padding:0 16px 9px;color:var(--primary-text-color);font-variant-numeric:tabular-nums}.status span{color:var(--secondary-text-color)}
    .body{padding:0 16px 13px}.modes,.actions{display:flex;gap:8px;flex-wrap:wrap}.modes button{flex:1}.modes .selected,.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}
    .duration{display:flex;gap:9px;margin:10px 0}.duration label{flex:1;min-width:0}.duration input{width:100%;box-sizing:border-box;margin-top:4px}
    .clock{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0}.clock label{width:100%}.clock input{min-width:0;flex:1}.clock small{width:100%}
    input{height:42px;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:8px;padding:0 7px;background:var(--card-background-color);color:var(--primary-text-color);font-variant-numeric:tabular-nums}
    .actions{margin:10px 0}.idle{display:flex;align-items:center;gap:8px;border-top:1px solid var(--divider-color);margin-top:13px;padding-top:12px}.idle>div{flex:1}.idle small,small{display:block;color:var(--secondary-text-color);font-size:11px;margin-top:3px}.error{color:var(--error-color);font-size:12px;padding:5px 16px}
  `;
}
