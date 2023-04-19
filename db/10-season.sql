CREATE TABLE `nbas`.`league_season` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `year` INT NOT NULL,
  `idLeague` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `league_idx` (`idLeague` ASC) VISIBLE);

INSERT INTO `nbas`.`league_season` (`id`, `name`, `year`, `idLeague`) VALUES ('1', 'Été', '2022', '1');



ALTER TABLE `nbas`.`matches` 
  ADD COLUMN `idSeason` INT NULL AFTER `idLeague`,
  ADD INDEX `fk_matches_season_1_idx` (`idSeason` ASC) VISIBLE;

UPDATE `nbas`.`matches` SET `idSeason`=1 WHERE idLeague=1;
/* UPDATE `nbas`.`matches` SET `idSeason`=2 WHERE idLeague=2; */

ALTER TABLE `nbas`.`matches` 
CHANGE COLUMN `idSeason` `idSeason` INT NOT NULL ;
ALTER TABLE `nbas`.`matches` 
ADD CONSTRAINT `fk_ls_season_1`
  FOREIGN KEY (`idSeason`)
  REFERENCES `nbas`.`league_season` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `nbas`.`match_lineup` 
  ADD COLUMN `idSeason` INT NULL AFTER `idLeague`;

UPDATE `nbas`.`match_lineup` SET `idSeason`=1 WHERE idLeague=1;
/* UPDATE `nbas`.`match_lineup` SET `idSeason`=2 WHERE idLeague=2; */



ALTER TABLE `nbas`.`match_lineup` 
  ADD INDEX `fk_season_1_idx` (`idSeason` ASC) VISIBLE;

ALTER TABLE `nbas`.`match_lineup` 
  CHANGE COLUMN `idSeason` `idSeason` INT NOT NULL ;

ALTER TABLE `nbas`.`match_lineup` 
  ADD INDEX `fk_team_1_idx` (`idTeam` ASC) VISIBLE;

ALTER TABLE `nbas`.`match_lineup` 
  ADD INDEX `fk_player_1_idx` (`idPlayer` ASC) VISIBLE;



/* ALTER TABLE `nbas`.`team_league` 
  ADD COLUMN `idSeason` INT NULL AFTER `idLeague`;

UPDATE `nbas`.`team_league` SET `idSeason`=1 WHERE idLeague=1;

ALTER TABLE `nbas`.`team_league` 
CHANGE COLUMN `idSeason` `idSeason` INT NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`idTeam`, `idLeague`, `idSeason`);
 */



ALTER TABLE `nbas`.`team_player` 
  ADD COLUMN `idSeason` INT NULL AFTER `idPlayer`;

UPDATE `nbas`.`team_player` SET `idSeason`=1 WHERE idTeam>0;
/* UPDATE `nbas`.`team_player` SET `idSeason`=1 WHERE idTeam IN (2,45,67,68); */
/* UPDATE `nbas`.`team_player` SET `idSeason`=2 WHERE idTeam IN (78,79,80); */

ALTER TABLE `nbas`.`team_player` 
  CHANGE COLUMN `idSeason` `idSeason` INT NOT NULL ,
  ADD PRIMARY KEY (`idTeam`, `idPlayer`, `idSeason`);

ALTER TABLE `nbas`.`team_player` 
  CHANGE COLUMN `idSeason` `idLeagueSeason` INT NOT NULL ;

ALTER TABLE `nbas`.`league_season` 
  ADD UNIQUE INDEX `league_season_UNIQUE` (`name` ASC, `year` ASC, `idLeague` ASC) VISIBLE;

