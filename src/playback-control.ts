import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./kit/types";
import { playbackPosition, playbackTime, parsePlaybackTime, type Playback } from "./playback-model";

declare global { interface HTMLElementTagNameMap { "polr-playback-control": PlaybackControl; } }

@customElement("polr-playback-control")
class PlaybackControl extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) playback: Playback = {};
  @property() entryId?: string;
  @state() private now = Date.now() / 1000;
  @state() private draft: number | null = null;
  @state() private text = "";
  @state() private editing = false;
  @state() private busy = false;
  @state() private error = "";
  private item?: string;
  private seekItem?: string;
  private timer?: ReturnType<typeof setInterval>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.timer = setInterval(() => { this.now = Date.now() / 1000; }, 1000);
  }
  override disconnectedCallback(): void { super.disconnectedCallback(); clearInterval(this.timer); }
  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("playback") && this.item !== this.playback.item_id) {
      this.item = this.playback.item_id; this.draft = null; this.text = ""; this.editing = false; this.error = "";
    }
  }
  private async seek(position: number | null): Promise<void> {
    if (this.seekItem && this.seekItem !== this.playback.item_id) { this.error = "El contenido ha cambiado; selecciona de nuevo la posición."; this.draft = null; return; }
    if (position === null || position < 0 || position >= (this.playback.duration || 0)) { this.error = "Usa hh:mm:ss dentro de la duración del vídeo."; return; }
    if (!this.hass || this.busy || !playbackPosition(this.playback, Date.now() / 1000).canSeek) return;
    const item = this.playback.item_id;
    this.busy = true; this.error = "";
    try {
      await this.hass.callService("tv_guide", "jellyfin_seek", { entry_id: this.entryId, expected_item_id: item, position });
      if (this.playback.item_id === item) { this.draft = null; this.editing = false; }
    } catch (error) { this.error = error instanceof Error ? error.message : String(error); }
    finally { this.busy = false; }
  }
  protected override render() {
    const p = this.playback;
    if (p.source !== "jellyfin" || !["playing", "paused"].includes(p.state || "")) return nothing;
    const live = playbackPosition(p, this.now);
    const position = this.draft ?? live.position;
    const disabled = !live.canSeek || this.busy;
    return html`<section aria-label="Reproducción de Jellyfin">
      <div class="title"><ha-icon icon="mdi:play-circle-outline"></ha-icon><strong>${p.title}</strong></div>
      <div class="times"><span>${p.state === "paused" ? "En pausa · " : ""}${playbackTime(position)} / ${playbackTime(p.duration || 0)}</span><span>Quedan ${playbackTime((p.duration || 0) - position)}</span></div>
      <input class="range" type="range" min="0" max=${Math.max(0, Math.floor(p.duration || 0) - 1)} step="1" .value=${String(Math.floor(position))} ?disabled=${disabled} aria-label="Posición de reproducción en segundos"
        @pointerdown=${() => { this.seekItem = p.item_id; }} @keydown=${() => { this.seekItem = p.item_id; }}
        @input=${(e: Event) => { this.draft = Number((e.target as HTMLInputElement).value); }}
        @change=${(e: Event) => this.seek(Number((e.target as HTMLInputElement).value))}>
      <div class="seek"><label for="position">Ir a</label><input id="position" type="text" inputmode="numeric" placeholder="hh:mm:ss" aria-label="Momento exacto, horas minutos y segundos" .value=${this.editing ? this.text : playbackTime(position)} ?disabled=${disabled}
        @focus=${() => { this.editing = true; this.text = playbackTime(position); this.seekItem = p.item_id; }} @input=${(e: Event) => { this.text = (e.target as HTMLInputElement).value; }} @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") void this.seek(parsePlaybackTime(this.text)); }}>
        <button ?disabled=${disabled} @click=${() => this.seek(parsePlaybackTime(this.editing ? this.text : playbackTime(position)))}>${this.busy ? "…" : "Ir"}</button>
        ${!live.fresh ? html`<small>Sin lectura reciente</small>` : !p.seekable ? html`<small>Sin salto disponible</small>` : nothing}
      </div>${p.state === "paused" ? html`<small class="pause-hint">Al saltar, Jellyfin reanuda brevemente y vuelve a pausar.</small>` : nothing}${this.error ? html`<div role="alert" class="error">${this.error}</div>` : nothing}
    </section>`;
  }
  static override styles = css`
    :host{display:block}section{padding:10px 16px;border-top:1px solid var(--divider-color,#ddd);border-bottom:1px solid var(--divider-color,#ddd)}
    .title{display:flex;align-items:center;gap:6px;font-size:13px}.title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}ha-icon{--mdc-icon-size:20px;flex:none}
    .times{display:flex;justify-content:space-between;gap:6px;font-size:11px;color:var(--secondary-text-color);margin-top:5px;font-variant-numeric:tabular-nums}.range{width:100%;height:44px;margin:0;accent-color:var(--primary-color)}
    .seek{display:flex;align-items:center;gap:8px;font-size:12px}.seek input{min-width:0;width:85px;background:var(--secondary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:8px;padding:0 8px;height:42px;text-align:center;font:inherit;font-variant-numeric:tabular-nums}
    button{height:44px;min-width:44px;border:0;border-radius:10px;color:var(--primary-text-color);background:var(--secondary-background-color);cursor:pointer}button:disabled,input:disabled{opacity:.45}.error{font-size:12px;color:var(--error-color);margin-top:6px}.pause-hint{display:block;font-size:10px;color:var(--secondary-text-color);margin-top:5px}
  `;
}
