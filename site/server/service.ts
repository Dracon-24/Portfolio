import {codingConfig} from '../shared/coding-config';
import type {ProfileConfig} from '../shared/coding-config';
import {fallbackProfiles} from '../shared/coding-fallbacks';
import type {CodingStatsResponse,PlatformStats,Statistics} from '../shared/coding-types';
import type {CacheRow,CacheStore} from './cache';
import {fetchProvider,ProviderError,validateStatistics} from './adapters';
export interface ServiceOptions {refreshSeconds:number;timeoutMs:number;retrySeconds:number}
export function cacheKey(p:ProfileConfig){return `${p.platform}:${p.username}:${p.providerUrl??'none'}:v3`}
export function present(p:ProfileConfig,row:CacheRow|null,now:number,options:ServiceOptions):PlatformStats{
 const base=fallbackProfiles().find(x=>x.platform===p.platform)!;if(!row)return base;
 const attempted=row.last_attempt_at?new Date(row.last_attempt_at).toISOString():null;
 if(row.payload&&row.fetched_at){try{const statistics=validateStatistics(JSON.parse(row.payload));return {...base,statistics,status:row.last_error||now-row.fetched_at>=options.refreshSeconds*1000?'stale':'fresh',fetchedAt:new Date(row.fetched_at).toISOString(),lastAttemptAt:attempted,source:p.sourceName!,sourceUrl:p.providerUrl,error:row.last_error,refreshing:row.lease_until>now}}catch{/* Corrupt cache is never displayed as a successful fetch. */}}
 return {...base,lastAttemptAt:attempted,error:row.last_error??'No successful provider response yet',refreshing:row.lease_until>now};
}
export class CodingStatsService {
 constructor(private store:CacheStore,private options:ServiceOptions,private provider:(p:ProfileConfig,timeoutMs:number)=>Promise<Statistics>=fetchProvider,private now=()=>Date.now()){}
 async refreshOne(p:ProfileConfig){if(!p.providerUrl)return;const key=cacheKey(p);const token=await this.store.claim(key,this.now(),this.options.timeoutMs+15000);if(!token)return;
  try{const statistics=validateStatistics(await this.provider(p,this.options.timeoutMs));const now=this.now();await this.store.success(key,token,JSON.stringify(statistics),now,now+this.options.refreshSeconds*1000)}catch(e){console.error('Coding provider refresh failed',p.platform,e instanceof Error?e.name:'unknown',e instanceof Error?e.message:'unknown');const delay=Math.max(this.options.retrySeconds,e instanceof ProviderError?e.retryAfterSeconds:0);await this.store.failure(key,token,e instanceof ProviderError?e.message:e instanceof Error?`Provider request failed: ${e.name}: ${e.message.slice(0,180)}`:'Provider is temporarily unavailable',this.now()+Math.min(delay,86400)*1000)}
 }
 async get(waitUntil?:(promise:Promise<unknown>)=>void):Promise<CodingStatsResponse>{
  let rows=await Promise.all(codingConfig.profiles.map(p=>this.store.read(cacheKey(p))));const now=this.now();const due=codingConfig.profiles.filter((p,i)=>p.providerUrl&&(!rows[i]||(rows[i]!.next_attempt_at<=now&&rows[i]!.lease_until<=now)));
  if(due.length){const refresh=Promise.allSettled(due.map(p=>this.refreshOne(p)));const hasSuccessfulCache=rows.some(r=>r?.payload&&r.fetched_at);
   if(waitUntil&&hasSuccessfulCache){waitUntil(refresh);rows=rows.map((r,i)=>due.includes(codingConfig.profiles[i])&&r?{...r,lease_until:now+this.options.timeoutMs+15000}:r)}else{await refresh;rows=await Promise.all(codingConfig.profiles.map(p=>this.store.read(cacheKey(p))))}
  }
  return {profiles:codingConfig.profiles.map((p,i)=>present(p,rows[i],this.now(),this.options)),refreshIntervalSeconds:this.options.refreshSeconds,generatedAt:new Date(this.now()).toISOString(),cacheAvailable:true};
 }
}
export function unavailableResponse():CodingStatsResponse{return {profiles:fallbackProfiles().map(p=>p.platform==='codolio'?p:{...p,error:'Statistics cache is temporarily unavailable'}),refreshIntervalSeconds:codingConfig.refreshSeconds,generatedAt:new Date().toISOString(),cacheAvailable:false}}
