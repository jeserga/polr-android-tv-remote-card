import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DeviceState } from "./atv";
import { press, type PressCoordinator } from "./press";
import type { HomeAssistant } from "./kit/types";
import { VolumeIntent } from "./volume-intent";

@customElement("polr-volume-control")
export class VolumeControl extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public device?: DeviceState;
  @property({ attribute: false }) public coordinator?: PressCoordinator;
  @property({ type: Number }) public step = 1;
  @property({ type: Boolean }) public haptics = true;
  private intent?: VolumeIntent;
  private identity = "";

  public override disconnectedCallback(): void {
    this.intent?.dispose();
    this.intent = undefined;
    super.disconnectedCallback();
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const d = this.device;
    const identity = `${d?.remoteId}/${d?.volumeId}/${d?.volumeOutput}/${this.step}`;
    if (!this.intent || identity !== this.identity) {
      this.intent?.dispose();
      this.identity = identity;
      this.intent = new VolumeIntent(this.step, async (direction, count) => {
        if (!this.hass || !this.device?.on || !this.device.available) throw new Error("TV no disponible");
        await this.hass.callService("remote", "send_command", {
          entity_id: this.device.remoteId,
          command: direction > 0 ? "VOLUME_UP" : "VOLUME_DOWN",
          num_repeats: count,
          delay_secs: 0.12,
        }, undefined, false);
      }, () => this.requestUpdate());
    }
    const entity = d?.volumeId ? this.hass?.states[d.volumeId] : undefined;
    if (typeof d?.volume === "number") {
      const observedAt = entity?.attributes.observed_at ?? Date.parse(entity?.last_updated ?? "") / 1000;
      this.intent.observe(d.volume * 100, observedAt);
    }
  }

  private adjust(direction: number): void {
    if (this.intent) this.intent.choose(this.intent.value + direction * this.step);
  }

  protected override render() {
    const d = this.device;
    const intent = this.intent;
    if (!d || !intent) return nothing;
    const pending = intent.pending;
    const percent = Math.round(intent.value);
    const muted = d.muted === true;
    const buttonOptions = (direction: number) => ({
      onPress: () => this.adjust(direction), repeat: true, haptics: this.haptics,
      claimTouch: true, coordinator: this.coordinator,
    });
    return html`
      <div class="buttons">
        <button type="button" aria-label="Bajar volumen" ${press(buttonOptions(-1))}><ha-icon icon="mdi:volume-minus"></ha-icon></button>
        <button type="button" aria-label=${muted ? "Activar sonido" : "Silenciar"} aria-pressed=${String(muted)}
          ${press({ onPress: () => this.dispatchEvent(new CustomEvent("volume-mute")), haptics: this.haptics, claimTouch: true, coordinator: this.coordinator })}>
          <ha-icon icon=${muted ? "mdi:volume-high" : "mdi:volume-off"}></ha-icon>
        </button>
        <button type="button" aria-label="Subir volumen" ${press(buttonOptions(1))}><ha-icon icon="mdi:volume-plus"></ha-icon></button>
      </div>
      <div class="level ${pending ? "pending" : ""}">
        <input type="range" min="0" max="100" .step=${String(this.step)} .value=${String(intent.value)} aria-label="Volumen deseado" aria-valuetext=${`${percent} %${pending ? ", pendiente de aplicar" : ""}`}
          @input=${(event: Event) => intent.choose(Number((event.target as HTMLInputElement).value))}>
        <output>${percent} %</output>
      </div>
      <div class="status" role="status" aria-live="polite">
        ${pending ? html`<span class="pending-label"><ha-icon icon="mdi:progress-clock"></ha-icon>Aplicando…</span><span>Confirmado: ${Math.round(intent.confirmed)} %</span>` : d.volumeOutput}
        ${muted ? html`<span>Silencio</span>` : nothing}
      </div>
      ${intent.error ? html`<div class="error" role="alert">${intent.error}</div>` : nothing}
    `;
  }

  static override styles = css`
    :host{display:block;padding:0 12px 10px;color:var(--primary-text-color)}
    *{box-sizing:border-box}button,input{font:inherit}button{color:inherit;background:var(--secondary-background-color,rgba(127,127,127,.12));border:0;border-radius:12px;min-height:44px;cursor:pointer;touch-action:manipulation}
    .buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.buttons ha-icon{--mdc-icon-size:24px}
    .level{display:flex;align-items:center;gap:12px;min-height:44px}.level input{flex:1;min-width:0;min-height:44px;margin:0;accent-color:var(--tile-color,var(--primary-color));cursor:pointer}
    output{font-size:16px;font-weight:600;min-width:52px;text-align:right;font-variant-numeric:tabular-nums}
    .pending output,.pending-label{color:var(--warning-color,#b77900)}.pending output{border-bottom:2px dotted currentColor}
    .status{min-height:20px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--secondary-text-color)}.pending-label{display:inline-flex;align-items:center;gap:4px}.status ha-icon{--mdc-icon-size:16px}
    .error{margin-top:6px;color:var(--error-color);font-size:12px;line-height:1.4}
    button:focus-visible,input:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
  `;
}
