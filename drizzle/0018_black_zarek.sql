CREATE TABLE `share_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`platform` varchar(30) NOT NULL,
	`type` varchar(30) NOT NULL,
	`lang` varchar(5) NOT NULL DEFAULT 'en',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `share_events_id` PRIMARY KEY(`id`)
);
