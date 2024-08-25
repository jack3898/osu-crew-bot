CREATE TABLE `role_rank_maps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` text NOT NULL,
	`role_id` text NOT NULL,
	`min_requirement` integer NOT NULL,
	`max_requirement` integer NOT NULL,
	`permanent` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`osu_access_token` text,
	`osu_access_token_exp` integer,
	`osu_refresh_token` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP)
);
