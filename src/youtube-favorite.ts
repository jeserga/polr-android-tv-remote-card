import {LitElement, html, css, nothing, type PropertyValues} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import type {HomeAssistant} from "./kit/types";

declare global { interface HTMLElementTagNameMap { "polr-youtube-favorite": YouTubeFavorite; } }

@customElement("polr-youtube-favorite")
class YouTubeFavorite extends LitElement {
  @property({attribute:false}) hass?: HomeAssistant;
  @property({attribute:false}) entryId?: string;
  @property({attribute:false}) favoriteId = "luli_pampin";
  @property({attribute:false}) operation?: any;
  @property({attribute:false}) queue?: any;
  @state() private catalog?: any;
  @state() private choosing = false;
  @state() private error = "";
  @state() private pending = false;
  private loaded = false;
  private backdropPressed = false;
  private get name() {return this.favoriteId === "sunny_bunnies" ? "Sunny Bunnies" : "Luli Pampín";}
  private get count() {return this.catalog?.videos.length ?? (this.favoriteId === "sunny_bunnies" ? 50 : 30);}
  private get icon() {return this.favoriteId === "sunny_bunnies" ? "sunny-bunnies" : "luli-pampin";}
  private get currentQueue() {return (!this.queue?.favorite_id || this.queue.favorite_id === this.favoriteId) ? this.queue : undefined;}


