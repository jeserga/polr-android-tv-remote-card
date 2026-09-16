import {LitElement,html,css,nothing,type PropertyValues} from "lit";
import {customElement,property,state} from "lit/decorators.js";
import type {HomeAssistant} from "./kit/types";
import {duration} from "./home-model";

@customElement("polr-jellyfin-card")
export class JellyfinCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config:any={};
  @state() private items:any[]=[];
  @state() private libraries:any[]=[];
  @state() private trail:any[]=[];
  @state() private query="";
  @state() private kind="all";
  @state() private total=0;
  @state() private start=0;
  @state() private loading=false;
  @state() private sending=false;
  @state() private error="";
  @state() private message="";
  @state() private selected:any;
  private images=new Map<string,string>();
  private loaded=false;
  private request=0;
  private delay?:ReturnType<typeof setTimeout>;
  setConfig(config:any){this.config={entity:"sensor.tv_salon_contexto",...config};}
  getCardSize(){return 12;}
  private get context(){return this.hass?.states[this.config.entity]?.attributes??{};}
  protected override updated(_changed:PropertyValues){if(this.hass&&this.context.entry_id&&!this.loaded){this.loaded=true;void this.load();}}
  override disconnectedCallback(){super.disconnectedCallback();this.request++;this.loaded=false;this.loading=false;clearTimeout(this.delay);}
  private async api(data:Record<string,unknown>){return await this.hass!.callWS<any>({type:"tv_guide/jellyfin",entry_id:this.context.entry_id,...data});}
  private async load(){
    const request=++this.request;this.loading=true;this.error="";
    try{
      const result=await this.api({parent:this.trail[this.trail.length-1]?.id,query:this.query,kind:this.kind,start:this.start});
      if(request!==this.request)return;
      this.items=result.items;this.total=result.total;this.libraries=result.libraries;
      void this.loadImages(request,[...this.items]);
    }catch(e){if(request===this.request)this.error=(e as Error).message||"No se pudo cargar Jellyfin";}
    finally{if(request===this.request)this.loading=false;}
  }
  private async loadImages(request:number,items:any[]){
    let index=0;
    await Promise.all(Array.from({length:4},async()=>{
      while(index<items.length&&request===this.request){
        const item=items[index++];if(!item.image||this.images.has(item.id))continue;
        try{const result=await this.api({image:item.id});if(request===this.request){this.images.set(item.id,result.image);this.requestUpdate();}}
        catch{/* Keep a usable title tile if an image is missing. */}
      }
    }));
  }
  private browse(item:any){this.trail=[...this.trail,item];this.start=0;this.query="";this.kind="all";void this.load();}
  private async choose(item:any){
    if(item.folder){this.browse(item);return;}
    this.error="";
    try{this.selected=await this.api({item:item.id});await this.updateComplete;this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.showModal();}
    catch(e){this.error=(e as Error).message;}
  }
  private async play(position:number){
    if(this.sending)return;
    this.sending=true;this.error="";this.message="Preparando la TV y verificando Adultos…";
    this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.close();
    try{
      await this.hass!.callService("tv_guide","jellyfin_play",{entry_id:this.context.entry_id,item_id:this.selected.id,start_seconds:position});
      this.message="Reproducción confirmada en la TV del salón";
    }catch(e){this.error=(e as Error).message||"No se pudo iniciar la reproducción";this.message="";}
    finally{this.sending=false;if(!this.error)void this.load();}
  }
  protected override render(){
    const selected=this.selected;
    return html`<ha-card><div class="body"><header><div><h2>Jellyfin <small>Adultos</small></h2><p>Elige qué ver en la TV del salón.</p></div><button aria-label="Actualizar catálogo" @click=${()=>void this.load()}><ha-icon icon="mdi:refresh"></ha-icon></button></header>
      <div class="tools"><input type="search" aria-label="Buscar en Jellyfin" placeholder="Buscar película, serie o episodio" .value=${this.query} @input=${(e:Event)=>{this.query=(e.target as HTMLInputElement).value;this.start=0;clearTimeout(this.delay);this.delay=setTimeout(()=>void this.load(),300);}}><select aria-label="Filtrar catálogo" .value=${this.kind} @change=${(e:Event)=>{this.kind=(e.target as HTMLSelectElement).value;this.start=0;void this.load();}}><option value="all">Todo</option><option value="Movie">Películas</option><option value="Series">Series</option><option value="resume">Continuar viendo</option></select></div>
      <nav aria-label="Bibliotecas"><button @click=${()=>{this.trail=[];this.start=0;void this.load();}}>Catálogo</button>${this.trail.map((p,i)=>html`<span>›</span><button @click=${()=>{this.trail=this.trail.slice(0,i+1);this.start=0;void this.load();}}>${p.name}</button>`)}</nav>
      ${!this.trail.length?html`<div class="libraries">${this.libraries.map(l=>html`<button @click=${()=>this.browse(l)}>${l.name}</button>`)}</div>`:nothing}
      ${this.error?html`<div role="alert" class="error">${this.error}<button @click=${()=>void this.load()}>Reintentar</button></div>`:nothing}
      ${this.message?html`<div role="status" class="notice">${this.sending?(this.context.jellyfin_operation?.message??this.message):this.message}</div>`:nothing}
      ${this.loading?html`<p role="status">Cargando catálogo…</p>`:nothing}
      <div class="catalog" aria-busy=${this.loading}>${this.items.map(item=>html`<button class="poster" @click=${()=>void this.choose(item)} ?disabled=${this.sending} aria-label=${item.name}><div class="art">${this.images.has(item.id)?html`<img src=${this.images.get(item.id)} alt="" loading="lazy">`:html`<ha-icon icon=${item.folder?"mdi:folder-play-outline":"mdi:movie-open-outline"}></ha-icon>`}${item.played?html`<span class="seen">Visto</span>`:nothing}${item.position>0?html`<span class="progress" style=${`width:${Math.min(100,item.position/Math.max(1,item.duration)*100)}%`}></span>`:nothing}</div><strong>${item.name}</strong><small>${item.series?`${item.series} · T${item.season} E${item.episode}`:item.year??item.type}</small>${item.position>0?html`<small>Quedan ${duration(item.remaining)}</small>`:nothing}</button>`)}</div>
      ${!this.loading&&!this.items.length?html`<p>No hay contenido para este filtro.</p>`:nothing}
      <footer><button ?disabled=${!this.start||this.loading} @click=${()=>{this.start=Math.max(0,this.start-40);void this.load();}}>Anterior</button><span>${this.total?`${this.start+1}–${Math.min(this.start+40,this.total)} de ${this.total}`:"0 resultados"}</span><button ?disabled=${this.start+40>=this.total||this.loading} @click=${()=>{this.start+=40;void this.load();}}>Siguiente</button></footer>
      <dialog @click=${(e:MouseEvent)=>{if(e.target===e.currentTarget)(e.currentTarget as HTMLDialogElement).close();}}><div class="details"><button class="close" aria-label="Cerrar" @click=${()=>this.shadowRoot?.querySelector<HTMLDialogElement>("dialog")?.close()}><ha-icon icon="mdi:close"></ha-icon></button>${selected?html`<h2>${selected.name}</h2>${selected.series?html`<p>${selected.series} · Temporada ${selected.season}, episodio ${selected.episode}</p>`:nothing}<p>${duration(selected.duration)}${selected.played?" · Marcado como visto":""}</p>${selected.position>0?html`<div class="notice"><strong>Te quedaste en ${duration(selected.position)}</strong><p>Quedan ${duration(selected.remaining)} · ${Math.round(selected.position/Math.max(1,selected.duration)*100)} % reproducido</p></div>`:html`<p>Sin punto de reanudación guardado.</p>`}<p class="overview">${selected.overview}</p>${selected.can_play?html`<div class="choices">${selected.position>0?html`<button class="primary" @click=${()=>void this.play(selected.position)}>Continuar desde ${duration(selected.position)}</button>`:nothing}<button @click=${()=>void this.play(0)}>Reproducir desde el principio</button></div>`:html`<p>Este contenido no puede reproducirse en la TV.</p>`}`:nothing}</div></dialog>
    </div></ha-card>`;
  }
  static override styles=css`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.body{padding:20px;max-width:1400px;margin:auto}h2,p{margin:0}h2{font-size:23px}h2 small{font-size:13px;font-weight:400;color:var(--secondary-text-color)}header{display:flex;justify-content:space-between;align-items:center}header p{font-size:13px;color:var(--secondary-text-color);margin-top:6px}button,input,select{font:inherit;color:inherit}button{min-height:44px;border:0;border-radius:10px;background:var(--secondary-background-color);padding:8px 14px;cursor:pointer;touch-action:manipulation}button:disabled{opacity:.45;cursor:default}.tools{display:flex;gap:10px;margin:20px 0 10px}input,select{border:1px solid var(--divider-color);border-radius:10px;padding:12px;background:var(--card-background-color);min-width:0}input{flex:1}nav,.libraries{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0}nav button{background:transparent;padding:4px 8px;font-size:13px}.libraries button{border-radius:24px;font-size:12px}.catalog{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:20px 14px;margin-top:20px}.poster{display:block;text-align:left;background:none;padding:0;min-width:0;align-self:start}.art{aspect-ratio:2/3;background:var(--secondary-background-color);border-radius:12px;overflow:hidden;position:relative;display:grid;place-items:center}.art img{width:100%;height:100%;object-fit:cover}.art ha-icon{--mdc-icon-size:45px;color:var(--secondary-text-color)}.poster strong{display:block;font-size:14px;margin-top:8px;line-height:19px}.poster small{display:block;color:var(--secondary-text-color);font-size:11px;margin-top:4px}.seen{position:absolute;top:6px;right:6px;background:#164c3cdd;color:white;padding:3px 6px;border-radius:6px;font-size:10px}.progress{height:5px;position:absolute;bottom:0;left:0;background:var(--primary-color)}footer{display:flex;justify-content:center;gap:14px;align-items:center;margin-top:24px;font-size:12px}.notice,.error{padding:14px;background:var(--secondary-background-color);border-radius:10px;margin:12px 0;font-size:13px}.error{color:var(--error-color)}.error button{margin-left:8px}.notice p{margin-top:7px}dialog{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:20px;padding:0;width:calc(100% - 28px);max-width:560px;max-height:90dvh}dialog::backdrop{background:#0008}.details{padding:26px}.details h2{padding-right:30px}.details p{margin-top:12px;font-size:14px;line-height:1.5}.close{position:absolute;right:8px;top:8px;padding:8px}.overview{max-height:25vh;overflow:auto}.choices{display:grid;gap:10px;margin-top:20px}.choices button{min-height:48px}.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(max-width:600px){.body{padding:14px}.tools{flex-wrap:wrap}.tools input{flex-basis:100%}.tools select{flex:1}.catalog{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 9px}.poster strong{font-size:12px;line-height:16px}.poster small{font-size:10px}.details{padding:22px}.details h2{font-size:20px}}`;
}
