import test from 'node:test';
import assert from 'node:assert/strict';
import { durationSeconds, madridInput, exactMadridTime, countdown } from './.build/power-model.mjs';

test('duration requires whole hours minutes and seconds within thirty days', () => {
  assert.equal(durationSeconds('1', '2', '3'), 3723);
  assert.equal(durationSeconds('0', '0', '1'), 1);
  for (const parts of [['0','0','0'], ['1','60','0'], ['1','0','60'], ['-1','0','0'], ['1.5','0','0'], ['721','0','0'], ['1e2','0','0']]) assert.equal(durationSeconds(...parts), null);
});

test('date input and displayed deadline use Madrid through summer and winter time', () => {
  assert.equal(madridInput(Date.parse('2026-06-01T10:00:05Z')), '2026-06-01T12:00:05');
  assert.equal(madridInput(Date.parse('2026-12-01T10:00:05Z')), '2026-12-01T11:00:05');
  assert.match(exactMadridTime(Date.parse('2026-06-01T10:00:05Z') / 1000), /12:00:05/);
  assert.equal(countdown(100, 97.5), '0 h 00 min 03 s');
});
