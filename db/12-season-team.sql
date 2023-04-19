CREATE TABLE `nbas`.`team_season` (
  `idTeam` INT NOT NULL,
  `idLeagueSeason` INT NOT NULL,
  PRIMARY KEY (`idTeam`, `idLeagueSeason`));

ALTER TABLE `nbas`.`team_season` 
  ADD INDEX `fk_team_season_1_idx` (`idLeagueSeason` ASC) VISIBLE;

ALTER TABLE `nbas`.`team_season` 
  ADD CONSTRAINT `fk_team_league_1`
    FOREIGN KEY (`idTeam`)
    REFERENCES `nbas`.`team_league` (`idTeam`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_team_season_1`
    FOREIGN KEY (`idLeagueSeason`)
    REFERENCES `nbas`.`league_season` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
