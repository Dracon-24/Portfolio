import {codingConfig,platforms} from '../../shared/coding-config';
import type {Platform} from '../../shared/coding-config';
import type {Statistics,PlatformStats,CodingStatsResponse} from '../../shared/coding-types';
function format(n:number|undefined){return n===undefined?'Unavailable':Number.isInteger(n)?String(n):n.toFixed(0)}
export function cardView(p:PlatformStats){const s=p.statistics,rows:{label:string;value:string}[]=[];let label='Problems solved',value=format(s.problemsSolved),title=s.rankLabel?.replace(/[-–—]/g,' ')??'';
 if(p.platform==='leetcode'){label=p.status==='fallback'?'Supplied rating':'Current contest rating';value=format(s.currentRating);rows.push({label:'Problems solved',value:format(s.problemsSolved)});if(s.contestRanking!==undefined)rows.push({label:'Contest ranking',value:format(s.contestRanking)})}
 if(p.platform==='codechef'){label=s.currentRating!==undefined?'Current rating':'Highest rating';value=format(s.currentRating??s.highestRating);if(s.currentRating!==undefined)rows.push({label:'Highest rating',value:format(s.highestRating)});rows.push({label:'Problems solved',value:format(s.problemsSolved)},{label:'Contests',value:format(s.contestsParticipated)})}
 if(p.platform==='gfg')title='Practice & progress';
 if(p.platform==='codolio'){label='Across platforms';value=s.problemsSolved===undefined?'One profile.':format(s.problemsSolved);title='A wider view'}
 const breakdown=p.platform==='leetcode'&&s.easySolved!==undefined&&s.mediumSolved!==undefined&&s.hardSolved!==undefined?[{label:'Easy',count:s.easySolved},{label:'Medium',count:s.mediumSolved},{label:'Hard',count:s.hardSolved}]:undefined;
 return {label,value,title,rows,breakdown};
}
export function heroMetrics(profiles:PlatformStats[]){const by=(p:Platform)=>profiles.find(x=>x.platform===p)!;const metrics=[{p:by('leetcode'),key:'currentRating',label:'LeetCode rating'},{p:by('leetcode'),key:'problemsSolved',label:'LeetCode solved'},{p:by('codechef'),key:'highestRating',label:'CodeChef peak rating'},{p:by('gfg'),key:'problemsSolved',label:'GFG solved'}] as const;return metrics.map(m=>({value:format(m.p.statistics[m.key]),label:m.label,status:m.p.status}))}
export function statusLabel(p:PlatformStats,loading:boolean,error:boolean,now=Date.now()){
 if(loading)return 'Checking for updates…';
 if(p.status==='unavailable')return 'Live statistics unavailable';
 if(p.status==='fallback')return error||p.error?'Live data unavailable · Initial snapshot':'Initial snapshot';
 if(error||p.error)return 'Live data temporarily unavailable · Last successful update';
 if(p.status==='stale')return p.refreshing?'Cached data · Updating…':'Cached data · Refresh pending';
 const age=p.fetchedAt?Math.max(0,now-Date.parse(p.fetchedAt)):0;const hours=Math.floor(age/3600000),minutes=Math.floor(age/60000);return `Fetched ${hours?`${hours}h ago`:minutes?`${minutes}m ago`:'just now'} · Cached`;
}
export function parseDashboard(raw:unknown):CodingStatsResponse{
 if(!raw||typeof raw!=='object')throw new Error('Invalid stats response');const r=raw as CodingStatsResponse;
 if(!Array.isArray(r.profiles)||r.profiles.length!==4||typeof r.cacheAvailable!=='boolean'||typeof r.refreshIntervalSeconds!=='number'||!Number.isFinite(r.refreshIntervalSeconds)||r.refreshIntervalSeconds<1||typeof r.generatedAt!=='string'||!Number.isFinite(Date.parse(r.generatedAt)))throw new Error('Invalid dashboard');
 for(const platform of platforms){const p=r.profiles.find(p=>p.platform===platform);const config=codingConfig.profiles.find(c=>c.platform===platform)!;
 if(!p||p.profileUrl!==config.profileUrl||p.username!==config.username||!['fresh','stale','fallback','unavailable'].includes(p.status)||typeof p.refreshing!=='boolean'||!p.statistics||typeof p.statistics!=='object'||Array.isArray(p.statistics))throw new Error('Invalid platform');
 for(const [key,v] of Object.entries(p.statistics)){if(key==='rankLabel'){if(typeof v!=='string'||v.length>80)throw new Error('Invalid label')}else if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100000000||(!key.includes('Rating')&&!Number.isInteger(v)))throw new Error('Invalid statistic')}
 if((p.status==='fresh'||p.status==='stale')&&(!p.fetchedAt||!Number.isFinite(Date.parse(p.fetchedAt))))throw new Error('Invalid fetched timestamp');
 }
 return {...r,profiles:platforms.map(platform=>r.profiles.find(p=>p.platform===platform)!)};
}
