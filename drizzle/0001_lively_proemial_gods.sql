CREATE TABLE `bazi_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(64),
	`birthYear` int NOT NULL,
	`birthMonth` int NOT NULL,
	`birthDay` int NOT NULL,
	`birthHour` int,
	`birthMinute` int,
	`gender` enum('male','female'),
	`baziChart` json,
	`personalityAnalysis` text,
	`talentAnalysis` text,
	`careerSuggestions` text,
	`fullReport` text,
	`isPaid` boolean DEFAULT false,
	`reportUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bazi_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `charity_donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int,
	`amount` decimal(10,2) NOT NULL,
	`projectName` varchar(100) NOT NULL,
	`projectDescription` text,
	`status` enum('pending','donated','failed') NOT NULL DEFAULT 'pending',
	`donatedAt` timestamp,
	`notificationSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `charity_donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('insight','story','article') NOT NULL DEFAULT 'insight',
	`title` varchar(200),
	`content` text NOT NULL,
	`imageUrls` json,
	`relatedReadingId` int,
	`relatedReadingType` varchar(20),
	`likesCount` int DEFAULT 0,
	`commentsCount` int DEFAULT 0,
	`isKolContent` boolean DEFAULT false,
	`status` enum('published','draft','hidden') NOT NULL DEFAULT 'published',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `horoscopes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zodiacSign` varchar(20) NOT NULL,
	`periodType` enum('daily','weekly','monthly') NOT NULL,
	`periodDate` timestamp NOT NULL,
	`overallScore` int,
	`loveScore` int,
	`careerScore` int,
	`wealthScore` int,
	`healthScore` int,
	`content` text,
	`advice` text,
	`luckyColor` varchar(20),
	`luckyNumber` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `horoscopes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('monthly','yearly','lifetime') NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp,
	`price` decimal(10,2) NOT NULL,
	`charityAmount` decimal(10,2),
	`paymentMethod` varchar(20),
	`transactionId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`orderNo` varchar(64) NOT NULL,
	`productType` enum('tarot_detail','bazi_detail','membership_monthly','membership_yearly','membership_lifetime') NOT NULL,
	`productId` int,
	`amount` decimal(10,2) NOT NULL,
	`charityAmount` decimal(10,2),
	`paymentMethod` enum('wechat','alipay'),
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(100),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNo_unique` UNIQUE(`orderNo`)
);
--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`parentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tarot_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(64),
	`questionType` enum('love','career','wealth','health','general') NOT NULL,
	`question` text,
	`cards` json,
	`basicReading` text,
	`detailedReading` text,
	`isPaid` boolean DEFAULT false,
	`reportUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tarot_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_growth` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`selfAwareness` int DEFAULT 0,
	`emotionalManagement` int DEFAULT 0,
	`intimateRelationships` int DEFAULT 0,
	`careerPotential` int DEFAULT 0,
	`wealthMindset` int DEFAULT 0,
	`healthWellness` int DEFAULT 0,
	`spiritualGrowth` int DEFAULT 0,
	`socialConnection` int DEFAULT 0,
	`totalPoints` int DEFAULT 0,
	`level` int DEFAULT 1,
	`badges` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_growth_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `zodiacSign` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `birthTime` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `birthPlace` varchar(100);