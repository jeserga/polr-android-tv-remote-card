import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync} from 'node:fs';

const browser = await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',args:['--no-sandbox','--allow-file-access-from-files']});
const output = resolve('test/harness/shots-power'); mkdirSync(output,{recursive:true});
try {
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewport({width:393,height:850,deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await page.goto(pathToFileURL(resolve('test/harness/index.html')).href,{waitUntil:'networkidle0'});
  await page.waitForFunction(() => document.title === 'ready');
  const result = await page.evaluate(async () => {
    document.body.innerHTML = '';
    const calls = [];
    const power = document.createElement('polr-power-control');
    power.hass = {
      callService: async (domain, service, data) => { calls.push({domain,service,data}); return {}; },
      callWS: async () => ({turn_off_at:'2026-10-25T02:30:00+02:00',item_id:'movie'}),
    };
    power.entryId = 'entry'; power.tvOn = true;
    power.playback = {state:'playing',item_id:'movie',position:10,duration:100,observed_at:Date.now()/1000};
    power.powerOff = {active:true,deadline:Date.now()/1000+3723};
    power.idleStandby = {enabled:false,pending:false};
    document.body.append(power); await power.updateComplete;
    const root = power.shadowRoot;
    const status = root.querySelector('.status').textContent;
    root.querySelector('.section-toggle').click(); await power.updateComplete;
    const durationInputs = [...root.querySelectorAll('.duration input')];
    for (const [input,value] of durationInputs.map((input,index) => [input,['1','2','3'][index]])) {
      input.value = value; input.dispatchEvent(new Event('input')); }
    await power.updateComplete;
    root.querySelector('.primary').click(); await new Promise(resolve => setTimeout(resolve,20));
    root.querySelectorAll('.modes button')[1].click(); await power.updateComplete;
    root.querySelector('.clock button').click(); await new Promise(resolve => setTimeout(resolve,20));
    const calculated = root.querySelector('#sleep-at').value;
    root.querySelector('.primary').click(); await new Promise(resolve => setTimeout(resolve,20));
    root.querySelector('.actions button:last-child').click(); await new Promise(resolve => setTimeout(resolve,20));
    root.querySelector('.idle button').click(); await new Promise(resolve => setTimeout(resolve,20));
    const overflow = document.documentElement.scrollWidth > innerWidth;
    const labelled = [...root.querySelectorAll('button')].every(button => !!(button.textContent.trim() || button.getAttribute('aria-label')));
    return {status,calculated,calls,overflow,labelled};
  });
  assert.match(result.status,/Se apagará el.*Quedan/);
  assert.equal(result.calculated,'2026-10-25T02:30');
  assert.deepEqual(result.calls.map(call => call.service),['schedule_power_off','schedule_power_off','cancel_power_off','set_idle_standby']);
  assert.equal(result.calls[0].data.duration_seconds,3723);
  assert.equal(result.calls[1].data.turn_off_at,'2026-10-25T02:30:00+02:00');
  assert.equal(result.calls[3].data.enabled,true);
  assert(!result.overflow && result.labelled);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:output+'/mobile.png',fullPage:true});
  console.log('Programación, final de reproducción, cancelación e inactividad: interfaz móvil y llamadas correctas.');
} finally {await browser.close();}
