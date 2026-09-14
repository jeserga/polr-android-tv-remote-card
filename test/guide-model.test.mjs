import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dayBounds,filterChannels,guideDay,guideTime,placement,progress} from './.build/guide-model.mjs';
test('Madrid day boundaries survive both DST transitions',()=>{
  assert.equal(dayBounds('2026-03-29')[1]-dayBounds('2026-03-29')[0],23*3600);
  assert.equal(dayBounds('2026-10-25')[1]-dayBounds('2026-10-25')[0],25*3600);
  assert.equal(dayBounds('2026-09-14')[1]-dayBounds('2026-09-14')[0],24*3600);
  assert.equal(guideDay(new Date('2026-09-14T23:30:00Z')),'2026-09-15');
  assert.equal(guideTime(Date.parse('2026-09-14T18:00:00Z')/1000),'20:00');
});
test('channel search handles accents, dials and favorites independently',()=>{
  const rows=[{number:'5',name:'Boing',kind:'tv',favorite:true},{number:'54',name:'Ràdio 4 RNE',kind:'radio',favorite:false}];
  assert.deepEqual(filterChannels(rows,'all','radio'),[rows[1]]);
  assert.deepEqual(filterChannels(rows,'tv','5'),[rows[0]]);
  assert.deepEqual(filterChannels(rows,'favorites',''),[rows[0]]);
  assert.deepEqual(filterChannels(rows,'radio','Boing'),[]);
});
test('progress and clipped grid positions never overrun bounds',()=>{
  assert.equal(progress({start:100,end:200},50),0);assert.equal(progress({start:100,end:200},150),50);assert.equal(progress({start:100,end:200},300),100);assert.equal(progress({start:100,end:100},100),0);
  assert.deepEqual(placement({start:50,end:150},100,200),{left:0,width:50});
  assert.deepEqual(placement({start:150,end:300},100,200),{left:50,width:50});
});
