CREATE TABLE `account` (
	`id` varchar(64) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(64) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`phone` varchar(32),
	`nin` varchar(16),
	`nin_verified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(64) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_passengers` (
	`id` varchar(32) NOT NULL,
	`booking_id` varchar(32) NOT NULL,
	`seat_id` varchar(32) NOT NULL,
	`full_name` varchar(128) NOT NULL,
	`passenger_type` varchar(8) NOT NULL,
	`nin` varchar(16) NOT NULL,
	`is_self` boolean NOT NULL DEFAULT false,
	CONSTRAINT `booking_passengers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` varchar(32) NOT NULL,
	`reference` varchar(32) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`train_id` varchar(32) NOT NULL,
	`origin_station_id` varchar(32) NOT NULL,
	`destination_station_id` varchar(32) NOT NULL,
	`travel_date` date NOT NULL,
	`class` varchar(16) NOT NULL,
	`total_amount_kobo` int NOT NULL,
	`payment_status` varchar(16) NOT NULL DEFAULT 'pending',
	`payment_tx_signature` varchar(128),
	`solana_reference` varchar(128),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `coaches` (
	`id` varchar(32) NOT NULL,
	`train_id` varchar(32) NOT NULL,
	`class` varchar(16) NOT NULL,
	`coach_number` varchar(8) NOT NULL,
	`total_seats` int NOT NULL,
	CONSTRAINT `coaches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing` (
	`id` varchar(32) NOT NULL,
	`origin_station_id` varchar(32) NOT NULL,
	`destination_station_id` varchar(32) NOT NULL,
	`class` varchar(16) NOT NULL,
	`passenger_type` varchar(8) NOT NULL,
	`amount_kobo` int NOT NULL,
	CONSTRAINT `pricing_id` PRIMARY KEY(`id`),
	CONSTRAINT `pricing_route_class_type_uniq` UNIQUE(`origin_station_id`,`destination_station_id`,`class`,`passenger_type`)
);
--> statement-breakpoint
CREATE TABLE `seats` (
	`id` varchar(32) NOT NULL,
	`coach_id` varchar(32) NOT NULL,
	`seat_number` int NOT NULL,
	`status` varchar(16) NOT NULL DEFAULT 'available',
	`hold_by` varchar(128),
	`hold_until` timestamp,
	`booking_id` varchar(32),
	CONSTRAINT `seats_id` PRIMARY KEY(`id`),
	CONSTRAINT `seats_coach_seat_uniq` UNIQUE(`coach_id`,`seat_number`)
);
--> statement-breakpoint
CREATE TABLE `stations` (
	`id` varchar(32) NOT NULL,
	`code` varchar(8) NOT NULL,
	`name` varchar(128) NOT NULL,
	`area` varchar(128) NOT NULL,
	`position` int NOT NULL,
	CONSTRAINT `stations_id` PRIMARY KEY(`id`),
	CONSTRAINT `stations_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` varchar(32) NOT NULL,
	`booking_id` varchar(32) NOT NULL,
	`passenger_id` varchar(32) NOT NULL,
	`qr_payload` text NOT NULL,
	`status` varchar(16) NOT NULL DEFAULT 'valid',
	`used_at` timestamp,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `train_stops` (
	`id` varchar(32) NOT NULL,
	`train_id` varchar(32) NOT NULL,
	`station_id` varchar(32) NOT NULL,
	`arrival_time` time(0) NOT NULL,
	`departure_time` time(0) NOT NULL,
	`sequence` int NOT NULL,
	`distance_km` float NOT NULL,
	CONSTRAINT `train_stops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trains` (
	`id` varchar(32) NOT NULL,
	`code` varchar(16) NOT NULL,
	`name` varchar(128) NOT NULL,
	`type` varchar(16) NOT NULL,
	`direction` varchar(32) NOT NULL,
	CONSTRAINT `trains_id` PRIMARY KEY(`id`),
	CONSTRAINT `trains_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_passengers` ADD CONSTRAINT `booking_passengers_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_passengers` ADD CONSTRAINT `booking_passengers_seat_id_seats_id_fk` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_train_id_trains_id_fk` FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_origin_station_id_stations_id_fk` FOREIGN KEY (`origin_station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_destination_station_id_stations_id_fk` FOREIGN KEY (`destination_station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coaches` ADD CONSTRAINT `coaches_train_id_trains_id_fk` FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pricing` ADD CONSTRAINT `pricing_origin_station_id_stations_id_fk` FOREIGN KEY (`origin_station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pricing` ADD CONSTRAINT `pricing_destination_station_id_stations_id_fk` FOREIGN KEY (`destination_station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seats` ADD CONSTRAINT `seats_coach_id_coaches_id_fk` FOREIGN KEY (`coach_id`) REFERENCES `coaches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_passenger_id_booking_passengers_id_fk` FOREIGN KEY (`passenger_id`) REFERENCES `booking_passengers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `train_stops` ADD CONSTRAINT `train_stops_train_id_trains_id_fk` FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `train_stops` ADD CONSTRAINT `train_stops_station_id_stations_id_fk` FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `seats_coach_status_idx` ON `seats` (`coach_id`,`status`);