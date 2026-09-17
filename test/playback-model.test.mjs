import test from 'node:test';
import assert from 'node:assert/strict';
import {playbackPosition, playbackTime, parsePlaybackTime} from './.build/playback-model.mjs';

test('exact positions accept explicit hours and reject ambiguous or invalid input', () => {
  assert.equal(parsePlaybackTime('01:02:03'),3723);
  assert.equal(parsePlaybackTime('0:59:59'),3599);
  for(const value of ['12:60:00','12:00:60','12:10','-1:00:00','1e2','']) assert.equal(parsePlaybackTime(value),null);
  assert.equal(playbackTime(3723.9),'01:02:03');
  assert.equal(playbackTime(-1),'00:00:00');
});
test('progress advances only from a fresh playing sample and remains bounded', () => {
  const p={position:20,duration:100,observed_at:1000,state:'playing',seekable:true,item_id:'movie'};
  assert.deepEqual(playbackPosition(p,1005),{position:25,fresh:true,canSeek:true});
  assert.equal(playbackPosition({...p,state:'paused'},1005).position,20);
  assert.deepEqual(playbackPosition(p,1020),{position:20,fresh:false,canSeek:false});
  assert.equal(playbackPosition({...p,duration:22},1005).position,22);
  assert.equal(playbackPosition({...p,seekable:false},1005).canSeek,false);
  assert.equal(playbackPosition({...p,duration:0},1005).canSeek,false);
  assert.equal(playbackPosition({},1005).canSeek,false);
});
