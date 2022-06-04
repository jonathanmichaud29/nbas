CREATE TABLE `nbas`.`matches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_team_home` INT NOT NULL,
  `id_team_away` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `is_completed` INT NOT NULL DEFAULT 0,
  `team_home_points` INT NOT NULL DEFAULT 0,
  `team_away_points` INT NOT NULL DEFAULT 0,
  `id_team_won` INT NULL,
  `id_team_lost` INT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `nbas`.`match_lineup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_team` INT NOT NULL,
  `id_match` INT NOT NULL,
  `id_player` INT NOT NULL,
  `hit_order` INT NOT NULL DEFAULT 0,
  `at_bats` INT NOT NULL DEFAULT 0,
  `single` INT NOT NULL DEFAULT 0,
  `double` INT NOT NULL DEFAULT 0,
  `triple` INT NOT NULL DEFAULT 0,
  `homerun` INT NOT NULL DEFAULT 0,
  `out` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));
