ALTER TABLE `nbas`.`match_lineup` 
ADD COLUMN `hitByPitch` INT NOT NULL DEFAULT '0' AFTER `out`,
ADD COLUMN `walk` INT NOT NULL DEFAULT '0' AFTER `hitByPitch`,
ADD COLUMN `strikeOut` INT NOT NULL DEFAULT '0' AFTER `walk`,
ADD COLUMN `stolenBase` INT NOT NULL DEFAULT '0' AFTER `strikeOut`,
ADD COLUMN `caughtStealing` INT NOT NULL DEFAULT '0' AFTER `stolenBase`,
ADD COLUMN `plateAppearance` INT NOT NULL DEFAULT '0' AFTER `caughtStealing`,
ADD COLUMN `sacrificeBunt` INT NOT NULL DEFAULT '0' AFTER `plateAppearance`,
ADD COLUMN `sacrificeFly` INT NOT NULL DEFAULT '0' AFTER `sacrificeBunt`,
ADD COLUMN `runsBattedIn` INT NOT NULL DEFAULT '0' AFTER `sacrificeFly`,
ADD COLUMN `hit` INT NOT NULL DEFAULT '0' AFTER `runsBattedIn`;
