import type {Platform} from './coding-config';
export interface Statistics {
 currentRating?:number; highestRating?:number; rankLabel?:string;
 problemsSolved?:number; easySolved?:number; mediumSolved?:number; hardSolved?:number;
 contestsParticipated?:number; contestRanking?:number;
}
export type StatsStatus = 'fresh'|'stale'|'fallback'|'unavailable';
export interface PlatformStats {
 platform:Platform; profileUrl:string; username:string; statistics:Statistics;
 status:StatsStatus; fetchedAt:string|null; lastAttemptAt:string|null;
 source:string; sourceUrl:string|null; error:string|null; refreshing:boolean;
}
export interface CodingStatsResponse {profiles:PlatformStats[];refreshIntervalSeconds:number;generatedAt:string;cacheAvailable:boolean}
