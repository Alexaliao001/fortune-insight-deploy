CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`senderType` enum('user','admin','system') NOT NULL,
	`senderId` int,
	`senderName` varchar(100),
	`content` text NOT NULL,
	`messageType` enum('text','image','file','system') NOT NULL DEFAULT 'text',
	`fileUrl` text,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`userName` varchar(100),
	`userEmail` varchar(320),
	`status` enum('waiting','active','closed') NOT NULL DEFAULT 'waiting',
	`assignedAdminId` int,
	`topic` varchar(200),
	`lastMessageAt` timestamp,
	`closedAt` timestamp,
	`closedBy` enum('user','admin','system'),
	`rating` int,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `chat_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
