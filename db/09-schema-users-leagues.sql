CREATE TABLE `nbas`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `firebaseToken`  MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `nbas`.`users` (`id`, `email`) VALUES (1, 'admin@gmail.com');

CREATE TABLE `nbas`.`leagues` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `nbas`.`leagues` (`id`, `name`) VALUES (1, 'Default League');

CREATE TABLE `nbas`.`user_league` (
  `idUser` INT NOT NULL,
  `idLeague` INT NOT NULL,
  INDEX `fk_user_1_idx` (`idUser` ASC) VISIBLE,
  INDEX `fk_league_1_idx` (`idLeague` ASC) VISIBLE,
  CONSTRAINT `fk_user_1`
    FOREIGN KEY (`idUser`)
    REFERENCES `nbas`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_league_1`
    FOREIGN KEY (`idLeague`)
    REFERENCES `nbas`.`leagues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `nbas`.`user_league` ADD PRIMARY KEY (`idUser`, `idLeague`);

INSERT INTO `nbas`.`user_league` (`idUser`, `idLeague`) VALUES (1, 1)

CREATE TABLE `nbas`.`player_league` (
  `idPlayer` INT NOT NULL,
  `idLeague` INT NOT NULL,
  PRIMARY KEY (`idPlayer`, `idLeague`),
  INDEX `fk_league_1_idx` (`idLeague` ASC) VISIBLE,
  CONSTRAINT `fk_pl_player_1`
    FOREIGN KEY (`idPlayer`)
    REFERENCES `nbas`.`players` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pl_league_1`
    FOREIGN KEY (`idLeague`)
    REFERENCES `nbas`.`leagues` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

INSERT INTO `nbas`.`player_league` (`idPlayer`, `idLeague`)
SELECT id, 1 FROM players;

CREATE TABLE `nbas`.`team_league` (
  `idTeam` INT NOT NULL,
  `idLeague` INT NOT NULL,
  PRIMARY KEY (`idTeam`, `idLeague`),
  INDEX `fk_tl_league_1_idx` (`idLeague` ASC) VISIBLE,
  CONSTRAINT `fk_tl_team_1`
    FOREIGN KEY (`idTeam`)
    REFERENCES `nbas`.`teams` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tl_league_1`
    FOREIGN KEY (`idLeague`)
    REFERENCES `nbas`.`leagues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `nbas`.`team_league` (`idTeam`, `idLeague`)
SELECT id, 1 FROM teams;

ALTER TABLE `nbas`.`matches` 
  ADD COLUMN `idLeague` INT NOT NULL DEFAULT 1 AFTER `id`,
  ADD INDEX `fk_matches_league_1_idx` (`idLeague` ASC) VISIBLE;

ALTER TABLE `nbas`.`matches` 
  ADD CONSTRAINT `fk_matches_league_1`
    FOREIGN KEY (`idLeague`)
    REFERENCES `nbas`.`leagues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE `nbas`.`matches` 
  DROP FOREIGN KEY `fk_matches_league_1`;

ALTER TABLE `nbas`.`matches` 
  CHANGE COLUMN `idLeague` `idLeague` INT NOT NULL ;

ALTER TABLE `nbas`.`matches` 
  ADD CONSTRAINT `fk_ml_league_1`
    FOREIGN KEY (`idLeague`)
    REFERENCES `nbas`.`leagues` (`id`);

ALTER TABLE `nbas`.`match_lineup` 
ADD COLUMN `idLeague` INT NOT NULL AFTER `idPlayer`;

UPDATE `nbas`.`match_lineup` SET `idLeague`=1 WHERE `id`>0;

ALTER TABLE `nbas`.`leagues` ADD UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE;
