import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {runFlow,verifyFlow} from '../../scripts/public-smoke.mjs';

function mock(initial=36) {
  const records=new Map(), calls=[];let seq=0;
  const reply=(status,data)=>({status,body:status===204?null:{data}});
  const seeded=Array.from({length:initial},(_,i)=>({id:'seed-'+i,status:'OPEN'}));
  async function request(path,method='GET',payload) {
    calls.push({path,method});
    const u=new URL(path,'https://unit.invalid');
    if(u.pathname==='/api/requests') {
      if(method==='GET') {
        let rows=[...seeded,...[...records.values()].filter(r=>!r.removed)];
        if(u.searchParams.get('q')) rows=rows.filter(r=>r.customerName?.includes(u.searchParams.get('q')));
        if(u.searchParams.get('status')) rows=rows.filter(r=>r.status===u.searchParams.get('status'));
        return {status:200,body:{data:rows,pagination:{total:initial+[...records.values()].filter(r=>!r.removed).length}}};
      }
      if(method==='POST') {
        const r={...payload,id:'test-'+(++seq),status:'OPEN',version:1,notes:[],removed:false};
        records.set(r.id,r);return reply(201,r);
      }
    }
    const matched=u.pathname.match(/^\/api\/requests\/([^/]+)(?:\/(transitions|notes))?$/);
    if(!matched)return reply(404);
    const r=records.get(matched[1]),action=matched[2];
    if(!r||r.removed)return reply(404);
    if(method==='GET')return reply(200,r);
    if(method==='PATCH') {
      if(!['OPEN','IN_REVIEW'].includes(r.status))return reply(409);
      r.customerName=payload.customerName;r.version++;return reply(200,r);
    }
    if(action==='transitions'&&method==='POST') {
      r.status=payload.toStatus;r.version++;
      if(payload.toStatus==='APPROVED')r.refundAmount=payload.refundAmount;
      return reply(200,r);
    }
    if(action==='notes'&&method==='POST') {
      const note={body:payload.body};r.notes.push(note);return reply(201,note);
    }
    if(method==='DELETE') {r.removed=true;return reply(204);}
    return reply(404);
  }
  return {request,records,calls};
}
test('offline full write journey and persisted verify',async()=>{
  const m=mock();let saved;const run=await runFlow({
    request:m.request,save:async x=>saved=x,marker:'MARKA123',log:()=>{}
  });
  assert.equal(saved.id,run.id);
  assert.equal(m.records.size,2);
  assert.equal(m.records.get(saved.id).status,'COMPLETED');
  assert.equal(m.records.get(saved.removedId).removed,true);
  await verifyFlow({request:m.request,load:async()=>saved,log:()=>{}});
});
test('refuses unseeded public queue before writing',async()=>{
  const m=mock(35);
  await assert.rejects(runFlow({request:m.request,save:async()=>{},log:()=>{}}),/36 seeded/);
  assert.ok(m.calls.every(c=>c.method==='GET'));
});
test('refuses bad verification receipt',async()=>{
  const m=mock();
  await assert.rejects(verifyFlow({request:m.request,load:async()=>null,log:()=>{}}),/saved run state/);
});
test('live CLI refuses writes without opt-in',()=>{
  const file=fileURLToPath(new URL('../../scripts/public-smoke.mjs',import.meta.url));
  const r=spawnSync(process.execPath,[file,'run'],{
    env:{...process.env,RETURNDESK_LIVE_TEST:''},encoding:'utf8',timeout:5000
  });
  assert.equal(r.status,2);
  assert.match(r.stderr,/Writes disabled/);
});
