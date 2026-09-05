import test from "node:test";
import assert from "node:assert/strict";

import { NativePressStateMachine } from "./.build/press-state.mjs";

test("a release before the threshold is exactly one short tap", () => {
  const press = new NativePressStateMachine();
  const session = press.begin();
  assert.equal(press.state, "pending");
  assert.equal(press.session, session);
  assert.equal(press.release(session), "short");
  assert.equal(press.state, "idle");
  assert.equal(press.release(session), undefined, "a duplicate up is inert");
});

test("a held gesture has exactly one start and one end edge", () => {
  const press = new NativePressStateMachine();
  const session = press.begin();
  assert.equal(press.hold(session), "start");
  assert.equal(press.hold(session), undefined, "the threshold timer is idempotent");
  assert.equal(press.release(session), "end");
  assert.equal(press.cancel(session), undefined, "a later cancellation cannot add an end");
});

test("cancelling a pending contact does not turn it into a tap", () => {
  const press = new NativePressStateMachine();
  const session = press.begin();
  assert.equal(press.cancel(session), undefined);
  assert.equal(press.state, "idle");
  assert.equal(press.release(session), undefined);
});

test("cancelling a held contact emits its mandatory release edge", () => {
  const press = new NativePressStateMachine();
  const session = press.begin();
  assert.equal(press.hold(session), "start");
  assert.equal(press.cancel(session), "end");
  assert.equal(press.cancel(session), undefined);
});

test("late timers and releases cannot resolve a newer contact", () => {
  const press = new NativePressStateMachine();
  const stale = press.begin();
  press.cancel(stale);
  const current = press.begin();
  assert.notEqual(current, stale);
  assert.equal(press.hold(stale), undefined);
  assert.equal(press.release(stale), undefined);
  assert.equal(press.state, "pending");
  assert.equal(press.release(current), "short");
});

test("twenty rapid contacts remain twenty independent taps", () => {
  const press = new NativePressStateMachine();
  const effects = [];
  for (let index = 0; index < 20; index += 1) {
    effects.push(press.release(press.begin()));
  }
  assert.deepEqual(effects, Array(20).fill("short"));
  assert.equal(press.state, "idle");
});
