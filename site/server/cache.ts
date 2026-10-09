export interface CacheRow {key:string;payload:string|null;fetched_at:number|null;last_attempt_at:number|null;last_error:string|null;next_attempt_at:number;lease_until:number;lease_token:string|null}
export interface CacheStore {read(key:string):Promise<CacheRow|null>;claim(key:string,now:number,leaseMs:number):Promise<string|null>;success(key:string,token:string,payload:string,now:number,next:number):Promise<void>;failure(key:string,token:string,error:string,next:number):Promise<void>}
export class D1CacheStore implements CacheStore {
 constructor(private db:D1Database){}
 read(key:string){return this.db.prepare('SELECT * FROM coding_stats_cache WHERE key = ?').bind(key).first<CacheRow>()}
 async claim(key:string,now:number,leaseMs:number){const token=crypto.randomUUID();const row=await this.db.prepare(`INSERT INTO coding_stats_cache (key,last_attempt_at,lease_until,lease_token) VALUES (?,?,?,?) ON CONFLICT(key) DO UPDATE SET last_attempt_at=excluded.last_attempt_at,lease_until=excluded.lease_until,lease_token=excluded.lease_token WHERE coding_stats_cache.next_attempt_at <= ? AND coding_stats_cache.lease_until <= ? RETURNING lease_token`).bind(key,now,now+leaseMs,token,now,now).first<{lease_token:string}>();return row?.lease_token??null}
 async success(key:string,token:string,payload:string,now:number,next:number){await this.db.prepare('UPDATE coding_stats_cache SET payload=?,fetched_at=?,last_error=NULL,next_attempt_at=?,lease_until=0,lease_token=NULL WHERE key=? AND lease_token=?').bind(payload,now,next,key,token).run()}
 async failure(key:string,token:string,error:string,next:number){await this.db.prepare('UPDATE coding_stats_cache SET last_error=?,next_attempt_at=?,lease_until=0,lease_token=NULL WHERE key=? AND lease_token=?').bind(error,next,key,token).run()}
}
