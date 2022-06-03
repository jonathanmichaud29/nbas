
ALTER TABLE `nbas`.`team_player` 
ADD INDEX `index_team` (`id_team` ASC) VISIBLE,
ADD INDEX `index_player` (`id_player` ASC) VISIBLE;
;

ALTER TABLE `nbas`.`team_player` 
ADD INDEX `fk_team_1_idx` (`id_team` ASC) VISIBLE;

ALTER TABLE `nbas`.`team_player` 
ADD CONSTRAINT `fk_team_1`
  FOREIGN KEY (`id_team`)
  REFERENCES `nbas`.`teams` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `nbas`.`team_player` 
  ADD INDEX `fk_player_1_idx` (`id_player` ASC) VISIBLE;

ALTER TABLE `nbas`.`team_player` 
ADD CONSTRAINT `fk_player_1`
  FOREIGN KEY (`id_player`)
  REFERENCES `nbas`.`players` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;