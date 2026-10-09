import type {ProfileConfig} from '../shared/coding-config';
import type {Statistics} from '../shared/coding-types';
export type FetchJSON = (url:string,signal:AbortSignal)=>Promise<unknown>;
export class ProviderError extends Error {constructor(message:string,public retryAfterSeconds=0){super(message)}}
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new ProviderError('Malformed provider response');return value as Record<string,unknown>}
function optionalObject(value:unknown){return value==null?{}:object(value)}
function number(value:unknown,integer=false):number|undefined{if(value==null)return undefined;if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>100000000||(integer&&!Number.isInteger(value)))throw new ProviderError('Invalid numeric statistic');return value}
function label(value:unknown):string|undefined{if(value==null)return undefined;if(typeof value!=='string'||!value.trim()||value.length>80)throw new ProviderError('Invalid rank label');return value.trim()}
function envelope(raw:unknown,config:ProfileConfig){const r=object(raw);if(r.status!=='success'||r.platform!==config.platform||typeof r.username!=='string'||r.username.toLowerCase()!==config.username.toLowerCase())throw new ProviderError('Invalid provider identity or status');return {raw:r,data:object(r.data)}}
export function validateStatistics(raw:unknown):Statistics{
 const r=object(raw),out:Statistics={};for(const key of ['currentRating','highestRating','problemsSolved','easySolved','mediumSolved','hardSolved','contestsParticipated','contestRanking'] as const){const v=number(r[key],!key.includes('Rating'));if(v!==undefined)out[key]=v}
 const rank=label(r.rankLabel);if(rank!==undefined)out.rankLabel=rank;
 if(out.currentRating!==undefined&&out.highestRating!==undefined&&out.highestRating<out.currentRating)throw new ProviderError('Highest rating is lower than current rating');
 if(out.problemsSolved!==undefined&&out.easySolved!==undefined&&out.mediumSolved!==undefined&&out.hardSolved!==undefined&&out.easySolved+out.mediumSolved+out.hardSolved!==out.problemsSolved)throw new ProviderError('Inconsistent solved counts');
 if(out.problemsSolved===undefined)throw new ProviderError('Solved total is unavailable');return out;
}
export function normalizeLeetcode(raw:unknown,config:ProfileConfig):Statistics{const {raw:r,data:d}=envelope(raw,config);return validateStatistics({problemsSolved:d.totalSolved,currentRating:d.currentRating,highestRating:d.maxRating,rankLabel:d.rank,easySolved:r.easySolved,mediumSolved:r.mediumSolved,hardSolved:r.hardSolved,contestsParticipated:d.totalContests})}
export function normalizeCodechef(raw:unknown,config:ProfileConfig):Statistics{const {data:d}=envelope(raw,config);return validateStatistics({problemsSolved:d.totalSolved,currentRating:d.currentRating,highestRating:d.maxRating,rankLabel:typeof d.rank==='string'?d.rank.replace('★','-star'):d.rank,contestsParticipated:d.totalContests})}
export function normalizeGfg(raw:unknown,config:ProfileConfig):Statistics{const {data:d}=envelope(raw,config);return validateStatistics({problemsSolved:d.totalSolved})}
export async function fetchJSON(url:string,signal:AbortSignal,fetcher:typeof fetch=(input,init)=>globalThis.fetch(input,init)):Promise<unknown>{
 const res=await fetcher(url,{signal,headers:{Accept:'application/json'},redirect:'manual'});
 if(!res.ok){const retry=res.headers.get('retry-after');const seconds=retry?(Number.isFinite(Number(retry))?Number(retry):Math.max(0,(Date.parse(retry)-Date.now())/1000)):0;throw new ProviderError(res.status===429?'Provider rate limit reached':`Provider HTTP ${res.status}`,Number.isFinite(seconds)?seconds:0)}
 if(!res.headers.get('content-type')?.includes('application/json'))throw new ProviderError('Provider did not return JSON');
 if(!res.body)throw new ProviderError('Empty provider response');const reader=res.body.getReader();const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1000000){await reader.cancel();throw new ProviderError('Provider response is too large')}chunks.push(value)}}finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 try{return JSON.parse(new TextDecoder().decode(bytes))}catch{throw new ProviderError('Malformed provider JSON')}
}
export async function fetchProvider(config:ProfileConfig,timeoutMs:number,fetcher:FetchJSON=fetchJSON):Promise<Statistics>{
 if(config.platform==='codolio'||!config.providerUrl)throw new ProviderError('No supported public statistics API configured');
 const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;
 const work=(async()=>{const raw=await fetcher(`${config.providerUrl}/${encodeURIComponent(config.username)}`,controller.signal);const normalize={leetcode:normalizeLeetcode,codechef:normalizeCodechef,gfg:normalizeGfg};return normalize[config.platform as keyof typeof normalize](raw,config)})();
 const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new ProviderError('Provider request timed out'))},timeoutMs)});
 try{return await Promise.race([work,timeout])}finally{clearTimeout(timer)}
}
