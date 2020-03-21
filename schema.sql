CREATE SCHEMA `corona_tracker` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `corona_tracker`.`daily_record` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `country_name` VARCHAR(64) NULL,
  `cases` INT NULL,
  `new_cases` INT NULL,
  `deaths` INT NULL,
  `new_deaths` INT NULL,
  `date` DATE NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `corona_tracker`.`daily_record`
ADD INDEX `contry_name` (`country_name` ASC);
// sqlite
