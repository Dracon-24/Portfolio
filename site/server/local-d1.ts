// Local development/test bridge only. Production uses the platform's real D1 binding.
import {DatabaseSync} from 'node:sqlite';
export function sqliteBinding(db:DatabaseSync):D1Database{
 return {prepare(sql:string){let values:(string|number|null)[]=[];const statement={bind(...args:(string|number|null)[]){values=args;return statement},async first(){return db.prepare(sql).get(...values)??null},async run(){db.prepare(sql).run(...values);return {success:true}}};return statement}} as unknown as D1Database;
}
