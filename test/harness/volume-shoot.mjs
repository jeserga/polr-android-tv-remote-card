import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const output = resolve('test/harness/shots-volume'); mkdirSync(output, { recursive: true });
try {
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(resolve('test/harness/index.html')).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.title === 'ready');
  const result = await page.evaluate(async () => {
    document.body.innerHTML = '';
    const card = document.createElement('polr-android-tv-remote-card');
    const calls = []; const resolvers = [];
    const hass = {
      states: {
        'remote.tv': { state: 'on', attributes: {} },
        'media_player.tv': { state: 'on', last_updated: new Date().toISOString(), attributes: { volume_level: .09, is_volume_muted: false, output_label: 'HS2100 · HDMI ARC', observed_at: Date.now() / 1000 } },
        'sensor.context': { state: 'on', attributes: { entry_id: 'entry', power_off: {}, idle_standby: {}, soundbar: {} } },
      },
      entities: { 'remote.tv': { entity_id: 'remote.tv', device_id: 'tv', platform: 'androidtv_remote' }, 'media_player.tv': { entity_id: 'media_player.tv', device_id: 'tv', platform: 'androidtv_remote' } }, devices: {},
      callService: async (...args) => { calls.push(args); await new Promise(resolve => resolvers.push(resolve)); return {}; },
    };
    card.hass = hass;
    card.setConfig({ type: 'custom:polr-android-tv-remote-card', entity: 'remote.tv', volume_step: 1, context_entity: 'sensor.context', show_text_input: true, apps: ['netflix'], hold_mode: 'native' });
    document.body.append(card); await card.updateComplete;
    const volume = card.shadowRoot.querySelector('polr-volume-control'); await volume.updateComplete;
    const root = volume.shadowRoot;
    const plus = root.querySelector('[aria-label="Subir volumen"]');
    for (let i = 0; i < 15; i++) {
      plus.dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: i + 1, pointerType: 'mouse', bubbles: true }));
      plus.dispatchEvent(new PointerEvent('pointerup', { button: 0, pointerId: i + 1, pointerType: 'mouse', bubbles: true }));
    }
    await volume.updateComplete;
    const instant = { value: root.querySelector('output').textContent.trim(), pending: root.querySelector('.status').textContent, calls: calls.length };
    await new Promise(resolve => setTimeout(resolve, 180));
    const first = calls[0][2];
    // Reverse a large target while the first five keys are still in flight.
    const slider = root.querySelector('input'); slider.value = '12'; slider.dispatchEvent(new Event('input'));
    await volume.updateComplete;
    resolvers.shift()(); await new Promise(resolve => setTimeout(resolve, 250));
    const second = calls[1][2];
    resolvers.shift()(); await new Promise(resolve => setTimeout(resolve, 250));
    hass.states['media_player.tv'].attributes.volume_level = .12;
    hass.states['media_player.tv'].attributes.observed_at = Date.now() / 1000;
    card.hass = { ...hass }; await card.updateComplete; await volume.updateComplete;
    const confirmed = { value: root.querySelector('output').textContent.trim(), pending: !!root.querySelector('.pending-label') };
    const last = card.shadowRoot.querySelector('ha-card').lastElementChild.tagName;
    const chips = card.shadowRoot.querySelectorAll('.chips').length;
    // Make the pending state available for screenshots without sending commands.
    slider.value = '30'; slider.dispatchEvent(new Event('input')); await volume.updateComplete;
    return { instant, first, second, confirmed, last, chips, calls: calls.length };
  });
  assert.equal(result.instant.value, '24 %');
  assert.match(result.instant.pending, /Aplicando.*Confirmado: 9/s);
  assert.equal(result.instant.calls, 0);
  assert.deepEqual([result.first.command, result.first.num_repeats, result.first.delay_secs], ['VOLUME_UP', 5, .12]);
  assert.deepEqual([result.second.command, result.second.num_repeats], ['VOLUME_DOWN', 2]);
  assert.deepEqual(result.confirmed, { value: '12 %', pending: false });
  assert.equal(result.last, 'POLR-POWER-CONTROL');
  assert.equal(result.chips, 0);
  assert.equal(result.calls, 2);
  for (const width of [360, 393, 1440]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.evaluate(width => { document.body.style.padding = width < 500 ? '8px' : '24px'; document.querySelector('polr-android-tv-remote-card').style.maxWidth = '540px'; }, width);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
