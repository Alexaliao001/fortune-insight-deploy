CREATE TABLE `user_feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(64),
	`sourceType` enum('tarot','bazi','horoscope','dream') NOT NULL,
	`sourceId` int,
	`rating` int NOT NULL,
	`tags` json,
	`comment` text,
	`isAnonymous` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_feedbacks_id` PRIMARY KEY(`id`)
);
