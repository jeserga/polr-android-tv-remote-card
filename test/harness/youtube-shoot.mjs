import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox','--allow-file-access-from-files']});
const out=resolve('test/harness/shots-youtube');mkdirSync(out,{recursive:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:360,height:1000,isMobile:true,hasTouch:true});
 await page.goto(pathToFileURL(resolve('test/harness/index.html')).href,{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.title==='ready');
 await page.evaluate(async()=>{
  document.body.innerHTML='';document.body.style.padding='0';window.calls=[];
  window.home=document.createElement('polr-home-summary-card');home.setConfig({context:'sensor.ctx',remote:'remote.test'});
  window.remote=document.createElement('polr-android-tv-remote-card');remote.setConfig({entity:'remote.test',context_entity:'sensor.ctx',show_section_labels:true,sections:[{name:'Favoritos niños',columns:3,buttons:[{name:'Bluey',icon:'mdi:play',action:{action:'service',service:'script.tv_bluey_ninos'}},...['luli_pampin','sunny_bunnies'].map((id,i)=>({name:i?'Sunny Bunnies':'Luli Pampín',icon:'mdi:youtube',action:{action:'service',service:'tv_guide.youtube_kids_play',data:{entry_id:'test',favorite_id:id}}}))]}]});
  window.setState=async(state)=>{
   const hass={states:{'remote.test':{state:'on',attributes:{}},'sensor.ctx':{state:'app',attributes:{entry_id:'test',youtube_operation:state?{state,message:state==='error'?'No se pudo verificar Paloma':'Preparando Luli Pampín'}:null}},'light.lampara':{state:'off',attributes:{}}},entities:{},callWS:async()=>({forecast:[],alerts:[]}),callService:async(domain,service,data)=>{calls.push({domain,service,data});return {};}};
   home.hass=hass;remote.hass=hass;await Promise.all([home.updateComplete,remote.updateComplete]);
  };
  document.body.append(home,remote);await setState(null);
  home.shadowRoot.querySelector('[aria-label="Reproducir Luli Pampín con Paloma"]').click();
  await new Promise(r=>setTimeout(r,20));
 });
 let button=await page.evaluateHandle(()=>remote.shadowRoot.querySelector('[aria-label="Sunny Bunnies"]'));
 await button.tap();await new Promise(r=>setTimeout(r,30));
 const calls=await page.evaluate(()=>calls);
 assert.deepEqual(calls.map(c=>[c.domain,c.service,c.data]),[['tv_guide','youtube_kids_play',{entry_id:'test',favorite_id:'luli_pampin'}],['tv_guide','youtube_kids_play',{entry_id:'test',favorite_id:'sunny_bunnies'}]]);
 await page.evaluate(()=>{const original=remote.hass.callService;remote.hass={...remote.hass,callService:async(domain,service,data)=>{if(service==='youtube_kids_play'){calls.push({domain,service,data});await new Promise(resolve=>window.finishFavorite=resolve);return {};}return original(domain,service,data);}};});
 const luli=await page.evaluateHandle(()=>remote.shadowRoot.querySelector('[aria-label="Luli Pampín"]'));
 await luli.tap();await new Promise(r=>setTimeout(r,20));
 const up=await page.evaluateHandle(()=>remote.shadowRoot.querySelector('polr-atv-nav-pad').shadowRoot.querySelector('[aria-label="Up"]'));
 await up.tap();await new Promise(r=>setTimeout(r,20));
 assert.equal(await page.evaluate(()=>calls.at(-1).service),'send_command');
 await page.evaluate(()=>finishFavorite());
 await page.evaluate(()=>setState('running'));
 const busy=await page.evaluate(()=>({home:home.shadowRoot.querySelector('[aria-label="Reproducir Luli Pampín con Paloma"]').disabled,remote:remote.shadowRoot.querySelector('[aria-label="Sunny Bunnies"]').disabled,progress:[home,remote].every(c=>c.shadowRoot.querySelector('[role="status"]').textContent.includes('Preparando'))}));
 assert.deepEqual(busy,{home:true,remote:true,progress:true});
 await button.tap();assert.equal(await page.evaluate(()=>calls.length),4);
 await page.evaluate(()=>setState('error'));
 assert(await page.evaluate(()=>[home,remote].every(c=>c.shadowRoot.querySelector('[role="alert"]').textContent.includes('Paloma'))));
 for(const width of [360,393,1440]){
  await page.setViewport({width,height:1080,isMobile:true,hasTouch:true});
  const metrics=await page.evaluate(()=>[...home.shadowRoot.querySelectorAll('.shortcuts button')].map(b=>({width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,overflow:b.scrollWidth>b.clientWidth})));
  assert(metrics.every(m=>m.height>=44&&!m.overflow));
  assert(await page.evaluate(()=>home.getBoundingClientRect().width<=innerWidth));
  await page.screenshot({path:out+'/'+width+'.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('YouTube: servicios correctos, bloqueo entre tarjetas, errores y diseño a 360/393/1440 px verificados.');
}finally{await browser.close();}
