CREATE TABLE `nbas`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `firebaseToken`  MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `nbas`.`leagues` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

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