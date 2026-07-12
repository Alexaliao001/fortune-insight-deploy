ALTER TABLE `user_growth` ADD `currentStreak` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_growth` ADD `longestStreak` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_growth` ADD `lastActiveDate` varchar(10);