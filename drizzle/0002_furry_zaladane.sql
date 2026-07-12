ALTER TABLE `memberships` MODIFY COLUMN `price` decimal(10,2);--> statement-breakpoint
ALTER TABLE `memberships` ADD `stripeCustomerId` varchar(100);--> statement-breakpoint
ALTER TABLE `memberships` ADD `stripeSubscriptionId` varchar(100);--> statement-breakpoint
ALTER TABLE `memberships` ADD `autoRenew` boolean DEFAULT true;