import {LitElement,html,css,nothing,type PropertyValues} from "lit";
import {customElement,property,state} from "lit/decorators.js";
import type {HomeAssistant} from "./kit/types";
import {duration,clockTime,madridDay,sessionsFromSegments} from "./home-model";
import {dayBounds} from "./guide-model";

const labels:Record<string,string>={homeassistant:"Home Assistant",observed:"Observado",physical_button:"Botón físico",infrared:"Receptor IR",airmouse:"AirMouse",virtual_remote:"Mando virtual",external_input:"Entrada externa",system:"Sistema",command:"Acción",input:"Pulsación",power:"Encendido/apagado",playback:"Reproducción",audio:"Audio",error:"Error",monitor:"Seguimiento"};

@customElement("polr-tv-history-card")
export class HistoryCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config:any={};
  @state() private result:any={events:[],segments:[],daily:[]};
  @state() private from=madridDay();
  @state() private to=madridDay();
  @state() private kind="";
  @state() private origin="";
  @state() private query="";
  @state() private mode="sessions";
  @state() private error="";
  @state() private loading=false;
  private loaded=false;
  private generation=0;
  private timer?:ReturnType<typeof setInterval>;
  setConfig(config:any){this.config={entity:"sensor.tv_salon_contexto",...config};}
  getCardSize(){return 12;}
  private get allowed(){return !!this.config.user_id&&this.hass?.user?.id===this.config.user_id;}
  override connectedCallback(){super.connectedCallback();this.timer=setInterval(()=>{if(this.allowed&&!this.loading&&this.mode!=="events"&&this.to===madridDay())void this.load();},15000);}
  protected override updated(_changed:PropertyValues){if(this.allowed&&!this.loaded){this.loaded=true;void this.load();}if(!this.allowed&&this.loaded){this.loaded=false;this.result={events:[],segments:[],daily:[]};this.generation++;}}
  override disconnectedCallback(){super.disconnectedCallback();clearInterval(this.timer);this.generation++;this.loaded=false;this.loading=false;this.result={events:[],segments:[],daily:[]};}
  private async load(more=false){
    if(!this.allowed)return;
    const generation=++this.generation;this.loading=true;this.error="";
    try{
      const data=await this.hass!.callWS<any>({type:"tv_guide/history",entry_id:this.hass?.states[this.config.entity]?.attributes.entry_id,start:dayBounds(this.from)[0],end:dayBounds(this.to)[1],kind:this.kind,origin:this.origin,query:this.query,before:more?this.result.next:undefined});
      if(generation!==this.generation||!this.allowed)return;
      this.result=more?{...data,events:[...this.result.events,...data.events]}:data;
    }catch(e){if(generation===this.generation)this.error=(e as Error).message||"No se pudo leer el historial";}
    finally{if(generation===this.generation)this.loading=false;}
  }
  protected override render(){
    if(!this.allowed)return html`<ha-card><p class="denied">Este historial es privado. No tienes acceso.</p></ha-card>`;
    const sessions=sessionsFromSegments(this.result.segments??[]);
    const sum=(key:string)=>(this.result.daily??[]).reduce((s:number,d:any)=>s+(d[key]??0),0);
    return html`<ha-card><div class="body"><header><div><h2>Historial de la TV</h2><p>Privado · jeserga · Horas de Madrid</p></div><button aria-label="Actualizar historial" @click=${()=>void this.load()}><ha-icon icon="mdi:refresh"></ha-icon></button></header>
      <div class="tools"><label>Desde<input type="date" .value=${this.from} @change=${(e:Event)=>this.from=(e.target as HTMLInputElement).value}></label><label>Hasta<input type="date" .value=${this.to} @change=${(e:Event)=>this.to=(e.target as HTMLInputElement).value}></label><button @click=${()=>void this.load()} ?disabled=${this.loading}>Consultar</button></div>
      <div class="stats"><div><strong>${duration(sum("on_seconds"))}</strong><small>Encendida · observado</small></div><div><strong>${duration(sum("playing_seconds"))}</strong><small>Reproduciendo</small></div><div><strong>${duration(sum("unknown_seconds"))}</strong><small>Sin estado conocido</small></div></div>
      <nav>${[["sessions","Sesiones"],["events","Acciones"],["daily","Resúmenes diarios"]].map(([v,l])=>html`<button aria-pressed=${this.mode===v} @click=${()=>{this.mode=v;void this.load();}}>${l}</button>`)}</nav>
      ${this.error?html`<p role="alert" class="error">${this.error}</p>`:nothing}
      ${this.result.health?.dropped||Object.keys(this.result.health?.errors??{}).length?html`<div class="notice">${Object.values(this.result.health?.errors??{}).join(" · ")}${this.result.health?.dropped?` · ${this.result.health.dropped} eventos no guardados`:""}</div>`:nothing}
      ${this.result.segments_truncated?html`<p class="notice">Se muestran los 1000 tramos más recientes. Acorta el intervalo para consultar sesiones anteriores; los totales diarios incluyen todo el intervalo.</p>`:nothing}
      ${this.loading?html`<p role="status">Consultando…</p>`:nothing}
      ${this.mode==="sessions"?html`<div class="sessions">${sessions.map(s=>html`<details><summary><span><strong>${clockTime(s.start,true)} → ${s.active?"En curso":clockTime(s.end,true)}</strong><small>${duration(s.observed)} de encendido observado</small></span><ha-icon icon="mdi:chevron-down"></ha-icon></summary><div class="contents">${s.contents.map((c:any)=>html`<div><time>${clockTime(c.start)}</time><span><strong>${c.title??c.app??"Contenido no disponible"}</strong><small>${[c.app,c.channel,c.playback==="paused"?"En pausa":null].filter(Boolean).join(" · ")} · ${duration(c.end-c.start)}</small></span></div>`)}</div></details>`)}</div>${!sessions.length?html`<p class="empty">Sin sesiones registradas en este intervalo.</p>`:nothing}`:nothing}
      ${this.mode==="events"?html`<div class="filters"><select aria-label="Tipo de evento" .value=${this.kind} @change=${(e:Event)=>{this.kind=(e.target as HTMLSelectElement).value;void this.load();}}><option value="">Todos los eventos</option>${["power","playback","command","input","audio","error","monitor"].map(k=>html`<option value=${k}>${labels[k]}</option>`)}</select><select aria-label="Origen del evento" .value=${this.origin} @change=${(e:Event)=>{this.origin=(e.target as HTMLSelectElement).value;void this.load();}}><option value="">Todos los orígenes</option>${["homeassistant","observed","physical_button","infrared","airmouse","virtual_remote","system"].map(k=>html`<option value=${k}>${labels[k]}</option>`)}</select><input type="search" aria-label="Buscar aplicación, canal o acción" placeholder="Aplicación, canal o acción" .value=${this.query} @change=${(e:Event)=>{this.query=(e.target as HTMLInputElement).value;void this.load();}}></div><div class="events">${this.result.events.map((e:any)=>html`<details><summary><time>${clockTime(e.ts,true)}</time><span><strong>${labels[e.kind]??e.kind} · ${e.action??"Cambio"}</strong><small>${labels[e.origin]??e.origin}${e.app?" · "+e.app:""}${e.title?" · "+e.title:""}</small></span></summary><div class="event-detail">${Object.entries(e.data??{}).map(([k,v])=>html`<div><b>${k}</b><span>${typeof v==="object"?JSON.stringify(v):String(v??"—")}</span></div>`)}${e.actor?html`<div><b>Usuario HA</b><span>${e.actor===this.hass?.user?.id?"jeserga":e.actor}</span></div>`:nothing}</div></details>`)}</div>${this.result.next?html`<button class="more" @click=${()=>void this.load(true)} ?disabled=${this.loading}>Cargar más acciones</button>`:nothing}`:nothing}
      ${this.mode==="daily"?html`<div class="days">${this.result.daily.map((d:any)=>html`<details><summary><strong>${d.day}</strong><span>${duration(d.on_seconds)} encendida</span></summary><div class="event-detail"><p>Reproduciendo: ${duration(d.playing_seconds??0)} · Pausa: ${duration(d.paused_seconds??0)} · Sin estado: ${duration(d.unknown_seconds??0)}</p>${["app_seconds","channel_seconds"].map(key=>Object.entries(d[key]??{}).sort((a:any,b:any)=>b[1]-a[1]).map(([name,seconds])=>html`<div><b>${name}</b><span>${duration(Number(seconds))}</span></div>`))}<p>${Object.entries(d.events??{}).map(([k,v])=>`${labels[k]??k}: ${v}`).join(" · ")}</p></div></details>`)}</div>`:nothing}
      <footer>Detalle: 12 meses. Resúmenes diarios: sin caducidad. Las pérdidas de comunicación y las causas no demostradas se registran como incertidumbre. El registro comienza con la instalación de este seguimiento.</footer>
    </div></ha-card>`;
  }
  static override styles=css`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.body{padding:22px;max-width:1200px;margin:auto}h2,p{margin:0}h2{font-size:23px}header{display:flex;justify-content:space-between;align-items:center}header p{font-size:12px;color:var(--secondary-text-color);margin-top:6px}button,input,select{font:inherit;color:inherit}button{border:0;min-height:44px;border-radius:10px;background:var(--secondary-background-color);padding:8px 12px;cursor:pointer;touch-action:manipulation}button:disabled{opacity:.4}input,select{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:9px;padding:10px;min-width:0;min-height:44px}.tools{display:flex;gap:12px;align-items:end;margin:20px 0}.tools label{display:grid;gap:5px;font-size:12px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stats>div{padding:16px;background:var(--secondary-background-color);border-radius:12px;display:grid;gap:6px}.stats strong{font-size:23px}.stats small,small{font-size:12px;color:var(--secondary-text-color)}nav{display:flex;gap:8px;margin:18px 0;flex-wrap:wrap}nav [aria-pressed=true]{background:var(--primary-color);color:var(--text-primary-color,#fff)}details{border-bottom:1px solid var(--divider-color)}summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 4px;cursor:pointer;min-height:60px;font-size:13px}summary small{display:block;margin-top:5px}summary strong{font-size:13px}summary time{font-size:12px;min-width:110px;color:var(--secondary-text-color)}summary>span{flex:1;min-width:0}summary::-webkit-details-marker{display:none}.contents{padding:0 6px 15px}.contents>div{display:flex;gap:14px;padding:10px 0}.contents time{font-size:11px;min-width:110px;color:var(--secondary-text-color)}.contents strong{font-size:13px}.contents small{display:block;margin-top:4px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.filters input{flex:1;min-width:150px}.event-detail{padding:10px 12px 18px;font-size:12px;overflow-wrap:anywhere}.event-detail>div{display:flex;gap:20px;padding:5px 0;justify-content:space-between}.event-detail>div b{min-width:90px;font-weight:500}.event-detail>div span{text-align:right;white-space:pre-wrap}.event-detail p{margin:10px 0}.error{color:var(--error-color);padding:14px}.notice{font-size:12px;background:var(--secondary-background-color);padding:12px;border-radius:10px}.empty{padding:24px 0;color:var(--secondary-text-color);font-size:13px}.more{margin-top:15px}footer{font-size:11px;color:var(--secondary-text-color);line-height:1.5;margin-top:25px}.denied{padding:24px}button:focus-visible,summary:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(max-width:600px){.body{padding:14px}.tools{gap:7px;flex-wrap:wrap}.tools label{flex:1}.tools input{width:100%;font-size:12px}.stats>div{padding:10px 8px}.stats strong{font-size:17px}.stats small{font-size:10px}summary{gap:9px}summary time{min-width:90px;font-size:10px}.contents time{min-width:88px;font-size:10px}.contents strong{font-size:12px}.filters select{flex:1;font-size:12px}nav{gap:5px}nav button{font-size:12px;padding:7px 9px}}`;
}
