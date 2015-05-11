drop database if exists node;

create database if not exists node;

use node;

drop table if exists users;

create table if not exists `users` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`username` varchar(20) NOT NULL,
	`password` char(60) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `username_UNIQUE` (`username`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists news;

create table if not exists `news` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`created_at` int(10) unsigned NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `created_at` (`created_at`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into news (title, content, created_at) values ('The first news','Here is some fresh text', unix_timestamp()), ('The second news','Here is the second content', unix_timestamp()), ('The third title','Some piece of lazy text', unix_timestamp());