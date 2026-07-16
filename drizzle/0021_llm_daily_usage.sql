CREATE TABLE `llm_daily_usage` (
	`dateKey` varchar(10) NOT NULL,
	`usedCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `llm_daily_usage_dateKey` PRIMARY KEY(`dateKey`)
);
