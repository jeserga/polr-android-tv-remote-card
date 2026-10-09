import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
const root=resolve('test/harness/shots-home-shortcuts');mkdirSync(root,{recursive:true});
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox','--allow-file-access-from-files']});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:393,height:1000,isMobile:true,hasTouch:true});
 await page.goto(pathToFileURL(resolve('test/harness/index.html')).href,{waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.title==='ready');
 await page.setRequestInterception(true);page.on('request',request=>request.url()==='https://icons.test/boing.svg'?request.respond({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><circle cx="13" cy="13" r="13" fill="blue"/></svg>'}):request.continue());
 await page.evaluate(async()=>{
  const meta=document.createElement('meta');meta.name='viewport';meta.content='width=device-width, initial-scale=1';document.head.append(meta);
  document.body.innerHTML='';document.body.style.padding='0';window.calls=[];
  const key='boing-channel';
  window.home=document.createElement('polr-home-summary-card');
  home.setConfig({channel_shortcuts:[{name:'Boing',channel_key:key}]});
  window.remote=document.createElement('polr-android-tv-remote-card');
  remote.setConfig({entity:'remote.tv_salon',context_entity:'sensor.tv_salon_contexto',show_section_labels:true,sections:[{name:'Favoritos niños',columns:4,buttons:[{name:'Bluey',icon:'mdi:play',action:{action:'service',service:'script.tv_bluey_ninos'}},{name:'Luli Pampín',icon:'mdi:youtube',action:{action:'service',service:'tv_guide.youtube_kids_play',data:{favorite_id:'luli_pampin'}}},{name:'Sunny Bunnies',icon:'mdi:youtube',action:{action:'service',service:'tv_guide.youtube_kids_play',data:{favorite_id:'sunny_bunnies'}}},{name:'Boing',icon:'mdi:television-classic',action:{action:'service',service:'tv_guide.tune_channel',data:{entry_id:'test',channel_key:key}}}]}]});
  window.setState=async(state='off',busy=null,entry='test')=>{
   const hass={states:{'remote.tv_salon':{state,attributes:{}},'sensor.tv_salon_contexto':{state:'off',attributes:{entry_id:entry,busy}},'light.lampara':{state:'off',attributes:{}}},entities:{},callWS:async()=>({forecast:[],alerts:[]}),callService:async(domain,service,data)=>{calls.push({domain,service,data});if(window.hold)await new Promise(resolve=>window.finishCall=resolve);if(window.fail)throw Error('No se pudo confirmar Boing');return {};}};
   home.hass=hass;remote.hass=hass;await Promise.all([home.updateComplete,remote.updateComplete]);
  };
  document.body.append(home,remote);await setState();
 });
 const expected={domain:'tv_guide',service:'tune_channel',data:{entry_id:'test',channel_key:'boing-channel'}};
 const tap=async(card,label)=>{const h=await page.evaluateHandle((c,l)=>window[c].shadowRoot.querySelector(`[aria-label="${l}"]`),card,label);await h.tap();};
 assert.equal(await page.evaluate(()=>home.shadowRoot.querySelector('[aria-label="Ver Boing"]').disabled),false);
 await tap('home','Ver Boing');await page.waitForFunction(()=>calls.length===1);assert.deepEqual(await page.evaluate(()=>calls[0]),expected);
 await tap('remote','Boing');await page.waitForFunction(()=>calls.length===2);assert.deepEqual(await page.evaluate(()=>calls[1]),expected);
 await page.evaluate(()=>setState('on','5 · Boing'));assert.equal(await page.evaluate(()=>home.shadowRoot.querySelector('[aria-label="Ver Boing"]').disabled),true);
 await page.evaluate(()=>setState('on',null,null));assert.equal(await page.evaluate(()=>home.shadowRoot.querySelector('[aria-label="Ver Boing"]').disabled),true);
 await page.evaluate(async()=>{await setState('off');window.hold=true;});
 await tap('home','Ver Boing');await page.waitForFunction(()=>!!window.finishCall);
 assert.equal(await page.evaluate(()=>home.shadowRoot.querySelector('[aria-label="Ver Boing"]').disabled),true);
 await tap('home','Ver Boing');assert.equal(await page.evaluate(()=>calls.length),3);
 await page.evaluate(()=>{window.hold=false;finishCall();});await page.waitForFunction(()=>!home.shadowRoot.querySelector('[aria-label="Ver Boing"]').disabled);
 await page.evaluate(()=>window.fail=true);await tap('home','Ver Boing');await page.waitForFunction(()=>home.shadowRoot.querySelector('[role="alert"]')?.textContent.includes('Boing'));
 await page.evaluate(()=>window.fail=false);await tap('home','Ver Boing');await page.waitForFunction(()=>!home.shadowRoot.querySelector('[role="alert"]'));
 await page.evaluate(async()=>{home.setConfig({channel_shortcuts:[{name:'Boing',channel_key:'boing-channel',icon:'https://icons.test/boing.svg'}]});await home.updateComplete;});
 await page.waitForFunction(()=>{const b=home.shadowRoot.querySelector('[aria-label="Ver Boing"]');const img=b.querySelector('img');return img?.complete&&img.naturalWidth>0&&!b.querySelector('ha-icon');});
 for(const width of [360,393,1440]){
  await page.setViewport({width,height:1100,isMobile:true,hasTouch:true});
  await page.evaluate(()=>setState('on'));await page.screenshot({path:root+'/buttons-'+width+'.png',fullPage:true});
  const metrics=await page.evaluate(()=>{const s=home.shadowRoot.querySelector('.shortcuts');const b=home.shadowRoot.querySelector('[aria-label="Ver Boing"]');return {overflow:s.scrollWidth>s.clientWidth+1,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height};});
  assert.equal(metrics.overflow,false);assert(metrics.width>=44&&metrics.height>=44);
 }
 await page.evaluate(async()=>{home.setConfig({});await home.updateComplete;});
 assert.equal(await page.evaluate(()=>home.shadowRoot.querySelector('.shortcuts').children.length),3);
 assert.deepEqual(errors,[]);console.log('Both Boing buttons: correct service/key, available when off, busy and missing context, duplicate blocking, visible errors, image icons, original defaults and 360/393/1440 layouts passed.');
}finally{await browser.close();}
