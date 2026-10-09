CREATE TABLE `coding_stats_cache` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text,
	`fetched_at` integer,
	`last_attempt_at` integer,
	`last_error` text,
	`next_attempt_at` integer DEFAULT 0 NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`lease_token` text
);
