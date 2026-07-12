CREATE TABLE `saved_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportType` enum('tarot','bazi','horoscope','dream') NOT NULL,
	`title` varchar(200) NOT NULL,
	`inputSummary` text,
	`reportData` json NOT NULL,
	`aiInterpretation` text,
	`isPaid` boolean DEFAULT false,
	`isFavorite` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_reports_id` PRIMARY KEY(`id`)
);
