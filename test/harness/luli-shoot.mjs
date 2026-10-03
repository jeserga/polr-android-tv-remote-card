import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox','--allow-file-access-from-files']});
const out=resolve('test/harness/shots-luli');mkdirSync(out,{recursive:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:393,height:873,isMobile:true,hasTouch:true});
 await page.goto(pathToFileURL(resolve('test/harness/index.html')).href,{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.title==='ready');
 await page.evaluate(async()=>{
  const viewport=document.createElement('meta');viewport.name='viewport';viewport.content='width=device-width, initial-scale=1';document.head.append(viewport);
  document.body.innerHTML='';document.body.style.padding='0';window.calls=[];
  const catalog={source_url:'https://www.youtube.com/@Lulipampin_oficial/videos',fetched_at:'2026-10-03',videos:Array.from({length:30},(_,i)=>({rank:i+1,video_id:i?'video'+String(i).padStart(6,'0'):'Y_Qr50S0-B8',title:i?'Vídeo '+(i+1):'Luli Pampín - CAMINO POR LA SELVA🙊🐍🦁🐘 - Official Video',url:'https://www.youtube.com/watch?v='+(i?'video'+String(i).padStart(6,'0'):'Y_Qr50S0-B8'),views_label:(1600-i*40)+' millones de visualizaciones',duration_label:'4:48'}))};
  window.home=document.createElement('polr-home-summary-card');home.setConfig({context:'sensor.ctx',remote:'remote.test'});
  window.remote=document.createElement('polr-android-tv-remote-card');remote.setConfig({entity:'remote.test',context_entity:'sensor.ctx',show_section_labels:true,sections:[{name:'Favoritos niños',columns:3,buttons:[{name:'Bluey',icon:'mdi:play',action:{action:'service',service:'script.tv_bluey_ninos'}},...['luli_pampin','sunny_bunnies'].map((id,i)=>({name:i?'Sunny Bunnies':'Luli Pampín',icon:'mdi:youtube',action:{action:'service',service:'tv_guide.youtube_kids_play',data:{entry_id:'test',favorite_id:id}}}))]}]});
  window.setState=async(state)=>{const hass={states:{'remote.test':{state:'on',attributes:{}},'sensor.ctx':{state:'app',attributes:{entry_id:'test',youtube_operation:state?{state,message:state==='error'?'No se pudo verificar Paloma':'Preparando Luli Pampín'}:null}},'light.lampara':{state:'off',attributes:{}}},entities:{},callWS:async(m)=>m.type==='tv_guide/youtube_playlist'?catalog:{forecast:[],alerts:[]},callService:async(domain,service,data)=>{calls.push({domain,service,data});return {};}};home.hass=hass;remote.hass=hass;await Promise.all([home.updateComplete,remote.updateComplete]);};
  document.body.append(home,remote);await setState(null);
 });
 const open=async(card,label)=>{const b=await page.evaluateHandle((card,label)=>window[card].shadowRoot.querySelector(`[aria-label="${label}"]`),card,label);await b.tap();await page.waitForFunction(card=>!!window[card].shadowRoot.querySelector('polr-youtube-favorite')?.shadowRoot.querySelector('dialog')?.open,{},card);};
 const modal=(card)=>page.evaluateHandle(card=>window[card].shadowRoot.querySelector('polr-youtube-favorite'),card);
 await open('remote','Luli Pampín');assert.equal(await page.evaluate(()=>calls.length),0);
 for(const width of [360,393,1440]){await page.setViewport({width,height:873,isMobile:true,hasTouch:true});await page.screenshot({path:out+'/choices-'+width+'.png'});const metrics=await page.evaluate(()=>{const d=remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelector('dialog');return {width:d.getBoundingClientRect().width,overflow:d.scrollWidth>d.clientWidth};});assert(metrics.width<=width&&!metrics.overflow);}
 await page.evaluate(()=>remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelectorAll('.actions button')[1].click());
 await page.waitForFunction(()=>remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelectorAll('li').length===30);
 assert.deepEqual(await page.evaluate(()=>[...remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelectorAll('.rank')].map(e=>Number(e.textContent))),Array.from({length:30},(_,i)=>i+1));
 assert.equal(await page.evaluate(()=>remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelectorAll('li>a').length),30);
 await page.setViewport({width:393,height:873,isMobile:true,hasTouch:true});await page.screenshot({path:out+'/videos-393.png'});
 await page.evaluate(()=>remote.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelector('.video').click());await page.waitForFunction(()=>!remote.shadowRoot.querySelector('polr-youtube-favorite'));
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),{domain:'tv_guide',service:'youtube_playlist_play',data:{entry_id:'test',video_id:'Y_Qr50S0-B8'}});
 await open('home','Luli Pampín · Opciones de reproducción');await page.evaluate(()=>home.shadowRoot.querySelector('polr-youtube-favorite').shadowRoot.querySelector('.shuffle').click());await page.waitForFunction(()=>!home.shadowRoot.querySelector('polr-youtube-favorite'));
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),{domain:'tv_guide',service:'youtube_playlist_play',data:{entry_id:'test'}});
 await open('remote','Luli Pampín');await page.keyboard.press('Escape');await page.waitForFunction(()=>!remote.shadowRoot.querySelector('polr-youtube-favorite'));
 await page.waitForFunction(()=>remote.shadowRoot.activeElement?.getAttribute('aria-label')==='Luli Pampín',{timeout:3000});
 assert(await page.evaluate(()=>remote.shadowRoot.activeElement?.getAttribute('aria-label')==='Luli Pampín'));
 await page.evaluate(()=>setState('running'));assert(await page.evaluate(()=>remote.shadowRoot.querySelector('[aria-label="Sunny Bunnies"]').disabled));
 await page.evaluate(()=>setState('error'));assert(await page.evaluate(()=>home.shadowRoot.querySelector('[role="alert"]').textContent.includes('Paloma')));
 await page.evaluate(()=>setState(null));
 const sunny=await page.evaluateHandle(()=>remote.shadowRoot.querySelector('[aria-label="Sunny Bunnies"]'));await sunny.tap();await new Promise(r=>setTimeout(r,30));
 assert.deepEqual(await page.evaluate(()=>calls.at(-1)),{domain:'tv_guide',service:'youtube_kids_play',data:{entry_id:'test',favorite_id:'sunny_bunnies'}});
 await page.evaluate(()=>{const original=remote.hass.callService;remote.hass={...remote.hass,callService:async(domain,service,data)=>{if(service==='youtube_kids_play'){calls.push({domain,service,data});await new Promise(resolve=>window.finishFavorite=resolve);return {};}return original(domain,service,data);}};});
 await sunny.tap();await new Promise(r=>setTimeout(r,20));
 const up=await page.evaluateHandle(()=>remote.shadowRoot.querySelector('polr-atv-nav-pad').shadowRoot.querySelector('[aria-label="Up"]'));await up.tap();await new Promise(r=>setTimeout(r,20));
 assert.equal(await page.evaluate(()=>calls.at(-1).service),'send_command');await page.evaluate(()=>finishFavorite());
 assert.deepEqual(errors,[]);console.log('Luli: choices, 30 ordered links, selection, shuffle, shared progress, Escape and mobile layouts passed');
}finally{await browser.close();}
