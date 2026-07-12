CREATE TABLE `purchase_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`featureType` enum('tarot','bazi','dream','compatibility') NOT NULL,
	`credits` int NOT NULL DEFAULT 1,
	`usedCredits` int NOT NULL DEFAULT 0,
	`stripeSessionId` varchar(200),
	`status` enum('active','exhausted','expired') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchase_credits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`featureType` enum('tarot','bazi','dream','horoscope') NOT NULL,
	`usedCount` int NOT NULL DEFAULT 0,
	`periodType` enum('daily','monthly') NOT NULL,
	`periodKey` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `usage_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `productType` enum('tarot_detail','bazi_detail','dream_detail','compatibility','membership_monthly','membership_yearly','membership_lifetime') NOT NULL;