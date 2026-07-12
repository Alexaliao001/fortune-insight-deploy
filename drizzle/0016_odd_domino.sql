CREATE TABLE `compatibility_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(64),
	`person1Name` varchar(100),
	`person1Sign` varchar(20) NOT NULL,
	`person1BirthDate` timestamp,
	`person2Name` varchar(100),
	`person2Sign` varchar(20) NOT NULL,
	`person2BirthDate` timestamp,
	`overallScore` int,
	`scores` json,
	`basicReading` text,
	`deepAnalysis` text,
	`isPaid` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `compatibility_reports_id` PRIMARY KEY(`id`)
);
