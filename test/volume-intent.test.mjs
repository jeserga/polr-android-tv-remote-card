import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VolumeIntent } from './.build/volume-intent.mjs';

const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
function setup(t, send, step = 1) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 100_000 });
  const calls = [];
  const intent = new VolumeIntent(step, async (direction, count) => {
    calls.push([direction, count]);
    return send?.(direction, count);
  }, () => {}, undefined, 1000);
  intent.observe(9, 99);
  return { intent, calls, tick: async ms => { t.mock.timers.tick(ms); await settle(); } };
}

test('15 rapid taps update immediately and send three batches, then await fresh telemetry', async t => {
  const { intent: v, calls, tick } = setup(t);
  for (let i = 0; i < 15; i++) v.choose(v.value + 1);
  assert.equal(v.value, 24);
  assert.equal(v.confirmed, 9);
  assert(v.pending);
  assert.deepEqual(calls, []);
  await tick(70);
  assert.deepEqual(calls, [[1, 5], [1, 5], [1, 5]]);
  v.observe(24, 99);
  assert(v.pending, 'old telemetry must not confirm the requested percentage');
  await tick(201);
  v.observe(24, Date.now() / 1000);
  assert(!v.pending);
  assert.equal(v.value, 24);
});

test('pending targets are replaced, including direction reversal during a batch', async t => {
  const resolvers = [];
  const { intent: v, calls, tick } = setup(t, () => new Promise(resolve => resolvers.push(resolve)));
  v.choose(50);
  await tick(70);
  for (const target of [80, 70, 60, 40, 12]) v.choose(target);
  assert.equal(v.value, 12);
  assert.equal(calls.length, 1);
  resolvers.shift()(); await settle();
  assert.deepEqual(calls, [[1, 5], [-1, 2]]);
  resolvers.shift()(); await settle();
  await tick(201); v.observe(12, Date.now() / 1000);
  assert(!v.pending);
});

test('opposite taps cancel before dispatch without touching the TV', async t => {
  const { intent: v, calls, tick } = setup(t);
  v.choose(10); v.choose(9);
  await tick(70);
  assert.deepEqual(calls, []);
  assert(!v.pending);
});

test('a continuous drag starts within 160 ms instead of starving the sender', async t => {
  const { intent: v, calls, tick } = setup(t);
  for (let i = 0; i < 4; i++) { v.choose(10 + i); await tick(40); }
  assert(calls.length > 0);
  v.dispose();
});

test('bounds, invalid input and fractional volume steps', async t => {
  const { intent: v, calls, tick } = setup(t, undefined, 0.5);
  v.choose(NaN); assert(!v.pending);
  v.choose(Infinity); assert(!v.pending);
  v.choose(101); assert.equal(v.value, 100);
  v.choose(-1); assert.equal(v.value, 0);
  v.choose(10.1); assert.equal(v.value, 10);
  await tick(70);
  assert.deepEqual(calls, [[1, 2]]);
  v.dispose();
});

test('a rejected call stops the queue and a later gesture uses the actual reading', async t => {
  let fail = true;
  const { intent: v, calls, tick } = setup(t, () => { if (fail) throw new Error('offline'); });
  v.choose(90); await tick(70);
  assert.equal(calls.length, 1);
  assert(!v.pending);
  assert.match(v.error, /cambiar el volumen/);
  v.observe(11, 101); fail = false;
  v.choose(12); await tick(70);
  assert.deepEqual(calls[1], [1, 1]);
  assert.equal(v.error, undefined);
  v.dispose();
});

test('a stalled call times out despite further input; late success cannot resume it', async t => {
  let resolve;
  const { intent: v, calls, tick } = setup(t, () => new Promise(r => { resolve = r; }));
  v.choose(80); await tick(70);
  await tick(500); v.choose(40);
  await tick(500);
  assert.match(v.error, /no responde/);
  assert(!v.pending);
  resolve(); await settle();
  assert.equal(calls.length, 1);
});

test('unconfirmed commands time out without resending or claiming success', async t => {
  const { intent: v, calls, tick } = setup(t);
  v.choose(11); await tick(70);
  v.observe(10, 99);
  assert.equal(v.value, 11);
  await tick(1000);
  assert(!v.pending);
  assert.equal(v.value, 10);
  assert.match(v.error, /confirmar/);
  assert.equal(calls.length, 1);
});

test('fresh telemetry corrects merged ARC keys and accepts the closest reachable level', async t => {
  const { intent: v, calls, tick } = setup(t);
  v.choose(20); await tick(70);
  await tick(250); v.observe(17, Date.now() / 1000); await settle();
  assert.deepEqual(calls.at(-1), [1, 3]);
  await tick(250); v.observe(19, Date.now() / 1000); await settle();
  assert.deepEqual(calls.at(-1), [1, 1]);
  await tick(250); v.observe(21, Date.now() / 1000);
  assert(!v.pending);
  assert.equal(v.value, 21);
  assert.equal(v.error, undefined);
});

test('corrections are bounded and old readings never roll the confirmed value back', async t => {
  const { intent: v, calls, tick } = setup(t);
  v.choose(20); await tick(70);
  for (let i = 0; i < 4; i++) { await tick(250); v.observe(10, Date.now() / 1000); await settle(); }
  assert(!v.pending);
  assert.match(v.error, /volumen real/);
  const count = calls.length;
  v.observe(9, 1); await tick(1500);
  assert.equal(v.confirmed, 10);
  assert.equal(calls.length, count);
});

test('disconnect cancels unsent work and continuation after an in-flight batch', async t => {
  let resolve;
  const { intent: v, calls, tick } = setup(t, () => new Promise(r => { resolve = r; }));
  v.choose(80); v.dispose(); await tick(100);
  assert.equal(calls.length, 0);
  v.choose(80); await tick(70);
  v.dispose(); resolve(); await settle(); await tick(2000);
  assert.equal(calls.length, 1);
  assert(!v.pending);
  assert.equal(v.error, undefined);
});

test('late rejection after disposal is ignored', async t => {
  let reject;
  const { intent: v, tick } = setup(t, () => new Promise((_, r) => { reject = r; }));
  v.choose(50); await tick(70);
  v.dispose(); reject(new Error('late')); await settle();
  assert.equal(v.error, undefined);
});
