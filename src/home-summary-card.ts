import {LitElement,html,css,nothing,type PropertyValues} from "lit";
import {customElement,property,state} from "lit/decorators.js";
import type {HomeAssistant} from "./kit/types";
import {muteAction,dayForecast,weatherIcon,clockTime,madridDay} from "./home-model";

@customElement("polr-home-summary-card")
export class HomeSummaryCard extends LitElement {
  @property({attribute:false}) hass?:HomeAssistant;
  @state() private config:any={};
  @state() private weather:any={forecast:[],alerts:[]};
  @state() private error="";
  @state() private pending="";
  private loaded=false;
  private timer?:ReturnType<typeof setInterval>;
  setConfig(config:any){this.config={light:"light.lampara",context:"sensor.tv_salon_contexto",remote:"remote.tv_salon",...config};}
  getCardSize(){return 8;}
  override connectedCallback(){super.connectedCallback();this.timer=setInterval(()=>{void this.load();},60000);}
  override disconnectedCallback(){super.disconnectedCallback();clearInterval(this.timer);this.loaded=false;}
  protected override updated(_changed:PropertyValues){
    if(this.hass&&!this.loaded&&this.context.entry_id){this.loaded=true;void this.load();}
    const selector=this.shadowRoot?.querySelector<HTMLSelectElement>("select");
    if(selector)selector.value=this.hass?.states["select.tv_salon_canal"]?.state??"";
  }
  private get context(){return this.hass?.states[this.config.context]?.attributes??{};}
  private async load(){
    if(!this.hass)return;
    try{this.weather=await this.hass.callWS({type:"tv_guide/home",entry_id:this.context.entry_id});}
    catch{this.weather={...this.weather,weather_error:"No se pudo actualizar el tiempo"};}
  }
  private async call(domain:string,service:string,data:Record<string,unknown>,label=""){
    if(this.pending)return;
    this.error="";this.pending=label||service;
    try{await this.hass!.callService(domain,service,data);}
    catch(e){this.error=(e as Error).message||"No se pudo completar la acción";}
    finally{this.pending="";}
  }
  private navigate(path:string){history.pushState(null,"",path);window.dispatchEvent(new CustomEvent("location-changed"));}
  private button(icon:string,label:string,fn:()=>void,disabled=false){return html`<button title=${label} aria-label=${label} ?disabled=${disabled||!!this.pending} @click=${fn}><ha-icon icon=${icon}></ha-icon></button>`;}
  protected override render(){
    if(!this.hass)return nothing;
    const light=this.hass.states[this.config.light];const lit=light?.state==="on";
    const available=!!light&&!["unavailable","unknown"].includes(light.state);
    const brightness=Math.round((light?.attributes.brightness??0)/255*100);
    const context=this.context;const on=this.hass.states[this.config.remote]?.state==="on";
    const off=this.hass.states[this.config.remote]?.state==="off";
    const audio=context.audio??{};const playback=context.playback??{};const mute=muteAction(audio.is_volume_muted);
    const volume=typeof audio.volume_level==="number"?`${Math.round(audio.volume_level*100)} %`:"—";
    const current=context.kind==="tv"?context.current?.title:playback.title;
    const channel=this.hass.states["select.tv_salon_canal"];
    const rain=this.hass.states["sensor.aemet_proxima_precipitacion"];
    const weather=this.hass.states["weather.aemet"];
    const stale=Date.now()/1000-(this.weather.updated||0)>1800;
    const forecast=dayForecast(this.weather.forecast??[]);
    return html`<div class="home">
      <ha-card class="lamp">
        <div class="heading"><span><ha-icon icon="mdi:floor-lamp"></ha-icon><strong>Lámpara</strong><small>${!available?"Sin conexión":lit?`${brightness} %`:"Apagada"}</small></span>${this.button("mdi:power",lit?"Apagar lámpara":"Encender lámpara",()=>void this.call("light",lit?"turn_off":"turn_on",{entity_id:this.config.light}),!available)}</div>
        <div class="brightness"><button ?disabled=${!available||!!this.pending} @click=${()=>void this.call("light","turn_on",{entity_id:this.config.light,brightness_pct:1})}>1 %</button><input aria-label="Intensidad de la lámpara" type="range" min="1" max="100" .value=${String(lit?Math.max(1,brightness):1)} ?disabled=${!available||!!this.pending} @change=${(e:Event)=>void this.call("light","turn_on",{entity_id:this.config.light,brightness_pct:Number((e.target as HTMLInputElement).value)})}><button ?disabled=${!available||!!this.pending} @click=${()=>void this.call("light","turn_on",{entity_id:this.config.light,brightness_pct:100})}>100 %</button></div>
      </ha-card>
      <ha-card class="tv">
        <div class="heading"><span><ha-icon icon="mdi:television"></ha-icon><strong>TV</strong><small class=${on?"live":""}>${on?"Encendida":off?"Apagada":"Sin conexión"}</small></span><div class="row">${this.button("mdi:power",on?"Apagar TV":"Encender TV",()=>void this.call("script","tv_salon_power",{}))}<button class="link" @click=${()=>this.navigate("/mando-tv/mando")}><ha-icon icon="mdi:remote-tv"></ha-icon>Mando</button></div></div>
        ${on?html`<div class="now"><span class="app">${context.label??"TV del salón"}${playback.state==="paused"?" · En pausa":""}</span><strong class="title" title=${current??""}>${current??(context.kind==="home"?"Menú principal":"Contenido no disponible")}</strong></div>`:nothing}
        <div class="volume"><span class="audio"><small>${on?(audio.output_label??"Audio"):"Audio"}</small><strong>${on?(audio.is_volume_muted?"Silencio":volume):"—"}</strong></span><div class="row">${this.button("mdi:volume-minus","Bajar volumen",()=>void this.call("tv_guide","control",{entry_id:context.entry_id,command:"VOLUME_DOWN"}),!on)}${this.button(mute.icon,mute.label,()=>void this.call("tv_guide","control",{entry_id:context.entry_id,command:"MUTE"}),!on)}${this.button("mdi:volume-plus","Subir volumen",()=>void this.call("tv_guide","control",{entry_id:context.entry_id,command:"VOLUME_UP"}),!on)}</div></div>
        <div class="shortcuts"><button @click=${()=>void this.call("script","tv_bluey_ninos",{},"Abriendo Bluey")} ?disabled=${!!this.pending}><img src="/local/tv-remote/icons/bluey.png?v=20260903" alt="">Bluey</button><button @click=${()=>void this.call("script","tv_salon_abrir_app",{aplicacion:"television"},"Abriendo televisión")} ?disabled=${!!this.pending}><ha-icon icon="mdi:television-classic"></ha-icon>Televisión</button></div>
        ${on&&context.kind==="tv"?html`<label class="channel"><span>Canal</span><select aria-label="Cambiar canal" ?disabled=${!!this.pending||!!context.busy} @change=${(e:Event)=>void this.call("select","select_option",{entity_id:"select.tv_salon_canal",option:(e.target as HTMLSelectElement).value},"Cambiando canal")}>${(channel?.attributes.options??[]).map((o:string)=>html`<option value=${o} ?selected=${channel?.state===o}>${o}</option>`)}</select></label>`:nothing}
      </ha-card>
      <ha-card class="weather">
        <div class="heading"><span><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon><strong>Tiempo</strong><small>${weather?.attributes.temperature!=null?`${Math.round(weather.attributes.temperature)}°`:""}</small></span><button class="link" @click=${()=>this.navigate("/tiempo-aemet/resumen")}>Ver más<ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
        <div class="forecast">${forecast.map((f:any)=>html`<div><small>${madridDay(new Date(f.datetime))===madridDay()?"Hoy":madridDay(new Date(f.datetime))===madridDay(new Date(Date.now()+86400000))?"Mañana":new Date(f.datetime).toLocaleDateString("es-ES",{weekday:"short",timeZone:"Europe/Madrid"})}</small><ha-icon icon=${"mdi:"+weatherIcon(f.condition)}></ha-icon><b>${Math.round(f.temperature)}° <span>${f.templow!=null?Math.round(f.templow)+"°":""}</span></b><small class="rain">${f.precipitation_probability!=null?Math.round(f.precipitation_probability)+" %":f.precipitation!=null?f.precipitation+" mm":"—"}</small></div>`)}</div>
        ${stale||this.weather.weather_error?html`<small class="warning">${this.weather.weather_error??"Previsión sin actualizar"}</small>`:nothing}
        <button class="alertline" @click=${()=>this.navigate("/tiempo-aemet/resumen")}><ha-icon icon="mdi:weather-rainy"></ha-icon><span>${rain?.attributes.time?html`Lluvia · ${clockTime(rain.attributes.time)}<small>${rain.attributes.probability??"—"} % · ${rain.attributes.amount??"—"} mm</small>`:rain?.state??"Lluvia: sin datos"}</span></button>
        ${(this.weather.alerts??[]).length?(this.weather.alerts??[]).map((a:any)=>html`<button class=${"alertline "+a.level} @click=${()=>this.navigate("/tiempo-aemet/resumen")}><ha-icon icon="mdi:alert-outline"></ha-icon><span>${a.event}<small>${a.active?"Activo hasta "+clockTime(a.end):clockTime(a.start)} · ${this.weather.zone}</small></span></button>`):html`<div class="alertline quiet"><ha-icon icon="mdi:shield-check-outline"></ha-icon><span>${this.weather.alerts_available?"Sin avisos amarillos, naranjas o rojos":"Avisos: sin datos"}</span></div>`}
      </ha-card>
      ${this.pending?html`<div role="status" class="status">${this.pending}…</div>`:nothing}${this.error?html`<div role="alert" class="error">${this.error}</div>`:nothing}
    </div>`;
  }
  static override styles=css`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.home{max-width:760px;margin:0 auto;padding:8px;display:grid;gap:9px}ha-card{padding:8px 12px;border-radius:18px;overflow:hidden}button,input,select{font:inherit;color:inherit}button{border:0;background:var(--secondary-background-color);border-radius:11px;min-height:44px;min-width:44px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;touch-action:manipulation}button:disabled{opacity:.45;cursor:default}ha-icon{--mdc-icon-size:22px;flex-shrink:0}small{font-size:12px;color:var(--secondary-text-color)}.heading,.heading>span,.row,.volume,.brightness{display:flex;align-items:center;gap:8px}.heading{justify-content:space-between;min-height:44px}.heading strong{font-size:16px}.heading>span{min-width:0;gap:7px}.link{font-size:12px;background:transparent;padding:0 3px}.brightness{margin-top:3px}.brightness button{font-weight:600;font-size:13px;padding:0 12px}.brightness input{flex:1;min-width:0;accent-color:var(--primary-color);height:44px;cursor:pointer}.live{color:var(--success-color,#268657)}.now{padding:3px 0 6px}.app{font-size:12px;color:var(--secondary-text-color)}.title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;line-height:19px;margin-top:2px}.volume{justify-content:space-between;margin:2px 0 5px}.audio{display:grid;gap:2px}.audio strong{font-size:17px;font-variant-numeric:tabular-nums}.shortcuts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.shortcuts button{font-size:13px;font-weight:600}.shortcuts img{width:26px;height:26px;border-radius:6px}.channel{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px;color:var(--secondary-text-color)}select{flex:1;min-width:0;height:44px;padding:0 9px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);font-size:14px;color:var(--primary-text-color)}.forecast{display:grid;grid-template-columns:repeat(5,1fr);padding:4px 0 6px}.forecast>div{display:grid;justify-items:center;gap:3px}.forecast ha-icon{--mdc-icon-size:25px;color:var(--primary-color)}.forecast b{font-size:14px;white-space:nowrap}.forecast b span{color:var(--secondary-text-color);font-weight:400;font-size:12px}.forecast .rain{font-size:11px;color:var(--primary-color)}.alertline{display:flex;gap:9px;text-align:left;width:100%;background:transparent;min-height:44px;border-top:1px solid var(--divider-color);border-radius:0;padding:5px 0;font-size:12px;line-height:16px}.alertline span{min-width:0}.alertline small{display:block;font-size:11px}.alertline ha-icon{--mdc-icon-size:19px;color:var(--primary-color)}.quiet{align-items:center;font-size:11px;color:var(--secondary-text-color)}.amarillo ha-icon{color:#aa7b00}.naranja ha-icon{color:#cf6d00}.rojo ha-icon{color:#d33}.warning{display:block;color:var(--warning-color)}.error,.status{padding:10px;border-radius:10px;background:var(--card-background-color);font-size:13px}.error{color:var(--error-color)}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(min-width:900px){.home{max-width:1160px;grid-template-columns:1fr 1fr;align-items:start;padding:20px;gap:16px}.lamp{grid-column:1}.tv{grid-column:1}.weather{grid-column:2;grid-row:1/span 2}ha-card{padding:14px 18px}.forecast{padding:20px 0}.forecast ha-icon{--mdc-icon-size:36px}.alertline{min-height:55px}.title{font-size:17px;line-height:23px}}`;
}
