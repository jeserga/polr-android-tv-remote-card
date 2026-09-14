import {LitElement,html,css,nothing,type PropertyValues} from "lit";
import {customElement,property,state} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";
import type {HomeAssistant} from "./kit/types";
import {dayBounds,filterChannels,guideDay,guideTime,placement,progress,type GuideChannel,type GuideProgram} from "./guide-model";

@customElement("polr-tv-guide-card")
export class PolrTvGuideCard extends LitElement {
  @property({attribute:false}) hass?: HomeAssistant;
  @state() private config?: {entity:string;compact?:boolean;guide_path?:string};
  @state() private channels:GuideChannel[]=[];
  @state() private programs:GuideProgram[]=[];
  @state() private query="";
  @state() private filter="all";
  @state() private mode="list";
  @state() private day=guideDay();
  @state() private error="";
  @state() private loading=false;
  @state() private selected?:GuideProgram;
  @state() private now=Date.now()/1000;
  @state() private lastDay=guideDay();
  @state() private missing=0;
  private loaded="";
  private requestId=0;
  private timer?:ReturnType<typeof setInterval>;
  private scrolled="";

  setConfig(config:{entity?:string;compact?:boolean;guide_path?:string}) {
    if(!config.entity) throw new Error("Configura la entidad de contexto de la TV");
    this.config={...config,entity:config.entity};this.loaded="";
  }
  getCardSize(){return this.config?.compact?4:12;}
  override connectedCallback(){super.connectedCallback();this.timer=setInterval(()=>{this.now=Date.now()/1000;},30000);}
  override disconnectedCallback(){super.disconnectedCallback();clearInterval(this.timer);this.requestId++;this.loaded="";this.loading=false;}
  private get context(){return this.hass?.states[this.config?.entity??""]?.attributes??{};}
  protected override updated(_changed:PropertyValues){
    // Options arrive asynchronously, after Lit initially sets the property.
    // Reconcile only after rendering so the selector reflects the observed TV.
    const select=this.shadowRoot?.querySelector<HTMLSelectElement>("select");
    if(select)select.value=this.context.channel?.key??"";
    const key=`${this.context.entry_id}:${this.context.guide_revision}:${this.day}:${this.config?.compact}`;
    if(this.hass && this.context.entry_id && key!==this.loaded && !this.loading){this.loaded=key;void this.load();}
    if(this.mode==="guide" && !this.loading && this.scrolled!==this.day){
      const timeline=this.shadowRoot?.querySelector<HTMLElement>(".timeline");
      if(timeline){const [start,end]=dayBounds(this.day);timeline.scrollLeft=Math.max(0,(this.now-start-1800)/(end-start)*2880);this.scrolled=this.day;}
    }
  }
  private async load(){
    const id=++this.requestId;
    this.loading=true;this.error="";
    try {
      const entry_id=this.context.entry_id;
      const [start,end]=dayBounds(this.day);
      const [catalog,epg]=await Promise.all([
        this.hass!.callWS<{channels:GuideChannel[];missing_favorites:string[]}>({type:"tv_guide/catalog",entry_id}),
        this.config?.compact ? Promise.resolve({programs:[] as GuideProgram[],available_end:0}) : this.hass!.callWS<{programs:GuideProgram[];available_end?:number}>({type:"tv_guide/epg",entry_id,start,end}),
      ]);
      if(id!==this.requestId)return;
      this.channels=catalog.channels;this.programs=epg.programs;this.missing=catalog.missing_favorites.length;
      if(epg.available_end)this.lastDay=guideDay(new Date(Math.min(epg.available_end*1000,Date.now()+6*86400000)));
    }catch(e){if(id===this.requestId)this.error=(e as Error).message||"No se pudo cargar la guía";}
    finally {if(id===this.requestId)this.loading=false;}
  }
  private async service(service:string,data:Record<string,unknown>){
    this.error="";
    try {await this.hass!.callService("tv_guide",service,{entry_id:this.context.entry_id,...data});if(service==="refresh"){this.loaded="";this.requestUpdate();}}
    catch(e){this.error=(e as Error).message||"No se pudo completar la acción";}
  }
  private tune(key:string){void this.service("tune_channel",{channel_key:key});}
  private favorite(c:GuideChannel){void this.service("set_favorite",{channel_key:c.key,favorite:!c.favorite});}
  private navigate(path:string){history.pushState(null,"",path);window.dispatchEvent(new CustomEvent("location-changed"));}
  private async details(p:GuideProgram){this.selected=p;await this.updateComplete;this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.showModal();}
  private channelRow(c:GuideChannel){
    const current= this.programs.find(p=>p.channel===c.key && p.start<=this.now && this.now<p.end) ?? (c.current && c.current.start<=this.now && this.now<c.current.end?c.current:undefined);
    return html`<div class="channel ${this.context.channel?.key===c.key?"active":""}">
      <button class="station" @click=${()=>this.tune(c.key)} aria-label=${`Ver ${c.option}`}><span class="dial">${c.number}</span><span><strong>${c.name}</strong><small>${current?.title??"Programación no disponible"}</small></span></button>
      ${current?html`<button class="icon" @click=${()=>this.details(current)} aria-label=${`Información de ${current.title}`}><ha-icon icon="mdi:information-outline"></ha-icon></button>`:nothing}
      <button class="icon star" aria-label=${`${c.favorite?"Quitar":"Añadir"} ${c.name} ${c.favorite?"de":"a"} favoritos`} aria-pressed=${c.favorite} @click=${()=>this.favorite(c)}><ha-icon icon=${c.favorite?"mdi:star":"mdi:star-outline"}></ha-icon></button>
    </div>`;
  }
  private compact(){
    const ctx=this.context;
    const p:GuideProgram|undefined=ctx.current;
    const favorites=this.channels.filter(c=>c.favorite);
    return html`
      ${ctx.kind==="tv"&&ctx.channel?html`<div class="now-playing"><div class="eyebrow">AHORA EN ${ctx.channel.name}</div><h3>${p?.title??"Programación no disponible"}</h3>
        ${p?html`<div class="time-range"><span>${guideTime(p.start)}</span><span>${guideTime(p.end)}</span></div><progress max="100" value=${progress(p,this.now)} aria-label="Progreso del programa"></progress><button class="text-button" @click=${()=>this.details(p)}>Ver información</button>`:nothing}
        ${(ctx.next??[]).length?html`<div class="next">${(ctx.next as GuideProgram[]).map(n=>html`<button @click=${()=>this.details(n)}><time>${guideTime(n.start)}</time><span>${n.title}</span></button>`)}</div>`:nothing}
        <button class="text-button" @click=${()=>{const c=this.channels.find(c=>c.key===ctx.channel.key);if(c)this.favorite(c);}}><ha-icon icon=${ctx.favorite?"mdi:star":"mdi:star-outline"}></ha-icon>${ctx.favorite?"Quitar de favoritos":"Añadir canal a favoritos"}</button>
      </div>`:nothing}
      <div class="section-title">Favoritos</div>
      ${favorites.length?html`<div class="favorites">${favorites.map(c=>html`<button @click=${()=>this.tune(c.key)} class=${ctx.channel?.key===c.key?"chosen":""}>${c.number} · ${c.name}</button>`)}</div>`:html`<p class="hint">Marca una estrella en la lista para guardar los canales de casa.</p>`}
      <label class="select-label">Cambiar de canal<select aria-label="Seleccionar canal" .value=${ctx.channel?.key??""} @change=${(e:Event)=>{const s=e.target as HTMLSelectElement;if(s.value)this.tune(s.value);s.value=ctx.channel?.key??"";}}><option value="">Selecciona un canal…</option>${this.channels.map(c=>html`<option value=${c.key}>${c.option}${c.kind==="radio"?" · Radio":""}</option>`)}</select></label>
      <button class="primary" @click=${()=>this.navigate(this.config?.guide_path??"/mando-tv/guia")}><ha-icon icon="mdi:television-guide"></ha-icon>Canales y guía</button>`;
  }
  private full(){
    const channels=filterChannels(this.channels,this.filter,this.query);
    const [start,end]=dayBounds(this.day);
    return html`<header><div><h2>Canales y guía</h2><p>${this.channels.filter(c=>c.kind==="tv").length} canales de TV · ${this.channels.filter(c=>c.kind==="radio").length} de radio</p></div><button class="text-button" @click=${()=>this.navigate("/mando-tv/mando")}>Volver al mando</button></header>
      <div class="tools"><input type="search" aria-label="Buscar canal o dial" placeholder="Buscar canal o dial" .value=${this.query} @input=${(e:Event)=>this.query=(e.target as HTMLInputElement).value}>
        <div class="pills" role="group" aria-label="Tipo de canal">${[["all","Todos"],["tv","Televisión"],["radio","Radio"],["favorites","Favoritos"]].map(([v,l])=>html`<button aria-pressed=${this.filter===v} @click=${()=>this.filter=v}>${l}</button>`)}</div></div>
      <div class="toolbar"><div class="pills" role="group" aria-label="Presentación">${[["list","Lista"],["guide","Guía"]].map(([v,l])=>html`<button aria-pressed=${this.mode===v} @click=${()=>{this.mode=v;this.scrolled="";}}> ${l} </button>`)}</div>
        ${this.mode==="guide"?html`<input type="date" aria-label="Fecha de la guía" .value=${this.day} min=${guideDay()} max=${this.lastDay} @change=${(e:Event)=>{const value=(e.target as HTMLInputElement).value;if(value){this.day=value;this.scrolled="";}}}><button class="text-button" @click=${()=>{this.day=guideDay();this.scrolled="";}}>Ahora</button>`:nothing}
        <button class="icon" aria-label="Actualizar catálogo y programación" @click=${()=>void this.service("refresh",{})}><ha-icon icon="mdi:refresh"></ha-icon></button></div>
      ${this.mode==="list"?html`<div class="channel-list">${repeat(channels,c=>c.key,c=>this.channelRow(c))}</div>`:html`
        <div class="timeline"><div class="ruler"><div class="sticky">${this.day.split("-").reverse().join("/")}</div><div class="hours">${Array.from({length:Math.round((end-start)/3600)},(_,h)=>html`<span style=${`left:${h*3600/(end-start)*100}%`}>${guideTime(start+h*3600)}</span>`)}</div></div>
          ${channels.map(c=>{const events=this.programs.filter(p=>p.channel===c.key);return html`<div class="track"><button class="sticky" @click=${()=>this.tune(c.key)}><strong>${c.number} · ${c.name}</strong>${c.favorite?" ★":""}</button><div class="slots">${events.length?events.map(p=>{const pos=placement(p,start,end);return html`<button class="slot ${p.start<=this.now&&this.now<p.end?"live":""}" style=${`left:${pos.left}%;width:${pos.width}%`} @click=${()=>this.details(p)} aria-label=${`${c.name}: ${p.title}, ${guideTime(p.start)} a ${guideTime(p.end)}`}><small>${guideTime(p.start)}</small><span>${p.title}</span></button>`;}):html`<span class="no-epg">Programación no disponible</span>`}</div></div>`;})}
        </div>
        <div class="mobile-guide">${channels.map(c=>html`<section>${this.channelRow(c)}<div class="agenda">${this.programs.filter(p=>p.channel===c.key&&p.end>Math.max(start,this.now)).map(p=>html`<button @click=${()=>this.details(p)}><time>${guideTime(p.start)}</time><span>${p.title}</span></button>`)}</div></section>`)}</div>`}
      ${!channels.length?html`<p class="hint">No hay canales con este filtro.</p>`:nothing}
      <footer>Programación de la TV, <a href="https://www.tdtchannels.com" target="_blank" rel="noopener noreferrer">TDTChannels</a> y <a href="https://epgshare01.online" target="_blank" rel="noopener noreferrer">EPGShare01</a>. La cobertura depende de cada emisora.</footer>`;
  }
  protected override render(){
    if(!this.config||!this.hass)return nothing;
    return html`<ha-card><div class="body ${this.config.compact?"compact":""}">
      ${!this.context.entry_id?html`<p class="hint">La guía de la TV no está disponible.</p>`:this.config.compact?this.compact():this.full()}
      ${this.loading?html`<p class="hint" role="status">Actualizando guía…</p>`:nothing}
      ${this.context.busy?html`<p class="notice" role="status">Cambiando a ${this.context.busy}…</p>`:nothing}
      ${this.error||this.context.error?html`<p class="error" role="alert">${this.error||this.context.error} <button class="text-button" @click=${()=>void this.load()}>Reintentar</button></p>`:nothing}
      ${this.missing?html`<p class="hint">${this.missing} favorito(s) ya no aparecen en el catálogo de la TV.</p>`:nothing}
      <dialog @close=${()=>this.selected=undefined}>${this.selected?html`<div class="details"><button class="close icon" aria-label="Cerrar información" @click=${()=>this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.close()}><ha-icon icon="mdi:close"></ha-icon></button><div class="eyebrow">${this.channels.find(c=>c.key===this.selected!.channel)?.name}</div><h2>${this.selected.title}</h2><p>${guideTime(this.selected.start)} – ${guideTime(this.selected.end)}</p><p class="description">${this.selected.description||"Sin descripción disponible."}</p><small>Programación: ${{tv:"Televisión",tdtchannels:"TDTChannels",epgshare01:"EPGShare01"}[this.selected.source]??this.selected.source}</small><button class="primary" @click=${()=>{this.tune(this.selected!.channel);this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.close();}}>Ver canal ahora</button></div>`:nothing}</dialog>
    </div></ha-card>`;
  }
  static override styles=css`
    :host{display:block}*{box-sizing:border-box}ha-card{overflow:hidden}.body{padding:20px;color:var(--primary-text-color)}h2,h3,p{margin:0}h2{font-size:22px}h3{font-size:19px;line-height:1.35;margin:5px 0 10px}button,input,select{font:inherit;color:inherit}button{cursor:pointer;border:0;background:transparent;touch-action:manipulation}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}button:disabled{opacity:.5}.icon{padding:10px;border-radius:50%;display:inline-grid;place-items:center;flex-shrink:0}.star[aria-pressed=true]{color:#e8ae23}ha-icon{--mdc-icon-size:22px}.primary{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--primary-color);color:var(--text-primary-color,#fff);padding:12px 18px;border-radius:12px;width:100%;margin-top:16px;font-weight:600}.text-button{color:var(--primary-color);padding:8px 4px;display:inline-flex;align-items:center;gap:6px}.hint{color:var(--secondary-text-color);font-size:13px;line-height:1.5;margin:10px 0}.eyebrow{font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--secondary-text-color);text-transform:uppercase}.time-range{display:flex;justify-content:space-between;font-size:12px;color:var(--secondary-text-color)}progress{width:100%;height:5px;accent-color:var(--primary-color)}.now-playing{padding-bottom:15px;margin-bottom:15px;border-bottom:1px solid var(--divider-color)}.next{display:grid;margin:8px 0}.next button,.agenda button{display:flex;gap:12px;padding:7px 0;text-align:left;font-size:13px}.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}time{color:var(--secondary-text-color);font-variant-numeric:tabular-nums;flex-shrink:0}.section-title{font-weight:600;margin:8px 0}.favorites{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.favorites button,.pills button{background:var(--secondary-background-color);padding:9px 13px;border-radius:20px;font-size:13px}.favorites .chosen,.pills [aria-pressed=true]{background:var(--primary-color);color:var(--text-primary-color,#fff)}.select-label{display:grid;gap:7px;font-size:13px;margin-top:15px}select,input{background:var(--card-background-color);border:1px solid var(--divider-color);padding:11px 12px;border-radius:10px;min-width:0}header{display:flex;justify-content:space-between;gap:12px;align-items:center}header p{color:var(--secondary-text-color);font-size:13px;margin-top:5px}.tools{display:flex;gap:15px;margin:20px 0 12px;flex-wrap:wrap}.tools input{flex:1;min-width:180px}.pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.toolbar{display:flex;gap:12px;align-items:center;margin-bottom:15px}.toolbar .icon{margin-left:auto}.channel{display:flex;align-items:center;border-bottom:1px solid var(--divider-color);min-height:68px}.channel.active{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.station{display:flex;align-items:center;gap:14px;text-align:left;padding:12px 8px;flex:1;min-width:0}.station>span:last-child{min-width:0}.station strong{font-size:14px}.station small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--secondary-text-color);font-size:12px;margin-top:4px}.dial{min-width:32px;color:var(--secondary-text-color);font-size:18px;font-variant-numeric:tabular-nums}.channel-list{max-height:70vh;overflow:auto}.timeline{overflow:auto;max-height:70vh;border:1px solid var(--divider-color);border-radius:12px}.track,.ruler{display:grid;grid-template-columns:160px 2880px;min-width:3040px}.sticky{position:sticky;left:0;z-index:3;background:var(--card-background-color);text-align:left;padding:12px;font-size:13px;border-right:1px solid var(--divider-color);overflow:hidden}.track{border-bottom:1px solid var(--divider-color)}.ruler{position:sticky;top:0;z-index:4;background:var(--secondary-background-color);height:42px}.ruler .sticky{background:var(--secondary-background-color)}.hours,.slots{position:relative}.hours span{position:absolute;top:13px;font-size:12px;padding-left:6px;color:var(--secondary-text-color)}.slots{height:65px}.slot{position:absolute;top:5px;height:55px;border-radius:6px;background:var(--secondary-background-color);border-right:2px solid var(--card-background-color);padding:6px 8px;text-align:left;overflow:hidden}.slot small{display:block;color:var(--secondary-text-color);font-size:10px}.slot span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;margin-top:4px}.slot.live{background:color-mix(in srgb,var(--primary-color) 20%,var(--card-background-color));box-shadow:inset 3px 0 var(--primary-color)}.no-epg{font-size:12px;color:var(--secondary-text-color);padding:22px;display:block;position:sticky;left:160px;width:260px}.mobile-guide{display:none}footer{font-size:11px;color:var(--secondary-text-color);line-height:1.5;margin-top:18px}a{color:var(--primary-color)}.notice,.error{padding:12px;border-radius:10px;background:var(--secondary-background-color);font-size:13px;margin-top:12px}.error{color:var(--error-color)}dialog{border:1px solid var(--divider-color);border-radius:18px;max-width:520px;width:calc(100% - 32px);padding:0;color:var(--primary-text-color);background:var(--card-background-color);box-shadow:0 15px 60px #0005}dialog::backdrop{background:#0008}.details{padding:26px}.details h2{font-size:21px;margin:10px 25px 10px 0}.details p{margin:12px 0;font-size:14px;line-height:1.5}.description{white-space:pre-line;max-height:40vh;overflow:auto}.details small{color:var(--secondary-text-color)}.close{position:absolute;right:8px;top:8px}.agenda{padding:0 12px 14px}.agenda button{width:100%}.agenda span{text-align:left}
    @media(max-width:700px){.body{padding:16px}header{align-items:flex-start}header h2{font-size:20px}.tools{display:block}.tools input{width:100%;margin-bottom:12px}.toolbar{gap:6px;flex-wrap:wrap}.toolbar input{max-width:150px}.timeline{display:none}.mobile-guide{display:block;max-height:70vh;overflow:auto}.track{display:none}}
    @media(hover:hover) and (pointer:fine){button:hover{filter:brightness(.94);background-color:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color))}.primary:hover{background:var(--primary-color)}}
  `;
}
