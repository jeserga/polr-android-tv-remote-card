export const duration=(seconds:number|undefined|null):string=>{
  if(seconds==null||!Number.isFinite(seconds))return "—";
  const minutes=Math.floor(Math.max(0,seconds)/60);
  if(minutes===0)return `${Math.floor(Math.max(0,seconds))} s`;
  return minutes>=60?`${Math.floor(minutes/60)} h ${minutes%60} min`:`${minutes} min`;
};
export const clockTime=(value:string|number,seconds=false):string=>new Date(typeof value==="number"?value*1000:value).toLocaleString("es-ES",{timeZone:"Europe/Madrid",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",...(seconds?{second:"2-digit" as const}:{})});
export const madridDay=(date=new Date()):string=>date.toLocaleDateString("sv-SE",{timeZone:"Europe/Madrid"});
export const muteAction=(muted:unknown)=>({icon:muted===true?"mdi:volume-high":"mdi:volume-off",label:muted===true?"Activar sonido":muted===false?"Silenciar":"Alternar silencio (estado desconocido)"});
export const weatherIcon=(condition:string)=>({sunny:"weather-sunny",clear:"weather-sunny","clear-night":"weather-night",cloudy:"weather-cloudy",partlycloudy:"weather-partly-cloudy",rainy:"weather-rainy",pouring:"weather-pouring",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",snowy:"weather-snowy",fog:"weather-fog",windy:"weather-windy"}[condition]??"weather-partly-cloudy");
export const dayForecast=(forecast:any[],now=new Date())=>{
  const today=madridDay(now);
  return forecast.filter(f=>f.datetime&&madridDay(new Date(f.datetime))>=today).slice(0,5);
};
export function sessionsFromSegments(segments:any[],now=Date.now()/1000){
  const sorted=[...segments].sort((a,b)=>a.start-b.start);
  const sessions:any[]=[];
  let separated=true;
  for(const s of sorted){
    if(s.power!=="on"){separated=true;continue;}
    const last=sessions[sessions.length-1];
    if(last&&!separated&&s.start-last.end<=20){last.end=s.end;last.observed+=Math.max(0,s.end-s.start);last.contents.push(s);}
    else sessions.push({start:s.start,end:s.end,observed:Math.max(0,s.end-s.start),contents:[s]});
    separated=false;
  }
  const latest=sorted[sorted.length-1];
  return sessions.reverse().map(s=>({...s,active:latest?.power==="on"&&s.end===latest.end&&now-s.end<20}));
}
