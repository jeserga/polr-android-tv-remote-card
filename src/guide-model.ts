export interface GuideProgram { channel: string; id: string; title: string; description: string; start: number; end: number; source: string }
export interface GuideChannel { key: string; name: string; number: string; option: string; kind: string; favorite: boolean; browsable: boolean; current?: GuideProgram; epg_id?: string }

export const guideTime = (seconds: number): string => new Intl.DateTimeFormat("es-ES", {timeZone:"Europe/Madrid", hour:"2-digit", minute:"2-digit"}).format(new Date(seconds*1000));
export const guideDay = (date = new Date()): string => new Intl.DateTimeFormat("en-CA", {timeZone:"Europe/Madrid", year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
export function dayBounds(day: string): [number, number] {
  const [y,m,d] = day.split("-").map(Number);
  const midnight = (utc: number): number => {
    let guess = utc;
    for(let i=0;i<3;i++) {
      const parts = new Intl.DateTimeFormat("en-GB", {timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(new Date(guess));
      const p = Object.fromEntries(parts.map(x=>[x.type,Number(x.value)]));
      guess += utc - Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
    }
    return guess/1000;
  };
  return [midnight(Date.UTC(y,m-1,d)),midnight(Date.UTC(y,m-1,d+1))];
}
export function filterChannels(channels: GuideChannel[], filter: string, query: string): GuideChannel[] {
  const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const term=normalize(query.trim());
  return channels.filter(c=>(filter==="all" || (filter==="favorites" ? c.favorite : c.kind===filter)) && normalize(`${c.number} ${c.name}`).includes(term));
}
export function progress(p: GuideProgram, now: number): number {
  return p.end>p.start ? Math.max(0,Math.min(100,(now-p.start)/(p.end-p.start)*100)) : 0;
}
export function placement(p: GuideProgram, start: number, end: number): {left:number;width:number} {
  return {left:Math.max(0,(p.start-start)/(end-start)*100),width:Math.max(0,(Math.min(end,p.end)-Math.max(start,p.start))/(end-start)*100)};
}
