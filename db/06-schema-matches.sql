CREATE TABLE `nbas`.`matches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idTeamHome` INT NOT NULL,
  `idTeamAway` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `isCompleted` INT NOT NULL DEFAULT 0,
  `teamHomePoints` INT NOT NULL DEFAULT 0,
  `teamAwayPoints` INT NOT NULL DEFAULT 0,
  `idTeamWon` INT NULL,
  `idTeamLost` INT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `nbas`.`match_lineup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idTeam` INT NOT NULL,
  `idMatch` INT NOT NULL,
  `idPlayer` INT NOT NULL,
  `hitOrder` INT NOT NULL DEFAULT 0,
  `atBats` INT NOT NULL DEFAULT 0,
  `single` INT NOT NULL DEFAULT 0,
  `double` INT NOT NULL DEFAULT 0,
  `triple` INT NOT NULL DEFAULT 0,
  `homerun` INT NOT NULL DEFAULT 0,
  `out` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));
