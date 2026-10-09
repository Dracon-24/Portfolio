import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../server/worker';
import type {Env} from '../server/worker';
const env={ASSETS:{async fetch(request:Request){return new Response(new URL(request.url).pathname==='/index.html'?'portfolio':'missing',{status:new URL(request.url).pathname==='/index.html'?200:404})}}} as Env;
const ctx={waitUntil(_p:Promise<unknown>){}};
test('API does not expose a force-refresh, arbitrary username, or mutation endpoint',async()=>{assert.equal((await worker.fetch(new Request('https://example.com/api/coding-stats?username=someone'),env,ctx)).status,400);assert.equal((await worker.fetch(new Request('https://example.com/api/coding-stats',{method:'POST'}),env,ctx)).status,405);assert.equal((await worker.fetch(new Request('https://example.com/api/other'),env,ctx)).status,404)});
test('missing cache binding returns a truthful structured fallback for all four platforms',async()=>{const response=await worker.fetch(new Request('https://example.com/api/coding-stats'),env,ctx);assert.equal(response.status,503);const data=await response.json() as {cacheAvailable:boolean;profiles:{status:string;fetchedAt:string|null}[]};assert.equal(data.cacheAvailable,false);assert.equal(data.profiles.length,4);assert.equal(data.profiles[3].status,'unavailable');assert.ok(data.profiles.every(p=>p.fetchedAt===null))});
test('project routes use SPA fallback while missing assets keep their 404',async()=>{const route=await worker.fetch(new Request('https://example.com/projects/posturector'),env,ctx);assert.equal(await route.text(),'portfolio');const asset=await worker.fetch(new Request('https://example.com/missing.png'),env,ctx);assert.equal(asset.status,404)});
