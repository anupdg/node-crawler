--Execute the following scripts 
--Please use an user with database create permission

create database webchecker;

--Set CHARACTER and COLLATE
ALTER DATABASE webchecker CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci';


drop table IF EXISTS `webchecker`.`domain` ;
CREATE TABLE `webchecker`.`domain` (
  `domain_id` INT NOT NULL AUTO_INCREMENT,
  `domain` VARCHAR(500) NULL,
  `updateddate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`domain_id`)
);


drop table IF EXISTS `webchecker`.`geo_info` ;
CREATE TABLE `webchecker`.`geo_info` (
  `geo_id` INT NOT NULL AUTO_INCREMENT,
  `registrar` VARCHAR(200) NULL,
  `domain_id` INT NOT NULL,
  `creation_date` DATETIME NULL,
  `updated_date` DATETIME NULL,
  `name_server` VARCHAR(500) NULL,
  `ip` VARCHAR(20) NULL,
  `city` VARCHAR(150) NULL,
  `region` VARCHAR(150) NULL,
  `region_code` VARCHAR(50) NULL,
  `registrant_organization` VARCHAR(200) NULL,
  `country` VARCHAR(50) NULL,
  `country_code` VARCHAR(10) NULL,
  `postal` VARCHAR(30) NULL,
  `asn` VARCHAR(15) NULL,
  PRIMARY KEY (`geo_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  );




drop table IF EXISTS `webchecker`.`ssl_info` ;
CREATE TABLE `webchecker`.`ssl_info` (
  `ssl_id` INT NOT NULL AUTO_INCREMENT,
  `domain_id` INT NOT NULL,
  `ocsp_uri` VARCHAR(200) NULL,
  `valid_from` DATETIME NULL,
  `valid_to` DATETIME NULL,
  `ca_issuers_uri` VARCHAR(200) NULL,
  PRIMARY KEY (`ssl_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  );



drop table IF EXISTS `webchecker`.`links` ;
CREATE TABLE `webchecker`.`links` (
  `links_id` INT NOT NULL AUTO_INCREMENT,
  `domain_id` INT NOT NULL,
  `privacy` VARCHAR(1000) NULL,
  `terms` VARCHAR(1000) NULL,
  PRIMARY KEY (`links_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  );


drop table IF EXISTS `webchecker`.`contactus` ;
CREATE TABLE `webchecker`.`contactus` (
  `contact_us_id` INT NOT NULL AUTO_INCREMENT,
  `domain_id` INT NOT NULL,
  `contact_us` TEXT NULL,
  PRIMARY KEY (`contact_us_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  );

ALTER TABLE webchecker.contactus MODIFY COLUMN contact_us text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;


drop table IF EXISTS `webchecker`.`social` ;
CREATE TABLE `webchecker`.`social` (
  `social_id` INT NOT NULL AUTO_INCREMENT,
  `domain_id` INT NOT NULL,
  `link` varchar(500) NULL,
  `type` varchar(50) NULL,
  `message` varchar(500) NULL,
  PRIMARY KEY (`social_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  )



drop table IF EXISTS `webchecker`.`log` ;
CREATE TABLE `webchecker`.`log` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `domain_id` INT NOT NULL,
  `message` varchar(500) NULL,
  `type` varchar(10) NULL,
  `body` text NULL,
  PRIMARY KEY (`log_id`),
  FOREIGN KEY (`domain_id`) REFERENCES `webchecker`.`domain`(`domain_id`)
  );



