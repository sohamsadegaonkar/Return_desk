#!/usr/bin/env node
/** Opt-in synthetic live smoke; routine CI NEVER writes to Render. */
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://returndesk-submission-demo.onrender.com';
const STATE = '/tmp/returndesk-public-smoke-state.json';

export async function publicRequest(path, method = 'GET', data) {
  const res = await fetch(BASE + path, {
    method, redirect: 'error', signal: AbortSignal.timeout(90000),
    headers: data === undefined ? {} : {'Content-Type':'application/json'},
    body: data === undefined ? undefined : JSON.stringify(data)
  });
  let body = null;
  if (res.status !== 204) {
    try { body = await res.json(); }
    catch { throw new Error(method + ' returned non-JSON HTTP ' + res.status); }
  }
  return {status: res.status, body};
}

function expect(res, code, label, log) {
  if (res.status !== code) throw new Error(label + ': HTTP ' + res.status +
    ' expected ' + code + ', API ' + (res.body?.error?.code || 'UNKNOWN'));
  log('PASS ' + label + ' HTTP ' + code);
  return res.body?.data;
}
function ensure(ok, label) {
  if (!ok) throw new Error('FAIL ' + label);
}
function details(marker, suffix) {
  return {
    customerName: 'Synthetic QA ' + marker, customerEmail: 'qa-live@example.test',
    customerPhone: null, orderReference: 'LIVE-' + marker + '-' + suffix,
    itemIdentifier: 'QA-' + suffix, itemName: 'Synthetic cushion',
    quantity: 1, reason: 'DAMAGED'
  };
}

export async function runFlow({request, save, log = console.log, marker = randomUUID().slice(0,8).toUpperCase()}) {
  const created = [];
  try {
    const first = await request('/api/requests?pageSize=50');
    ensure(first.status === 200 && Array.isArray(first.body?.data) &&
      Number.isInteger(first.body?.pagination?.total) &&
      first.body.pagination.total >= 36 && first.body.data.length >= 36,
      '36 seeded records must be readable before any writes');
    const before = first.body.pagination.total;
    let a = expect(await request('/api/requests','POST',details(marker,'A')),201,'create A',log);
    ensure(a?.id && a.status === 'OPEN' && a.version === 1,'new Open');
    created.push(a.id);
    const id = a.id;
    ensure(expect(await request('/api/requests/' + id),200,'read A',log).id === id,'A persisted');
    a = expect(await request('/api/requests/' + id,'PATCH',{
      expectedVersion:a.version,customerName:'Synthetic QA edited '+marker
    }),200,'edit A',log);
    ensure(a.version === 2,'version increment');
    a = expect(await request('/api/requests/' + id + '/transitions','POST',{
      expectedVersion:a.version,toStatus:'IN_REVIEW'
    }),200,'in review',log);
    ensure(a.status === 'IN_REVIEW','in review stored');
    a = expect(await request('/api/requests/' + id + '/transitions','POST',{
      expectedVersion:a.version,toStatus:'APPROVED',resolution:'REFUND',refundAmount:'199.00'
    }),200,'approve',log);
    ensure(a.status === 'APPROVED' && a.refundAmount === '199.00','refund recorded (not paid)');
    a = expect(await request('/api/requests/' + id + '/transitions','POST',{
      expectedVersion:a.version,toStatus:'COMPLETED'
    }),200,'complete',log);
    ensure(a.status === 'COMPLETED' && a.refundAmount === '199.00','completed');
    expect(await request('/api/requests/' + id,'PATCH',{
      expectedVersion:a.version,customerName:'Forbidden '+marker
    }),409,'locked edit',log);
    expect(await request('/api/requests/' + id + '/notes','POST',{
      body:'Synthetic release note '+marker
    }),201,'append note',log);
    const finished = expect(await request('/api/requests/' + id),200,'reload A',log);
    ensure(finished.status === 'COMPLETED' &&
      finished.notes?.some(n=>n.body.includes(marker)),'note persisted');
    const filter = await request('/api/requests?q='+encodeURIComponent(marker)+'&status=COMPLETED&pageSize=50');
    ensure(filter.status === 200 && filter.body?.data?.some(r=>r.id===id),'combined search/filter');
    const b = expect(await request('/api/requests','POST',details(marker,'B')),201,'create B',log);
    ensure(b?.id && b.status==='OPEN','B Open');
    created.push(b.id);
    expect(await request('/api/requests/'+b.id,'DELETE',{expectedVersion:b.version}),204,'remove B',log);
    expect(await request('/api/requests/'+b.id),404,'B hidden',log);
    const end = await request('/api/requests?pageSize=50');
    ensure(end.status===200 && end.body?.pagination?.total>=before+1,'queue includes A');
    const state={id,removedId:b.id,marker,before,createdAt:new Date().toISOString()};
    await save(state);
    log('LIVE WORKFLOW SMOKE PASSED. One extra synthetic Completed record persists.');
    return state;
  } catch(e) {
    if (created.length) log('Partial synthetic request IDs: '+created.join(', '));
    throw e;
  }
}

export async function verifyFlow({request, load, log = console.log}) {
  const state = await load();
  ensure(state && typeof state.id==='string' && typeof state.removedId==='string' &&
    typeof state.marker==='string' && state.id && state.removedId && state.marker,
    'saved run state required');
  const r = expect(await request('/api/requests/'+state.id),200,'post-restart A',log);
  ensure(r.status==='COMPLETED' && r.refundAmount==='199.00','completed state');
  ensure(r.notes?.some(n=>n.body.includes(state.marker)),'note survives restart');
  expect(await request('/api/requests/'+state.removedId),404,'removed B hidden',log);
  log('POST-RESTART READ VERIFICATION PASSED (only evidence if service actually restarted)');
}

async function main() {
  const mode=process.argv[2];
  if (!['run','verify'].includes(mode)) {
    console.error('Usage: npm run test:live:run | npm run test:live:verify');
    process.exitCode=2;return;
  }
  if (mode==='run' && process.env.RETURNDESK_LIVE_TEST!=='YES') {
    console.error('Writes disabled. Explicitly set RETURNDESK_LIVE_TEST=YES.');
    process.exitCode=2;return;
  }
  const options={
    request:publicRequest,
    save:s=>writeFile(STATE,JSON.stringify(s,null,2),{mode:0o600}),
    load:async()=>JSON.parse(await readFile(STATE,'utf8'))
  };
  try {
    if(mode==='run') await runFlow(options); else await verifyFlow(options);
  } catch(e) {
    console.error('LIVE SMOKE FAILED: '+(e instanceof Error?e.message:'unknown'));
    process.exitCode=1;
  }
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
