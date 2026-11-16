import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VolumeIntent } from './.build/volume-intent.mjs';
const settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
function setup(t,send){
 t.mock.timers.enable({apis:['setTimeout','Date'],now:100000});
 const calls=[];const v=new VolumeIntent(1,async p=>{calls.push(p);return send?send(p):{context:{id:'id'+calls.length}};},()=>{});
 v.observe(5,{volume_status:'idle',volume_revision:0});
 return {v,calls,tick:async ms=>{t.mock.timers.tick(ms);await settle();}};
}
test('15 taps are instant and become one absolute target; ACK alone is not success',async t=>{
 const {v,calls,tick}=setup(t);
 for(let i=0;i<15;i++)v.choose(v.value+1);
 assert.equal(v.value,20);assert(v.pending);assert.equal(v.confirmed,5);assert.deepEqual(calls,[]);
 await tick(70);assert.deepEqual(calls,[20]);assert(v.pending);
 v.observe(19,{volume_status:'applying',volume_target:.2,volume_request_id:'id1',volume_revision:1});assert(v.pending);assert.equal(v.value,20);assert.equal(v.confirmed,19);
 v.observe(20,{volume_status:'applied',volume_target:.2,volume_request_id:'id1',volume_revision:1});assert(!v.pending);assert.equal(v.value,20);
});
test('new target replaces unsent intents during an in-flight call',async t=>{
 const resolvers=[];const {v,calls,tick}=setup(t,()=>new Promise(r=>resolvers.push(r)));
 v.choose(50);await tick(70);for(const p of [8,35,12])v.choose(p);
 assert.equal(v.value,12);assert.equal(calls.length,1);
 resolvers.shift()({context:{id:'old'}});await settle();assert.deepEqual(calls,[50,12]);
 v.observe(40,{volume_status:'applied',volume_target:.5,volume_request_id:'old'});assert.equal(v.value,12);assert(v.pending);
 resolvers.shift()({context:{id:'new'}});await settle();assert(v.pending);
 v.observe(12,{volume_status:'applied',volume_target:.12,volume_request_id:'new'});assert(!v.pending);
});
test('reconnect adopts server operation and later another client supersedes it',t=>{
 const {v}=setup(t);v.observe(7,{volume_status:'applying',volume_target:.4,volume_request_id:'other',volume_revision:2});assert.equal(v.value,40);assert(v.pending);
 v.observe(9,{volume_status:'applying',volume_target:.12,volume_request_id:'next',volume_revision:3});assert.equal(v.value,12);
 v.observe(12,{volume_status:'applied',volume_target:.12,volume_request_id:'next',volume_revision:3});assert(!v.pending);
});
test('backend error keeps goal and actual distinct without accepting a one-point error',t=>{
 const {v}=setup(t);v.observe(16,{volume_status:'error',volume_target:.15,volume_error:'No responde',volume_revision:1});assert.equal(v.value,15);assert.equal(v.confirmed,16);assert.equal(v.error,'No responde');assert(!v.pending);
});
test('network failure survives re-render and a new gesture can recover',async t=>{
 let fail=true;const {v,tick}=setup(t,async()=>{if(fail)throw Error();return {context:{id:'ok'}};});v.choose(15);await tick(70);
 v.observe(5,{volume_status:'idle',volume_revision:0});assert(v.error);assert.equal(v.value,15);assert(!v.pending);
 fail=false;v.choose(10);await tick(70);v.observe(10,{volume_status:'applied',volume_request_id:'ok',volume_revision:1});assert(!v.error);assert(!v.pending);
});
test('a failure of the old call cannot discard a newer target',async t=>{
 let reject;const {v,calls,tick}=setup(t,p=>p===50?new Promise((_,r)=>reject=r):Promise.resolve({context:{id:'new'}}));v.choose(50);await tick(70);v.choose(8);reject(Error());await settle();assert.deepEqual(calls,[50,8]);assert.equal(v.value,8);assert(!v.error);
});
test('continuous drag dispatches within 160 ms; bounds and invalid input',async t=>{
 const {v,calls,tick}=setup(t);v.choose(NaN);assert(!v.pending);v.choose(Infinity);assert(!v.pending);
 v.choose(101);assert.equal(v.value,100);v.choose(-1);assert.equal(v.value,0);
 for(let i=0;i<4;i++){v.choose(10+i);await tick(40);}assert(calls.length>0);v.dispose();
});
test('disconnect cancels only unsent browser work, not the server operation',async t=>{
 let resolve;const {v,calls,tick}=setup(t,()=>new Promise(r=>resolve=r));v.choose(50);v.dispose();await tick(200);assert.equal(calls.length,0);
 v.choose(50);await tick(70);v.dispose();resolve({context:{id:'old'}});await settle();assert.equal(calls.length,1);
});
test('late rejection after disconnect is ignored',async t=>{
 let reject;const {v,tick}=setup(t,()=>new Promise((_,r)=>reject=r));v.choose(50);await tick(70);v.dispose();reject(Error());await settle();assert.equal(v.error,undefined);
});
