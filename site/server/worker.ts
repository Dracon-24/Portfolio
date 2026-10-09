import {D1CacheStore} from './cache';
import {CodingStatsService,unavailableResponse} from './service';
import {codingConfig} from '../shared/coding-config';
export interface Env {DB:D1Database;ASSETS:{fetch(request:Request):Promise<Response>};CODING_STATS_REFRESH_SECONDS?:string;CODING_STATS_TIMEOUT_MS?:string;CODING_STATS_RETRY_SECONDS?:string}
function setting(raw:string|undefined,fallback:number,min:number,max:number){const n=raw===undefined?fallback:Number(raw);return Number.isFinite(n)&&n>=min&&n<=max?Math.round(n):fallback}
export default {
 async fetch(request:Request,env:Env,ctx:{waitUntil(promise:Promise<unknown>):void}):Promise<Response>{
 const url=new URL(request.url);
 if(url.pathname==='/api/coding-stats'){
  if(request.method!=='GET')return Response.json({error:'Method not allowed'},{status:405,headers:{Allow:'GET'}});
  if(url.search)return Response.json({error:'This endpoint does not accept query parameters'},{status:400});
  try{const service=new CodingStatsService(new D1CacheStore(env.DB),{refreshSeconds:setting(env.CODING_STATS_REFRESH_SECONDS,codingConfig.refreshSeconds,3600,604800),timeoutMs:setting(env.CODING_STATS_TIMEOUT_MS,codingConfig.timeoutMs,1000,15000),retrySeconds:setting(env.CODING_STATS_RETRY_SECONDS,codingConfig.retrySeconds,300,86400)});
   const data=await service.get(p=>ctx.waitUntil(p));return Response.json(data,{headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }catch{console.error('Coding statistics cache operation failed');return Response.json(unavailableResponse(),{status:503,headers:{'Cache-Control':'no-store'}})}
 }
 if(url.pathname.startsWith('/api/'))return Response.json({error:'Not found'},{status:404});
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const response=await env.ASSETS.fetch(request);
 if(response.status===404&&!url.pathname.split('/').pop()?.includes('.')){const fallback=new URL(request.url);fallback.pathname='/index.html';return env.ASSETS.fetch(new Request(fallback,request))}
 return response;
 }
};
