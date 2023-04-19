/* ALTER TABLE `nbas`.`player_league` 
  ADD COLUMN `idLeagueSeason` INT NULL AFTER `idLeague`;

UPDATE `nbas`.`player_league` SET `idLeagueSeason`=1 WHERE `idLeague`=1;
UPDATE `nbas`.`player_league` SET `idLeagueSeason`=2 WHERE `idLeague`=2;

ALTER TABLE `nbas`.`player_league` 
  CHANGE COLUMN `idLeagueSeason` `idLeagueSeason` INT NOT NULL ,
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`idPlayer`, `idLeague`, `idLeagueSeason`),
  ADD INDEX `fk_season_1_idx` (`idLeagueSeason` ASC) VISIBLE;

ALTER TABLE `nbas`.`player_league` 
  DROP COLUMN `idLeagueSeason`,
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`idPlayer`, `idLeague`),
  DROP INDEX `fk_season_1_idx` ;

 */