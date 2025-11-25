-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema laboratorio_agendamentos
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema laboratorio_agendamentos
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `laboratorio_agendamentos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `laboratorio_agendamentos` ;

-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`administrador` (
  `id_administrador` INT NOT NULL AUTO_INCREMENT,
  `nome_administrador` VARCHAR(100) NOT NULL,
  `email_administrador` VARCHAR(100) NOT NULL,
  `senha_administrador` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_administrador`),
  UNIQUE INDEX `email_administrador` (`email_administrador` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`professor` (
  `id_professor` INT NOT NULL AUTO_INCREMENT,
  `nome_professor` VARCHAR(100) NOT NULL,
  `email_professor` VARCHAR(100) NOT NULL,
  `senha_professor` VARCHAR(255) NOT NULL,
  `administrador_id_administrador` INT NOT NULL,
  PRIMARY KEY (`id_professor`),
  UNIQUE INDEX `email_professor` (`email_professor` ASC) VISIBLE,
  INDEX `fk_professor_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  CONSTRAINT `fk_professor_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`laboratorios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`laboratorios` (
  `id_laboratorio` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `capacidade` INT NOT NULL,
  `localizacao` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id_laboratorio`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`agendamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`agendamentos` (
  `id_agendamento` INT NOT NULL AUTO_INCREMENT,
  `id_professor` INT NOT NULL,
  `id_laboratorio` INT NOT NULL,
  `data_agendamento` DATE NOT NULL,
  `horario_inicio` TIME NOT NULL,
  `horario_fim` TIME NOT NULL,
  `status` ENUM('pendente', 'confirmado', 'concluido', 'cancelado') NULL DEFAULT 'pendente',
  `observacoes` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id_agendamento`),
  INDEX `id_professor` (`id_professor` ASC) VISIBLE,
  INDEX `id_laboratorio` (`id_laboratorio` ASC) VISIBLE,
  CONSTRAINT `agendamentos_ibfk_1`
    FOREIGN KEY (`id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`),
  CONSTRAINT `agendamentos_ibfk_2`
    FOREIGN KEY (`id_laboratorio`)
    REFERENCES `laboratorio_agendamentos`.`laboratorios` (`id_laboratorio`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`kits`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`kits` (
  `id_kit` INT NOT NULL AUTO_INCREMENT,
  `nome_kit` VARCHAR(255) NOT NULL,
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `vidrarias` JSON NULL,
  `reagentes` JSON NULL,
  `professor_id_professor` INT NOT NULL,
  `status` ENUM('ativo', 'inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_kit`),
  INDEX `fk_kits_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  CONSTRAINT `fk_kits_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`agendamento_kits`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`agendamento_kits` (
  `id_agendamento` INT NOT NULL,
  `id_kit` INT NOT NULL,
  PRIMARY KEY (`id_agendamento`, `id_kit`),
  INDEX `id_kit` (`id_kit` ASC) VISIBLE,
  CONSTRAINT `agendamento_kits_ibfk_1`
    FOREIGN KEY (`id_agendamento`)
    REFERENCES `laboratorio_agendamentos`.`agendamentos` (`id_agendamento`),
  CONSTRAINT `agendamento_kits_ibfk_2`
    FOREIGN KEY (`id_kit`)
    REFERENCES `laboratorio_agendamentos`.`kits` (`id_kit`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`reagente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`reagente` (
  `id_reagente` INT NOT NULL AUTO_INCREMENT,
  `nome_reagente` VARCHAR(100) NOT NULL,
  `quantidade` VARCHAR(50) NOT NULL,
  `divisao` VARCHAR(50) NOT NULL,
  `administrador_id_administrador` INT NOT NULL,
  `professor_id_professor` INT NOT NULL,
  PRIMARY KEY (`id_reagente`),
  INDEX `fk_reagente_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  INDEX `fk_reagente_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  CONSTRAINT `fk_reagente_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`),
  CONSTRAINT `fk_reagente_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`vidraria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`vidraria` (
  `id_vidraria` INT NOT NULL AUTO_INCREMENT,
  `nome_vidraria` VARCHAR(100) NOT NULL,
  `capacidade` VARCHAR(20) NOT NULL,
  `unidade` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `administrador_id_administrador` INT NOT NULL,
  `professor_id_professor` INT NOT NULL,
  PRIMARY KEY (`id_vidraria`),
  INDEX `fk_vidraria_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  INDEX `fk_vidraria_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  CONSTRAINT `fk_vidraria_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`),
  CONSTRAINT `fk_vidraria_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`tecnico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`tecnico` (
  `id_tecnico` INT NOT NULL AUTO_INCREMENT,
  `nome_tecnico` VARCHAR(100) NOT NULL,
  `email_tecnico` VARCHAR(100) NOT NULL,
  `senha_tecnico` VARCHAR(255) NOT NULL,
  `administrador_id_administrador` INT NOT NULL,
  PRIMARY KEY (`id_tecnico`),
  UNIQUE INDEX `email_tecnico` (`email_tecnico` ASC) VISIBLE,
  INDEX `fk_tecnico_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  CONSTRAINT `fk_tecnico_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`estoque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`estoque` (
  `id_estoque` INT NOT NULL AUTO_INCREMENT,
  `id_reagente` INT NOT NULL,
  `id_vidraria` INT NOT NULL,
  `id_tecnico` INT NOT NULL,
  `tipo` ENUM('entrada', 'saida') NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  `data_estoque` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observacao` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id_estoque`),
  INDEX `id_reagente` (`id_reagente` ASC) VISIBLE,
  INDEX `id_vidraria` (`id_vidraria` ASC) VISIBLE,
  INDEX `id_tecnico` (`id_tecnico` ASC) VISIBLE,
  CONSTRAINT `estoque_ibfk_1`
    FOREIGN KEY (`id_reagente`)
    REFERENCES `laboratorio_agendamentos`.`reagente` (`id_reagente`),
  CONSTRAINT `estoque_ibfk_2`
    FOREIGN KEY (`id_vidraria`)
    REFERENCES `laboratorio_agendamentos`.`vidraria` (`id_vidraria`),
  CONSTRAINT `estoque_ibfk_3`
    FOREIGN KEY (`id_tecnico`)
    REFERENCES `laboratorio_agendamentos`.`tecnico` (`id_tecnico`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`materiaisselecionados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`materiaisselecionados` (
  `idmateriaisSelecionados` INT NOT NULL AUTO_INCREMENT,
  `professor_id_professor` INT NOT NULL,
  `agendamentos_id_agendamento` INT NOT NULL,
  `tipo_material` ENUM('reagente', 'vidraria') NOT NULL,
  `nome_material` VARCHAR(150) NOT NULL,
  `tipo_categoria` VARCHAR(100) NOT NULL,
  `quantidade_selecionada` DECIMAL(10,2) NOT NULL,
  `unidade` VARCHAR(45) NOT NULL,
  `capacidade` VARCHAR(40) NULL DEFAULT NULL,
  `data_selecao` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmateriaisSelecionados`),
  INDEX `fk_materiaisSelecionados_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  INDEX `fk_materiaisSelecionados_agendamentos1_idx` (`agendamentos_id_agendamento` ASC) VISIBLE,
  CONSTRAINT `fk_materiaisSelecionados_agendamentos1`
    FOREIGN KEY (`agendamentos_id_agendamento`)
    REFERENCES `laboratorio_agendamentos`.`agendamentos` (`id_agendamento`),
  CONSTRAINT `fk_materiaisSelecionados_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
