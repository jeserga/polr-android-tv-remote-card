import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./kit/types";

declare global { interface HTMLElementTagNameMap { "polr-soundbar-control": SoundbarControl; } }

interface SoundbarState {
  power?: string; connected?: boolean; volume_level?: number; keep_awake?: boolean;
  suspended?: boolean; error?: string; busy?: boolean; limitation?: string;
  capabilities?: { on?: boolean; off?: boolean; keep_awake?: boolean; bass?: boolean; treble?: boolean };
}

@customElement("polr-soundbar-control")
class SoundbarControl extends LitElement {
  @property({attribute:false}) hass?: HomeAssistant;
  @property({attribute:false}) soundbar?: SoundbarState;
  @property() entryId?: string;
  @property({type:Boolean}) tvOn = false;
  @state() private busy = false;
  @state() private error = "";
  private async send(service: string, data = {}): Promise<void> {
    if (!this.hass || this.busy) return;
    this.busy = true; this.error = "";
    try { await this.hass.callService("tv_guide", service, {entry_id:this.entryId,...data}); }
    catch(error) { this.error = error instanceof Error ? error.message : String(error); }
    finally { this.busy = false; }
  }
  protected override render() {
    const s=this.soundbar;
    if(!s) return nothing;
    const on=s.power==="on", cap=s.capabilities||{};
    const label=on?"Encendida":s.power==="standby"?"En reposo":s.connected===false?"No detectada":"Sin lectura actual";
    return html`<section aria-label="Barra de sonido">
      <div class="heading"><ha-icon icon="mdi:soundbar"></ha-icon><strong>Hisense HS2100</strong><span>${label}${on&&typeof s.volume_level==="number"?` · ${Math.round(s.volume_level*100)} %`:""}</span></div>
      <div class="buttons"><button ?disabled=${this.busy||s.busy||!this.tvOn||!cap.on||on} @click=${()=>this.send("soundbar_on")}><ha-icon icon="mdi:power"></ha-icon>Encender barra</button>
        <button ?disabled=${this.busy||s.busy||!this.tvOn||!cap.off||!on} title=${cap.off?"Apagar la barra":"Usa el mando de la barra para apagarla"} @click=${()=>this.send("soundbar_off")}><ha-icon icon="mdi:power-standby"></ha-icon>Apagar barra</button></div>
      <label class="lock"><ha-icon icon=${s.keep_awake?"mdi:lock":"mdi:lock-open-variant-outline"}></ha-icon><span>Reactivar si se duerme</span><input type="checkbox" role="switch" .checked=${!!s.keep_awake} ?disabled=${this.busy||!cap.keep_awake} @change=${(e:Event)=>this.send("soundbar_keep_awake",{enabled:(e.target as HTMLInputElement).checked})}></label>
      <p>Solo con la TV encendida. Puede haber una pausa breve al reactivarse.</p>
      ${s.limitation?html`<p>${s.limitation}</p>`:nothing}
      ${s.suspended?html`<p class="error">Reactivación detenida tras tres fallos. Desactiva y activa el interruptor para reintentar.</p>`:nothing}
      ${this.error||s.error?html`<p class="error" role="alert">${this.error||s.error}</p>`:nothing}
    </section>`;
  }
  static override styles=css`
    :host{display:block}section{padding:14px 16px;border-top:1px solid var(--divider-color,#ddd)}.heading{display:flex;gap:7px;align-items:center;font-size:13px}.heading span{margin-left:auto;font-size:11px;color:var(--secondary-text-color)}ha-icon{--mdc-icon-size:20px;flex:none}
    .buttons{display:flex;gap:8px;margin-top:10px}.buttons button{flex:1;min-width:0;height:44px;border:0;border-radius:10px;background:var(--secondary-background-color);color:var(--primary-text-color);display:flex;gap:5px;align-items:center;justify-content:center;font-size:12px;cursor:pointer}button:disabled{opacity:.45;cursor:default}
    .lock{display:flex;gap:8px;align-items:center;min-height:44px;font-size:13px;cursor:pointer}.lock input{margin-left:auto;width:22px;height:22px;accent-color:var(--primary-color)}p{font-size:11px;color:var(--secondary-text-color);margin:4px 0;line-height:1.4}.error{color:var(--error-color)}
  `;
}
