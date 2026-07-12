CREATE TABLE `access_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(40) NOT NULL,
	`label` varchar(100),
	`membershipType` enum('monthly','yearly','lifetime') NOT NULL DEFAULT 'lifetime',
	`maxUses` int NOT NULL DEFAULT 30,
	`usedCount` int NOT NULL DEFAULT 0,
	`status` enum('active','disabled','exhausted') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdBy` int,
	`note` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `access_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `access_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `access_code_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codeId` int NOT NULL,
	`code` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`membershipType` enum('monthly','yearly','lifetime') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_code_redemptions_id` PRIMARY KEY(`id`)
);
