import test from 'node:test';
import assert from 'node:assert/strict';
import {duration,muteAction,dayForecast,madridDay,sessionsFromSegments} from './.build/home-model.mjs';

test('mute always describes the action, including unknown status',()=>{
  assert.equal(muteAction(false).icon,'mdi:volume-off');
  assert.equal(muteAction(true).icon,'mdi:volume-high');
  assert.match(muteAction(undefined).label,/desconocido/);
});
test('forecast starts on the current Madrid day across the UTC boundary',()=>{
  const now=new Date('2026-09-16T22:30:00Z');
  assert.equal(madridDay(now),'2026-09-17');
  const data=Array.from({length:8},(_,i)=>({datetime:`2026-09-${16+i}T12:00:00Z`}));
  assert.deepEqual(dayForecast(data,now).map(x=>x.datetime.slice(8,10)),['17','18','19','20','21']);
});
test('sessions retain content changes but split at an off state or monitoring outage',()=>{
  const data=[{start:0,end:5,power:'on',title:'A'},{start:5,end:10,power:'on',title:'B'},{start:10,end:11,power:'off'},{start:11,end:15,power:'on'},{start:60,end:65,power:'on'}];
  const sessions=sessionsFromSegments(data,66);
  assert.equal(sessions.length,3);assert.equal(sessions[2].observed,10);
  assert.equal(sessions[2].contents.length,2);assert.equal(sessions[0].active,true);
  assert.equal(sessions[1].active,false);
});
test('durations distinguish missing data from zero',()=>{
  assert.equal(duration(undefined),'—');assert.equal(duration(NaN),'—');
  assert.equal(duration(-5),'0 min');assert.equal(duration(3650),'1 h 0 min');
});
