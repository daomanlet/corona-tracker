CREATE TABLE `daily_record` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `country_name` VARCHAR(64) NULL,
  `cases` INT DEFAULT 0,
  `new_cases` INT DEFAULT 0,
  `deaths` INT DEFAULT 0,
  `new_deaths` INT DEFAULT 0,
  `date` DATE NOT NULL);

  CREATE INDEX contry_name
  ON daily_record (country_name);

  CREATE INDEX record_date
  ON daily_record (date);
