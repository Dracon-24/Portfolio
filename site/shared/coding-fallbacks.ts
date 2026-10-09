import {codingConfig} from './coding-config';
import type {Platform} from './coding-config';
import type {Statistics,PlatformStats} from './coding-types';
// Initial owner-supplied values, never treated as successful provider responses.
export const initialStatistics:Record<Platform,Statistics>={
 leetcode:{currentRating:1880,rankLabel:'Knight',problemsSolved:365,easySolved:84,mediumSolved:244,hardSolved:37},
 codechef:{highestRating:1454,rankLabel:'2-star',problemsSolved:54,contestsParticipated:14},
 gfg:{problemsSolved:112},codolio:{}
};
export function fallbackProfiles():PlatformStats[]{return codingConfig.profiles.map(p=>({platform:p.platform,profileUrl:p.profileUrl,username:p.username,statistics:{...initialStatistics[p.platform]},status:p.platform==='codolio'?'unavailable':'fallback',fetchedAt:null,lastAttemptAt:null,source:p.platform==='codolio'?'Profile link only':'Owner-supplied snapshot',sourceUrl:null,error:p.platform==='codolio'?'No supported public statistics API configured':null,refreshing:false}));}
