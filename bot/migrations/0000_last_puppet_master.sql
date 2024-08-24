CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`osu_access_token` text,
	`osu_access_token_exp` integer,
	`osu_refresh_token` text,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL
);
