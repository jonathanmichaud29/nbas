ALTER TABLE `nbas`.`match_lineup` 
ADD INDEX `fk_match_1_idx` (`idMatch` ASC) VISIBLE;
;
ALTER TABLE `nbas`.`match_lineup` 
ADD CONSTRAINT `fk_match_1`
  FOREIGN KEY (`idMatch`)
  REFERENCES `nbas`.`matches` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
