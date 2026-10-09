import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const codingCache=sqliteTable('coding_stats_cache',{
 key:text('key').primaryKey(), payload:text('payload'), fetchedAt:integer('fetched_at'),
 lastAttemptAt:integer('last_attempt_at'),lastError:text('last_error'),nextAttemptAt:integer('next_attempt_at').notNull().default(0),
 leaseUntil:integer('lease_until').notNull().default(0),leaseToken:text('lease_token')
});