  protected override updated(_changed: PropertyValues) {
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
    if (this.hass && !this.loaded) {this.loaded = true; void this.load();}
  }
  private async load() {
    this.error = "";
    try {this.catalog = await this.hass!.callWS({type:"tv_guide/youtube_playlist",entry_id:this.entryId,favorite_id:this.favoriteId});}
    catch (e) {this.error = (e as Error).message || "No se pudo cargar la lista";}
  }
  private close() {this.dispatchEvent(new CustomEvent("close",{bubbles:true,composed:true}));}
  private async play(videoId?: string) {
    if (this.pending || this.operation?.state === "running") return;
    this.pending = true; this.error = "";
    try {
      await this.hass!.callService("tv_guide","youtube_playlist_play",{entry_id:this.entryId,...(this.favoriteId === "sunny_bunnies" ? {favorite_id:this.favoriteId}:{}),...(videoId?{video_id:videoId}:{})});
      this.close();
    } catch (e) {this.error = (e as Error).message || "No se pudo reproducir la lista";}
    finally {this.pending = false;}
  }
  protected override render() {
    const busy = this.pending || this.operation?.state === "running";
    return html`<dialog aria-labelledby="luli-title" @cancel=${(e:Event)=>{e.preventDefault();this.close();}} @pointerdown=${(e:PointerEvent)=>{this.backdropPressed=e.target===e.currentTarget;}} @click=${(e:MouseEvent)=>{if(this.backdropPressed&&e.target===e.currentTarget)this.close();this.backdropPressed=false;}}>
      <div class="content">
        <div class="heading"><img src=${"/local/tv-remote/icons/"+this.icon+".png?v=20261003"} alt=""><div><h2 id="luli-title">${this.name}</h2><p>Los ${this.count} vídeos más populares</p></div><button class="icon" aria-label="Cerrar" @click=${()=>this.close()}>✕</button></div>
        <div class="actions"><button class="shuffle" ?disabled=${busy||!this.catalog} @click=${()=>void this.play()}><ha-icon icon="mdi:shuffle-variant"></ha-icon>Reproducción aleatoria</button><button aria-expanded=${String(this.choosing)} ?disabled=${!this.catalog} @click=${()=>{this.choosing=!this.choosing;}}><ha-icon icon="mdi:playlist-play"></ha-icon>Elegir vídeo</button></div>
        <p class="explanation">${this.choosing?`Elige el primero. Después se reproducirán los otros ${this.count-1} en orden aleatorio, sin repetir.`:`Reproduce los ${this.count} en orden aleatorio, sin repetir vídeos.`}</p>
        ${this.currentQueue?.active?html`<p role="status">Vídeo ${this.currentQueue.index} de ${this.count} · ${this.currentQueue.remaining} pendientes</p>`:nothing}
        ${this.currentQueue?.error?html`<p class="error" role="alert">${this.currentQueue.error}</p>`:nothing}
        ${this.operation?.state==="running"?html`<p role="status">${this.operation.message}</p>`:nothing}
        ${this.error?html`<p class="error" role="alert">${this.error}</p>`:nothing}
        ${!this.catalog&&this.error?html`<button @click=${()=>void this.load()}>Volver a cargar</button>`:nothing}
        ${!this.catalog&&!this.error?html`<p role="status">Cargando lista…</p>`:nothing}
        ${this.choosing&&this.catalog?html`<ol>${this.catalog.videos.map((v:any)=>html`<li><button class="video" ?disabled=${busy} @click=${()=>void this.play(v.video_id)}><span class="rank">${v.rank}</span><span class="details"><strong>${v.title}</strong><small>${v.views_label} · ${v.duration_label}</small></span><ha-icon icon="mdi:play"></ha-icon></button><a href=${v.url} target="_blank" rel="noopener noreferrer" aria-label=${"Abrir "+v.title+" en YouTube"} title="Ver en YouTube"><ha-icon icon="mdi:open-in-new"></ha-icon></a></li>`)}</ol><p class="source">Orden «Populares» del <a href=${this.catalog.source_url} target="_blank" rel="noopener noreferrer">canal oficial</a> · ${this.catalog.fetched_at}</p>`:nothing}
      </div>
    </dialog>`;
  }
  static override styles = css`
    :host{color:var(--primary-text-color)}*{box-sizing:border-box}dialog{position:fixed;margin:auto;border:1px solid var(--divider-color);border-radius:20px;padding:0;width:min(620px,calc(100vw - 24px));max-height:calc(100dvh - 32px);background:var(--ha-card-background,var(--card-background-color,#fff));color:inherit;box-shadow:0 16px 60px #0005}dialog::backdrop{background:#0008}.content{padding:18px}.heading{display:flex;align-items:center;gap:12px}.heading img{width:44px;height:44px;border-radius:12px}.heading>div{flex:1;min-width:0}h2{font-size:21px;margin:0}p{margin:8px 0;font-size:14px;line-height:1.5}.heading p{color:var(--secondary-text-color);margin:3px 0}.actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}button,a{font:inherit;color:inherit;touch-action:manipulation}button{border:0;cursor:pointer;min-height:48px;border-radius:12px;background:var(--secondary-background-color,#eee);display:flex;justify-content:center;align-items:center;gap:8px;padding:10px}.icon{min-width:44px;background:transparent}.shuffle{color:var(--text-primary-color,#fff);background:var(--primary-color,#03a9f4)}button:disabled{opacity:.45;cursor:default}.explanation,.source{color:var(--secondary-text-color);font-size:13px}.error{color:var(--error-color)}ol{padding:0;margin:14px 0;list-style:none}li{display:flex;align-items:stretch;border-top:1px solid var(--divider-color)}.video{flex:1;min-width:0;text-align:left;background:transparent;justify-content:flex-start;border-radius:6px;padding:12px 4px;gap:10px}.rank{width:24px;flex-shrink:0;color:var(--secondary-text-color);font-size:14px;text-align:center}.details{flex:1;min-width:0;display:grid;gap:5px}.details strong{font-size:14px;line-height:1.4;overflow-wrap:anywhere}.details small{font-size:12px;color:var(--secondary-text-color)}li>a{width:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center}ha-icon{--mdc-icon-size:22px;flex-shrink:0}button:focus-visible,a:focus-visible{outline:2px solid var(--primary-color);outline-offset:-2px}@media(max-width:420px){.content{padding:14px}.actions{grid-template-columns:1fr}}
  `;
}
