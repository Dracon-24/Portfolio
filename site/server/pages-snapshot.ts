import {codingConfig} from '../shared/coding-config';
import {fallbackProfiles} from '../shared/coding-fallbacks';
import type {CodingStatsResponse,Statistics} from '../shared/coding-types';
import type {ProfileConfig} from '../shared/coding-config';
import {fetchProvider} from './adapters';
export async function refreshSnapshot(previous:CodingStatsResponse|undefined,fetchStats:(config:ProfileConfig)=>Promise<Statistics> = config=>fetchProvider(config,codingConfig.timeoutMs),now=new Date().toISOString()):Promise<CodingStatsResponse>{
 const profiles=await Promise.all(fallbackProfiles().map(async fallback=>{
  const config=codingConfig.profiles.find(p=>p.platform===fallback.platform)!;
  if(!config.providerUrl)return fallback;
  try{return {...fallback,statistics:await fetchStats(config),status:'fresh' as const,fetchedAt:now,lastAttemptAt:now,source:config.sourceName!,sourceUrl:`${config.providerUrl}/${encodeURIComponent(config.username)}`,error:null}}
  catch(error){const last=previous?.profiles.find(p=>p.platform===fallback.platform&&p.fetchedAt);return {...(last??fallback),status:last?'stale' as const:'fallback' as const,lastAttemptAt:now,error:error instanceof Error?error.message:'Provider unavailable',refreshing:false}}
 }));
 return {profiles,refreshIntervalSeconds:codingConfig.refreshSeconds,generatedAt:now,cacheAvailable:true};
}
