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
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
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
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio_agendamentos`.`kits`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio_agendamentos`.`kits` (
  `id_kit` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `criado_por` INT NOT NULL,
  `tecnico_id_tecnico` INT NOT NULL,
  PRIMARY KEY (`id_kit`),
  INDEX `criado_por` (`criado_por` ASC) VISIBLE,
  INDEX `fk_kits_tecnico1_idx` (`tecnico_id_tecnico` ASC) VISIBLE,
  CONSTRAINT `kits_ibfk_1`
    FOREIGN KEY (`criado_por`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`),
  CONSTRAINT `fk_kits_tecnico1`
    FOREIGN KEY (`tecnico_id_tecnico`)
    REFERENCES `laboratorio_agendamentos`.`tecnico` (`id_tecnico`)
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
  INDEX `fk_reagente_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  INDEX `fk_reagente_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  CONSTRAINT `fk_reagente_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reagente_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 11
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
  INDEX `fk_vidraria_administrador1_idx` (`administrador_id_administrador` ASC) VISIBLE,
  INDEX `fk_vidraria_professor1_idx` (`professor_id_professor` ASC) VISIBLE,
  CONSTRAINT `fk_vidraria_administrador1`
    FOREIGN KEY (`administrador_id_administrador`)
    REFERENCES `laboratorio_agendamentos`.`administrador` (`id_administrador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vidraria_professor1`
    FOREIGN KEY (`professor_id_professor`)
    REFERENCES `laboratorio_agendamentos`.`professor` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 256
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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;




-- Inserir Vidrarias

INSERT INTO vidraria  (id_vidraria, nome_vidraria, capacidade, unidade) VALUES

(0, 'Almofariz de cerâmica', '305 mL', 4),
(0, 'Almofariz de cerâmica', '100 mL', 4),

(0, 'Alongador', '24/40 cm' , 1),

(0, 'Aparelho de Nitrogênio', NULL, 4),

(0, 'Argolas', '10 cm', 3),
(0, 'Argolas', '7 cm', 4),
('Argolas', '6 cm', 2),
('Argolas', '4 cm', 1),

(0, 'Bagueta Plástico', NULL, 3 ),
(0, 'Bagueta Vidro', NULL, 3 ), 
(0, 'Balão de três vias', '2000 mL', 2),
(0, 'Balão de três vias', '1000 mL', 2),

(0, 'Balão de fundo chato', '500 mL', 3),
(0, 'Balão de fundo chato', '250 mL', 16),

(0, 'Balão de fundo redondo', '1000 mL', 6),
(0, 'Balão de fundo redondo', '800 mL', 2),
(0, 'Balão de fundo redondo', '250 mL', 2), 
(0, 'Balão de fundo redondo', '50 mL', 1),

(0, 'Balão volumétrico', '2000 mL', 3),
(0, 'Balão volumétrico', '1000 mL', 8),
(0, 'Balão volumétrico', '500 mL', 7),
(0, 'Balão volumétrico', '250 mL', 7),
(0, 'Balão volumétrico', '200 mL', 9),
(0, 'Balão volumétrico', '100 mL', 23),
(0, 'Balão volumétrico', '50 mL', 34),
(0, 'Balão volumétrico', '25 mL', 11),
(0, 'Balão volumétrico', '20 mL', 11),
(0, 'Balão volumétrico', '10 mL', 19),

(0, 'Béquer de plástico', '2000 mL', 2),
(0, 'Béquer de plástico', '1000 mL', 5),
(0, 'Béquer de plástico', '600 mL', 6),
(0, 'Béquer de plástico', '400 mL', 6),
(0, 'Béquer de plástico', '150 mL', 1),
(0, 'Béquer de plástico', '100 mL', 6),
(0, 'Béquer de plástico', '50 mL', 5),

(0, 'Béquer de vidro', '2000 mL', 1),
(0,'Béquer de vidro', '600 mL', 5),
(0, 'Béquer de vidro', '500 mL', 2),
(0, 'Béquer de vidro', '250 mL', 1),
(0, 'Béquer de vidro', '150 mL', 0),
(0, 'Béquer de vidro', '100 mL', 8),
(0, 'Béquer de vidro', '50 mL', 8),

(0, 'Bico de Bunsen', NULL, 7),

(0, 'Bureta', '10 mL', 6),
(0, 'Bureta', '25 mL', 9),

(0, 'Cabeça de sucção', NULL, 18),

(0, 'Cadinho de porcelana', NULL, 9),
(0, 'Tampa de cadinho', NULL, 15),

(0, 'Cápsula de porcelana', '50 mL', 7),

(0, 'Cilindro', '40.5 g', 3),
(0, 'Cilindro', '46.5 g', 3),
(0, 'Cilindro', '13.9 g', 3),

(0, 'Cleverger', NULL, 2),

(0, 'Destiladora com junta 19/38 esmerilhadas e ponta gotesadora', '200 mm', 2),
(0, 'Vigreux com saida lateral e entrada para termometro', NULL, 1),
(0, 'Vigreux simples', NULL, 3),

(0, 'Bola Allihn', '200 m', 2),
(0, 'Reto Liebig', NULL, 9),
(0, 'Serpentina Grahan', NULL, 1),

(0, 'Cone Imhoff', '1000 mL', 1),

(0, 'Conectores em L', NULL, 3),

(0, 'Cubeta de Quartzo', NULL, 4),
(0, 'Cubeta de Vidro', NULL, 6),

(0, 'Elenmeyer', '1000 mL', 7),
(0, 'Elenmeyer', '500 mL', 10),
(0, 'Elenmeyer', '250 mL', 28),

(0, 'Erlenmeyer de boca esmerilhada', '1000 mL', 1),
(0, 'Erlenmeyer de boca esmerilhada', '500 mL', 6),
(0, 'Erlenmeyer de boca esmerilhada', '250 mL', 11),

(0, 'Espátula Metálica', NULL, 6),
(0, 'Espátula Plástico', NULL, 8),

(0, 'Frasco para destilação', '125 mL', 6),

(0, 'Frasco iodimétrico', '500 mL', 2),
(0, 'Frasco iodimétrico', '250 mL', 3),

(0, 'Fita de pH', '1 caixa', NULL), 

(0, 'Funil Liso', '100 mm', 8),

(0, 'Funil raiado', '100 mm', 8),
(0, 'Funil raiado', '80 mm', 5),
(0, 'Funil raiado', '55 mm', 2),

(0, 'Funil de plástico', '50 mm', 4),

(0, 'Funil de Buchner', '150 mm', 1),
(0, 'Funil de Buchner', '125 mm', 4),
(0, 'Funil de Buchner', '70 mm', 4),

(0, 'Funil de separação tipo pêra', '1000 mL', 3),
(0, 'Funil de separação tipo pêra', '500 mL', 3),
(0, 'Funil de separação tipo pêra', '250 mL', 8),
(0, 'Funil de separação tipo pêra', '125 mL', 6),

(0, 'Funil sinterizado', '500 mL', 1),
(0, 'Funil sinterizado', '50 mL', 1),
(0, 'Funil sinterizado', '30 mL', 1),

(0, 'Junta conectante 24/40 Adaptadora', NULL, 6),
(0, 'Junta conectante 24/40 Para vácuo', NULL, 2),
(0, 'Junta conectante 24/40 Paralela', NULL, 1),

(0, 'Kitasssato', '1000 mL', 9),
(0, 'Kitasssato', '500 mL', 2),
(0, 'Kitasssato', '250 mL', 2),

(0, 'Papel de Filtro Quantitativo', '12.5 cm', 90),
(0, 'Papel de Filtro Quantitativo', '9.0 cm', 80),
(0, 'Papel de Filtro Quantitativo', '12.5 cm', 200),
(0, 'Papel de Filtro Quantitativo', '11.0 cm', 90),
(0, 'Papel de Filtro Quantitativo', '11.5 cm', 90),

(0, 'Papel de Filtro Qualitativo', NULL, NULL),

(0, 'Picnômetro', '50 mL', 2),
(0, 'Picnômetro', '25 mL', 4),

(0, 'Pipeta graduada', '25 mL', 4),
(0, 'Pipeta graduada', '20 mL', 1),
(0, 'Pipeta graduada', '10 mL', 23),
(0, 'Pipeta graduada', '5 mL', 7),
(0, 'Pipeta graduada', '2 mL', 10),
(0, 'Pipeta graduada', '2 mL', 14),

(0, 'Pipeta volumétrica', '25 mL', 2),
(0, 'Pipeta volumétrica', '20 mL', 4),
(0, 'Pipeta volumétrica', '15 mL', 4),
(0, 'Pipeta volumétrica', '10 mL', 10),
(0, 'Pipeta volumétrica', '5 mL', 8),
(0, 'Pipeta volumétrica', '2 mL', 5),

(0, 'Pistilo Cerâmica', NULL, 4),
(0, 'Pistilo Madeira', NULL, 4),
(0, 'Pistilo Vidro', NULL, 4),

(0, 'Placa de Petri', '10.0 cm', 5),
(0, 'Placa de Petri', '9.2 cm', 1),
(0, 'Placa de Petri', '9.5 cm', 1),
(0, 'Placa de Petri', '6.0 cm', 10),

(0, 'Proveta graduada de plástico', '250 mL', 1),
(0, 'Proveta graduada de plástico', '100 mL', 6),
(0, 'Proveta graduada de plástico', '50 mL', 12),
(0, 'Proveta graduada de plástico', '25 mL', 10),
(0, 'Proveta graduada de plástico', '10 mL', 2),

(0, 'Proveta graduada de vidro', '1000 mL', 1),
(0, 'Proveta graduada de vidro', '500 mL', 3),
(0,'Proveta graduada de vidro', '250 mL', 7),
(0, 'Proveta graduada de vidro', '100 mL', 3),
(0, 'Proveta graduada de vidro', '50 mL', 4),
(0, 'Proveta graduada de vidro', '25 mL', 9),
(0, 'Proveta graduada de vidro', '10 mL', 10),

(0, 'Proveta graduada de vidro com rolha', '500 mL', 2),
(0, 'Proveta graduada de vidro com rolha', '250 mL', 11),

(0, 'Seringa Plástico', '20 mL', 2),
(0, 'Seringa Vidro', '20 mL', 1),

(0, 'Soxhlet Condensador', NULL, 8),
(0, 'Soxhlet Corneta', NULL, 5),

(0, 'Suporte universal', NULL, 18),
(0,'Tela de amianto', NULL, 10),

(0, 'Termômetro Digital', NULL, 4),
(0, 'Termômetro Mercúrio', NULL, 1),
(0, 'Termômetro Químico', NULL, 4),

(0, 'Triângulo de porcelana', NULL, 12),
(0, 'Tripé', NULL, 11),

(0, 'Tubo de ensaio', '14x120 mm', 59),
(0, 'Tubo de ensaio', '15x175 mm', 94),
(0, 'Tubo de ensaio', '22x295 mm', 7),
 
(0, 'Tubo de ensaio com tampa', '10x95 mm', 190),
(0, 'Tubo de ensaio com tampa', '10x145 mm', 22),
(0, 'Tubo de ensaio com tampa', '15x145 mm', 8),
(0, 'Tubo de ensaio com tampa', '15x195 mm', 14),

(0, 'Tubo de centrífuga', '15x125 mm', 11),
(0, 'Tubo de centrífuga graduado', '15 mL', 2),

(0, 'Tubo de destilação', NULL, 1),

(0, 'Tubo Falcon', '50 mL', 54),
(0, 'Tubo Falcon', '15 mL', 99),

(0, 'Tubo de ligação T', NULL, 1),
(0, 'Tubo de ligação V', NULL, 8),
(0, 'Tubo de ligação Y', NULL, 3),

(0, 'Tubo de ligação em U com saída', NULL, 3),
(0, 'Tubo de ligação em U sem saída', NULL, 1),

(0, 'Tubo Nessler', NULL, 10),

(0, 'Vidro de relógio', '4,8 cm', 1),
(0, 'Vidro de relógio', '5,0 cm', 1),
(0, 'Vidro de relógio', '8,0 cm', 3),
(0, 'Vidro de relógio', '8,8 cm', 3),
(0, 'Vidro de relógio', '11,0 cm', 7),

(0, 'Bagueta de vidro', NULL, 10),

(0, 'Papel de filtro azul', '12,5 cm', 100),
(0, 'Papel de filtro branco', '12,5 cm', 300),
(0, 'Papel de filtro cinza', '9 cm', 28),
(0, 'Papel de filtro preto', NULL, 0),

(0, 'Balão de fundo chato', '250 mL', 4),

(0, 'Balão volumétrico', '2000 mL', 1),
(0, 'Balão volumétrico', '1000 mL', 1),
(0, 'Balão volumétrico', '250 mL', 15),
(0, 'Balão volumétrico', '200 mL', 1),
(0, 'Balão volumétrico', '100 mL', 12),
(0, 'Balão volumétrico', '50 mL', 22),
(0, 'Balão volumétrico', '25 mL', 1),
(0, 'Balão volumétrico', '10 mL', 20),
(0, 'Balão volumétrico', '5 mL', 43),

(0, 'Pérola de vidro', NULL, 1),

(0, 'Picnômetro', NULL, 3),

(0, 'Pipetador tipo pêra', NULL, 8),
(0, 'Pipetador Pump de 25 mL', '25 mL', 0),

(0, 'Pipeta volumétrica', '50 mL', 4),
(0, 'Pipeta volumétrica', '25 mL', 7),
(0, 'Pipeta volumétrica', '20 mL', 3),
(0, 'Pipeta volumétrica', '10 mL', 25),
(0, 'Pipeta volumétrica', '5 mL', 12),
(0, 'Pipeta volumétrica', '2 mL', 3),

(0, 'Béquer de plástico', '2000 mL', 1),
(0, 'Béquer de plástico', '1000 mL', 1),
(0, 'Béquer de plástico', '600 mL', 2),
(0, 'Béquer de plástico', '400 mL', 1),

(0, 'Béquer de vidro', '2000 mL', 1),
(0, 'Béquer de vidro', '600 mL', 5),
(0, 'Béquer de vidro', '500 mL', 8),
(0, 'Béquer de vidro', '250 mL', 44),
(0, 'Béquer de vidro', '100 mL', 36),
(0, 'Béquer de vidro', '50 mL', 31),
(0, 'Béquer de vidro', '10 mL', 10),
(0, 'Béquer de vidro', '5 mL', 7),

(0, 'Pipeta graduada', '2 mL', 4),

(0, 'Placa de Petri', NULL, 35),

(0, 'Placa de dessecador', '14 cm', 2),
(0, 'Placa de dessecador', '18 cm', 5),
(0, 'Placa de dessecador', '23 cm', 2),

(0, 'Bico de Bunsen', NULL, 8),

(0, 'Bureta (saída lateral)', '100 mL', 1),
(0, 'Bureta', '50 mL', 1),
(0, 'Bureta', '25 mL', 0),
(0, 'Bureta', '10 mL', 0),

(0, 'ProvetaS graduadaS de plástico', '100 mL', 5),

(0, 'Proveta graduada de vidro', '1000 mL', 1),
(0, 'Proveta graduada de vidro (com tampa)', '500 mL', 2),
(0, 'Proveta graduada de vidro', '100 mL', 8),
(0, 'Proveta graduada de vidro', '50 mL', 3),
(0, 'Proveta graduada de vidro', '25 mL', 7),
(0, 'Proveta graduada de vidro', '10 mL', 9),

(0, 'Cadinho Grooch', '10 mL', 6),
(0, 'Cadinho porcelana', NULL, 9),
(0, 'Cadinho vidro com placa porosa', NULL, 4),

(0, 'Cápsula de porcelana', NULL, 4),

(0, 'Tela de amianto', NULL, 8),

(0, 'Copo graduado', '500 mL', 1),
(0, 'Copo graduado', '250 mL', 7),
(0, 'Copo graduado', '60 mL', 4),

(0, 'Tubo de cultura', '16x400 mm', 0),
(0, 'Tubo de cultura', '20x200 mm', 100),
(0, 'Tubo de cultura', '25x150 mm', 46),
(0, 'Tubo de cultura', '25x200 mm', 74),

(0, 'Erlenmeyer de boca larga', '250 mL', 10),

(0, 'Tubo Falcon', NULL, 50),

(0, 'Escova de limpeza (Grandes)', NULL, 3),

(0, 'Fita de pH', '1 caixa', 1),

(0, 'Vidro de relógio', '140 mm', 10),
(0, 'Vidro de relógio', '110 mm', 10),
(0, 'Vidro de relógio', '100 mm', 17),
(0, 'Vidro de relógio', '80 mm', 3),
(0, 'Vidro de relógio', '70 mm', 11),
(0, 'Vidro de relógio', '50 mm', 4),

(0, 'Funil de Büchner grande', NULL, 1),
(0, 'Funil de Büchner pequeno', NULL, 2),

(0, 'Frasco Saybolt', '60 mL', 4),

(0, 'Termômetro Digital', NULL, 1),
(0, 'Termômetro Químico', NULL, 5),

(0, 'Junta conectante adaptadora', '24/40', 7),

(0, 'Garra para bureta unitária', NULL, 1),
(0, 'Garra para bureta dupla', NULL, 7);




-- Inserir reagentes

INSERT INTO reagente  (id_reagente, nome_reagente, quantidade, divisao) VALUES

-- Bases
(0, 'Hidróxido de Alúminio', '80 g', '(A19) Bases'),
(0, 'Hidróxido de Amônio (26%)', '650 mL', '(A19) Bases'),
(0, 'Hidróxido de Amônio (30%)', '800 mL', '(A19) Bases'),
(0, 'Hidróxido de Amônio (30%)', '1000 mL', '(A19) Bases'),
(0, 'Hidróxido de Bário', '700 g', '(A19) Bases'),
(0, 'Hidróxido de Cálcio', '1000g', '(A19) Bases'),
(0, 'Hidróxido de Lítio', '45g', '(A19) Bases'),
(0, 'Hidróxido de Potássio', '700g', '(A19) Bases'),
(0, 'Hidróxido de Potássio', '600g', '(A19) Bases'),
(0, 'Hidróxido de Potássio', '1000g', '(A19) Bases'),
(0, 'Hidróxido de Potássio Puro', '300g', '(A19) Bases'),
(0, 'Hidróxido de Sódio (Pérolas 97%)', '400g', '(A19) Bases'),
(0, 'Hidróxido de Sódio (Pérolas 97%)', '700g', '(A19) Bases'),
(0, 'Hidróxido de Sódio (Pérolas 97%)', '800g', '(A19) Bases'),
(0, 'Hidróxido de Sódio (Micropérolas 99%)', '800g', '(A19) Bases'),
(0, 'Hidróxido de Sódio Comercial', '500g', '(A19) Bases'),
(0, 'Sulfeto de Amônio', '300mL', '(A19) Bases'),
(0, 'Sulfeto de Amônio', '1000mL', '(A19) Bases'),

-- (A20) Acidos
(0, 'Ácido Acético Glacial', '400 mL', '(A20) Ácidos'),
(0, 'Ácido Clorídrico', '500 mL', '(A20) Ácidos'),
(0, 'Ácido Clorídrico', '1000 mL', '(A20) Ácidos'),
(0, 'Ácido Clorídrico Concentrado', '100 mL', '(A20) Ácidos'),
(0, 'Ácido Fosfórico', '600 mL', '(A20) Ácidos'),
(0, 'Ácido Fosfórico', '800 mL', '(A20) Ácidos'),
(0, 'Ácido Fosfórico', '1000 mL', '(A20) Ácidos'),
(0, 'Ácido Fosfórico', '200 mL', '(A20) Ácidos'),
(0, 'Ácido Fosfórico', '450 mL', '(A20) Ácidos'),
(0, 'Ácido Nítrico', '100 mL', '(A20) Ácidos'),
(0, 'Ácido Nítrico', '100 mL', '(A20) Ácidos'),
(0, 'Ácido Nítrico', '650 mL', '(A20) Ácidos'),
(0, 'Ácido Perclórico', '700 mL', '(A20) Ácidos'),
(0, 'Ácido Rosólico', '900 mL', '(A20) Ácidos'),
(0, 'Ácido Sulfídrico', '300 mL', '(A20) Ácidos'),
(0, 'Ácido Sulfúrico', '100 mL', '(A20) Ácidos'),
(0, 'Ácido Sulfúrico Concentrado', '200 mL', '(A20) Ácidos'),
(0, 'Anidrido Acético', '2 und - 900 mL', '(A20) Ácidos'),
(0, 'Anidrido Acético', '500 mL', '(A20) Ácidos'),

-- (A5) Indicadores
(0, 'Alaranjado de Metila', '75g', '(A5) Indicadores'),
(0, 'Azul de Bromofenol', '58g', '(A5) Indicadores'),
(0, 'Azul de Bromotimol', '121g', '(A5) Indicadores'),
(0, 'Azul de Metileno', '80g', '(A5) Indicadores'),
(0, 'Azul de Timol', '40g', '(A5) Indicadores'),
(0, 'Diclorofluoresceína', '60g', '(A5) Indicadores'),
(0, 'Fenolftaleína', '300g', '(A5) Indicadores'),
(0, 'Murexida', '20g', '(A5) Indicadores'),
(0, 'Preto de Eriocromo T', '620g', '(A5) Indicadores'),
(0, 'Verde de Bromocresol', '28g', '(A5) Indicadores'),
(0, 'Vermelho de Fenol', '100g', '(A5) Indicadores'),
(0, 'Vermelho de Metila', '140g', '(A5) Indicadores'),
(0, 'Violeta de Genciana', '60g', '(A5) Indicadores'),
(0, 'Zinco Sal Sódico', '10g', '(A5) Indicadores'),

-- (A5) Produtos em Estoque
(0, 'Amido Solúvel', '500 g', '(A5) Produtos em Estoque'),
(0, 'Biftalato de Potássio', '500 g', '(A5) Produtos em Estoque'),
(0, 'Carbonato de Sódio', '400 g', '(A5) Produtos em Estoque'),
(0, 'Cloreto de Potássio', '500 g', '(A5) Produtos em Estoque'),
(0, 'Cloreto de Sódio', '700 g', '(A5) Produtos em Estoque'),
(0, 'Iodeto de Potássio', '350 g', '(A5) Produtos em Estoque'),
(0, 'Lauril Sulfato de Sódio', '200 g', '(A5) Produtos em Estoque'),
(0, 'Nitrato de Prata', '15 g', '(A5) Produtos em Estoque'),
(0, 'Sulfato de Alumínio', '500 g', '(A5) Produtos em Estoque'),
(0, 'Tiossulfato de Sódio', '400 g', '(A5) Produtos em Estoque'),

-- (A6) Alcools e Cetonas
(0, 'Acetato de Amônio', '1000mL', '(A6) Álcoois e Cetonas'),
(0, 'Acetato de n-Butila', '500mL', '(A6) Álcoois e Cetonas'),
(0, 'Acetona', '650mL', '(A6) Álcoois e Cetonas'),
(0, 'Acetona', '3und - 1L', '(A6) Álcoois e Cetonas'),
(0, 'Álcool de Cereais', '700mL', '(A6) Álcoois e Cetonas'),
(0, 'Álcool Etílico 96', '850mL', '(A6) Álcoois e Cetonas'),
(0, 'Álcool Isopropílico', '750mL', '(A6) Álcoois e Cetonas'),
(0, 'Álcool Isopropílico', '3und - 1L', '(A6) Álcoois e Cetonas'),
(0, 'Álcool Metílico', '3000mL', '(A6) Álcoois e Cetonas'),
(0, 'Benzina de Petróleo', '200mL', '(A6) Álcoois e Cetonas'),
(0, 'Cloreto de Lítio', '500mL', '(A6) Álcoois e Cetonas'),
(0, 'Cloreto de Magnésio', '1000mL', '(A6) Álcoois e Cetonas'),
(0, 'Cloreto de Magnésio P.A', '400g', '(A6) Álcoois e Cetonas'),
(0, 'Clorofórmio Recuperado', '300mL', '(A6) Álcoois e Cetonas'),
(0, 'Dimetilsulfóxido', '200mL', '(A6) Álcoois e Cetonas'),
(0, 'Dimetilsulfóxido', '400mL', '(A6) Álcoois e Cetonas'),
(0, 'Dimetilsulfóxido', '550mL', '(A6) Álcoois e Cetonas'),
(0, 'Éter de Petróleo', '1000mL', '(A6) Álcoois e Cetonas'),
(0, 'Éter Etílico', '900mL', '(A6) Álcoois e Cetonas'),
(0, 'Formaldeído', '2 und - 500mL', '(A6) Álcoois e Cetonas'),
(0, 'Formaldeído', '700mL', '(A6) Álcoois e Cetonas'),
(0, 'Hexano (ACS)', '300mL', '(A6) Álcoois e Cetonas'),
(0, 'Hexano (NOX)', '700mL', '(A6) Álcoois e Cetonas'),
(0, 'Hexano (Synth)', '600mL', '(A6) Álcoois e Cetonas'),
(0, 'Hexano (Synth)', '2 und - 1L', '(A6) Álcoois e Cetonas'),
(0, 'Hexano Diluído em Água', '100mL', '(A6) Álcoois e Cetonas'),
(0, 'Iodo Cloro', '950mL', '(A6) Álcoois e Cetonas'),
(0, 'Iodo Cloro', '450mL', '(A6) Álcoois e Cetonas'),
(0, 'Nitrato de Lítio', '650mL', '(A6) Álcoois e Cetonas'),
(0, 'Peróxido de Hidrogênio', '1000mL', '(A6) Álcoois e Cetonas'),
(0, 'Sulfato de Amônio', '600mL', '(A6) Álcoois e Cetonas'),
(0, 'Sulfato de Magnésio', '400mL', '(A6) Álcoois e Cetonas'),
(0, 'Tiocianato de Amônio', '5000mL', '(A6) Álcoois e Cetonas'),
(0, 'Tiocianato de Potássio', '900mL', '(A6) Álcoois e Cetonas'), 

-- I - Ácidos organicos
(0, 'Ácido Benzóico', '800 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Bórico', '500 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Cítrico', '400 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Cloroacético', '217 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Glacial Cristais', '60 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido L-Ascórbico', '90 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Oléico', '900 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Oxálico Desidratado', '215 g', 'I - Ácidos Orgânicos'),
(0, 'Ácido Salicílico', '125 g', 'I - Ácidos Orgânicos'),

-- II- Sais organicos
(0, '1,10 Fenantrolina monohidratada', '29g', 'II - Sais Orgânicos'),
(0, '1,10 Phenanthrolinium', '45g', 'II - Sais Orgânicos'),
(0, '2-Naftol', '20g', 'II - Sais Orgânicos'),
(0, 'Aluminon', '23g', 'II - Sais Orgânicos'),
(0, 'Benzoato de Sódio', '500g', 'II - Sais Orgânicos'),
(0, 'Carboximetilcelulose 1', '400g', 'II - Sais Orgânicos'),
(0, 'Carboximetilcelulose 2', '500g', 'II - Sais Orgânicos'),
(0, 'Cloridrato de Hidroxilamina', '8g', 'II - Sais Orgânicos'),
(0, 'Fenantrolina', '10g', 'II - Sais Orgânicos'),
(0, 'Fenantrolina 1,10 orto', '38g', 'II - Sais Orgânicos'),
(0, 'Ninidrina', '40g', 'II - Sais Orgânicos'),
(0, 'Orto tolidina', '18g', 'II - Sais Orgânicos'),
(0, 'O-tolidina', '40g', 'II - Sais Orgânicos'),
(0, 'Resorcin', '77g', 'II - Sais Orgânicos'),
(0, 'Tioacetamida', '35g', 'II - Sais Orgânicos');

-- III - Sais organicos/elementos
(0, 'EDTA Dissódico', '700 g', 'III - Sais Orgânicos / Elementos'),
(0, 'Enxofre Puro', '230 g', 'III - Sais Orgânicos / Elementos'),
(0, 'Goma Arábica', '500 g', 'III - Sais Orgânicos / Elementos'),

-- IV - Utilitarios
(0, 'Celite 545', '120 g', 'IV - Utilitários'),
(0, 'Powder Estabilizado', '200 g', 'IV - Utilitários'),
(0, 'Sílica Gel', '190 g', 'IV - Utilitários'),
(0, 'Sílica Gel (60-100)', '100 g', 'IV - Utilitários'),
(0, 'Sílica Gel Azul', '90 g', 'IV - Utilitários'),

-- IX - Elementos Metálicos
(0, 'Alumínio em Pó', '360 g', 'IX - Elementos Metálicos'),
(0, 'Amostra 11A', '90 g', 'IX - Elementos Metálicos'),
(0, 'Amostra 12A', '70 g', 'IX - Elementos Metálicos'),
(0, 'Amostra 17A', '91 g', 'IX - Elementos Metálicos'),
(0, 'Estanho', '10 g', 'IX - Elementos Metálicos'),
(0, 'Estanho Granulado', '900 g', 'IX - Elementos Metálicos'),
(0, 'Estanho Granulado 20 mesh', '100 g', 'IX - Elementos Metálicos'),
(0, 'Fios de Cobre', '60 g', 'IX - Elementos Metálicos'),
(0, 'Lascas de Cobre', '65 g', 'IX - Elementos Metálicos'),
(0, 'Raspas de Alumínio', '35 g', 'IX - Elementos Metálicos'),
(0, 'Raspas de Estanho', '215 g', 'IX - Elementos Metálicos'),
(0, 'Raspas de Estanho Maleável', '73 g', 'IX - Elementos Metálicos'),

-- V - Sais de Amonio 
(0, 'Amônio Oxalato', '450g', 'V - Sais de Amônio'),
(0, 'Fosfato de Amônio Dibásico', '150g', 'V - Sais de Amônio'),
(0, 'Sulfato de Amônio', '380g', 'V - Sais de Amônio'),
(0, 'Tiocianato de Amônio', '400g', 'V - Sais de Amônio'), 

-- VI - Sais de Amônio
(0, 'Acetato de Amônio', '35g', 'VI - Sais de Amônio'),
(0, 'Acetato de Amônio Cristais', '400g', 'VI - Sais de Amônio'),
(0, 'Acetato de Amônio Cristais', '390g', 'VI - Sais de Amônio'),
(0, 'Carbonato de Amônio', '296g', 'VI - Sais de Amônio'),

-- VII - Sais de Amônio
(0, 'Cloreto de Amônio', '420g', 'VII - Sais de Amônio'),
(0, 'Molibdato de Amônio', '190g', 'VII - Sais de Amônio'),

-- petroleos/catalisador
(0, 'Coque', '120 g', 'VIII - Petróleos / Catalisador'),
(0, 'Molibdênio', '130 g', 'VIII - Petróleos / Catalisador'),
(0, 'Negro de Fumo', '10 g', 'VIII - Petróleos / Catalisador'),
(0, 'Petróleo', '130 g', 'VIII - Petróleos / Catalisador'),
(0, 'Petróleo', '100 g', 'VIII - Petróleos / Catalisador'), 

-- elementos metalicos 
(0, 'Cobre em Pó', '90 g', 'X - Elementos Metálicos'),
(0, 'Ferro P.A', '500 g', 'X - Elementos Metálicos'),
(0, 'Prata', '40 g', 'X - Elementos Metálicos'),
(0, 'Raspas de Magnésio', '20 g', 'X - Elementos Metálicos'),
(0, 'Raspas de Magnésio', '40 g', 'X - Elementos Metálicos'),
(0, 'Zinco em Pó', '500 g', 'X - Elementos Metálicos'),
(0, 'Zinco em Pó P.A', '100 g', 'X - Elementos Metálicos'),
(0, 'Zinco Metálico em Pó', '200 g', 'X - Elementos Metálicos'),
(0, 'Zinco P.A', '100 g', 'X - Elementos Metálicos'), 

-- XI - material organico
(0, 'Glicerina Comercial', '1170 mL', 'XI - Material Orgânico'),
(0, 'Glicerina P.A', '500 mL', 'XI - Material Orgânico'),
(0, 'Glicerina P.A USP', '1200 mL', 'XI - Material Orgânico'),

-- XII - material organico 
(0, 'Dextrose Anidra', '450 g', 'XII - Material Orgânico'),
(0, 'D-Frutose', '35 g', 'XII - Material Orgânico'),
(0, 'D-Frutose', '70 g', 'XII - Material Orgânico'),
(0, 'Glicose Anidra', '300 g', 'XII - Material Orgânico'),
(0, 'Glicose Anidra', '400 g', 'XII - Material Orgânico'),
(0, 'Sacarose', '380 g', 'XII - Material Orgânico'),

-- XIII - material organico
(0, 'Amido Solúvel', '130 g', 'XIII - Material Orgânico'),
(0, 'Amido Solúvel', '40 g', 'XIII - Material Orgânico'),
(0, 'D(+) Maltose', '100 g', 'XIII - Material Orgânico'),
(0, 'Manitol', '25 g', 'XIII - Material Orgânico'),

-- XIV - Sais de Litio / Potassio 
(0, 'Bromato de Potássio', '200g', 'XIV - Sais de Lítio / Potássio'),
(0, 'Brometo de Potássio', '110g', 'XIV - Sais de Lítio / Potássio'),
(0, 'Cloreto de Lítio', '80g', 'XIV - Sais de Lítio / Potássio'),

-- XIX - Sais de Bario de Aluminio
(0, 'Cloreto de Alumínio', '800g', 'XIX - Sais de Bário de Alumínio'),
(0, 'Cloreto de Bário', '600g', 'XIX - Sais de Bário de Alumínio'),
(0, 'Óxido de Alumínio', '150g', 'XIX - Sais de Bário de Alumínio'),
(0, 'Sulfato de Alumínio', '160g', 'XIX - Sais de Bário de Alumínio'),

-- XV - Sais de potassio 
(0, 'Biftalato de Potássio', '70g', 'XV - Sais de Potássio'),
(0, 'Carbonato de Potássio', '900g', 'XV - Sais de Potássio'),

-- XVI - Sais de potassio 
(0, 'Alúmen de Potássio', '200g', 'XVI - Sais de Potássio'),
(0, 'Alúmen de Potássio', '280g', 'XVI - Sais de Potássio'),
(0, 'Cromato de Potássio', '280g', 'XVI - Sais de Potássio'),
(0, 'Cromato de Potássio', '400g', 'XVI - Sais de Potássio'),
(0, 'Dicromato de Potássio', '210g', 'XVI - Sais de Potássio'),
(0, 'Dicromato de Potássio', '800g', 'XVI - Sais de Potássio'),
(0, 'Ferricianeto de Potássio', '200g', 'XVI - Sais de Potássio'),
(0, 'Ferricianeto de Potássio', '500g', 'XVI - Sais de Potássio'),
(0, 'Ferrocianeto de Potássio', '100g', 'XVI - Sais de Potássio'),

-- XVII - Sais de Potássio
(0, 'Fosfato de Potássio Bibásico', '360g', 'XVII - Sais de Potássio'),
(0, 'Fosfato de Potássio Monobásico', '400g', 'XVII - Sais de Potássio'),
(0, 'Fosfato de Sódio', '400g', 'XVII - Sais de Potássio'),
(0, 'Iodato de Potássio', '170g', 'XVII - Sais de Potássio'),
(0, 'Nitrato de Potássio', '50g', 'XVII - Sais de Potássio'),

-- XVIII - Sais de Potássio
(0, 'Permanganato de Potássio', '500g', 'XVIII - Sais de Potássio'),
(0, 'Permanganato de Potássio', '162g', 'XVIII - Sais de Potássio'),
(0, 'Sulfato de Potássio', '800g', 'XVIII - Sais de Potássio'),
(0, 'Tartarato de Antimônio e Potássio', '70g', 'XVIII - Sais de Potássio'),
(0, 'Tiocianato de Potássio', '346g', 'XVIII - Sais de Potássio'),

-- XX - Sais de Cálcio
(0, 'Acetato de Cálcio', '360 g', 'XX - Sais de Cálcio'),
(0, 'Carbonato de Cálcio', '400 g', 'XX - Sais de Cálcio'),
(0, 'Carbonato de Cálcio', '500 g', 'XX - Sais de Cálcio'),
(0, 'Cloreto de Cálcio', '500 g', 'XX - Sais de Cálcio'),
(0, 'Cloreto de Cálcio Anidro', '32 g', 'XX - Sais de Cálcio'),
(0, 'Óxido de Cálcio', '110 g', 'XX - Sais de Cálcio'),

-- sais de zinco 
(0, 'Acetato de Zinco', '400 g', 'XXI - Sais de Zinco'),
(0, 'Cloreto de Cromo III', '124 g', 'XXI - Sais de Zinco'),
(0, 'Óxido de Cromo', '106 g', 'XXI - Sais de Zinco'),
(0, 'Sulfato de Zinco', '313 g', 'XXI - Sais de Zinco'),

-- sais de ferro 
(0, 'Ferro Sulfeto em Bastões', '900 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato de Ferro II e Amônio', '230 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato de Ferro III', '260 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato de Ferro III e Amônio', '200 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato Ferroso', '70 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato Ferroso', '10 g', 'XXII - Sais de Ferro'),
(0, 'Sulfato Ferroso (Anidrol)', '420 g', 'XXII - Sais de Ferro'),

-- sais de ferro
(0, 'Cloreto de Ferro III', '260 g', 'XXIII - Sais de Ferro'),
(0, 'Cloreto Férrico Anidro', '200 g', 'XXIII - Sais de Ferro'),
(0, 'Cloreto Férrico Anidro', '40 g', 'XXIII - Sais de Ferro'),
(0, 'Cloreto Férrico Anidro', '35 g', 'XXIII - Sais de Ferro'),
(0, 'Sulfato de Ferro', '255 g', 'XXIII - Sais de Ferro'),

-- sais diversos
(0, 'Cadmiumacetat', '56 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Cobalto (oso)', '32 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Cobalto II', '200 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Cromo', '6 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Cromo III (rec)', '26 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Estanho', '500 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Estrôncio', '30 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Manganês', '400 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Mercúrio', '45 g', 'XXIV - Sais Diversos'),
(0, 'Cloreto de Níquel (oso)', '155 g', 'XXIV - Sais Diversos'),
(0, 'Nitrato de Bismuto', '130 g', 'XXIV - Sais Diversos'),
(0, 'Nitrato de Chumbo II', '400 g', 'XXIV - Sais Diversos'),
(0, 'Nitrato de Estrôncio', '25 g', 'XXIV - Sais Diversos'),
(0, 'Nitrato de Sódio e Cobalto III', '30 g', 'XXIV - Sais Diversos'),
(0, 'Sulfato de Cobre (pedras)', '300 g', 'XXIV - Sais Diversos'),
(0, 'Sulfato de Cobre II', '270 g', 'XXIV - Sais Diversos'),
(0, 'Sulfato de Prata', '200 g', 'XXIV - Sais Diversos'),

-- XXIX - Sais de Magnésio
(0, 'Carbonato de Magnésio', '300 g', 'XXIX - Sais de Magnésio'),
(0, 'Nitrato de Magnésio', '400 g', 'XXIX - Sais de Magnésio'),
(0, 'Óxido de Magnésio', '300 g', 'XXIX - Sais de Magnésio'),
(0, 'Sulfato de Magnésio', '500 g', 'XXIX - Sais de Magnésio'),

-- XXV - Sais de Sódio
(0, 'Acetato de Sódio Cristal', '280 g', 'XXV - Sais de Sódio'),
(0, 'Bicarbonato de Sódio', '200 g', 'XXV - Sais de Sódio'),
(0, 'Borato de Sódio', '67 g', 'XXV - Sais de Sódio'),
(0, 'Brometo de Sódio', '350 g', 'XXV - Sais de Sódio'),
(0, 'Carbonato de Sódio', '370 g', 'XXV - Sais de Sódio'),
(0, 'Citrato de Sódio', '365 g', 'XXV - Sais de Sódio'),
(0, 'Cloreto de Sódio', '20 g', 'XXV - Sais de Sódio'),
(0, 'Cloreto de Sódio', '20 g', 'XXV - Sais de Sódio'),
(0, 'Cloreto de Sódio', '40 g', 'XXV - Sais de Sódio'),
(0, 'Cloreto de Sódio Industrial', '165 g', 'XXV - Sais de Sódio'),

-- XXVI - Sais de Sódio
(0, 'Fosfato de Sódio', '390 g', 'XXVI - Sais de Sódio'),
(0, 'Nitrato de Sódio', '450 g', 'XXVI - Sais de Sódio'),
(0, 'Nitrito de Sódio', '500 g', 'XXVI - Sais de Sódio'),
(0, 'Nitrito de Sódio USP', '437 g', 'XXVI - Sais de Sódio'),
(0, 'Oxalato de Sódio', '200 g', 'XXVI - Sais de Sódio')

-- XXVII - Sais de Sódio
(0, 'Sulfato de Sódio', '70g', 'XXVII - Sais de Sódio'),
(0, 'Sulfito de Sódio Anidro', '1000g', 'XXVII - Sais de Sódio'),
(0, 'Sulfato de Sódio Anidro Cristais', '800g', 'XXVII - Sais de Sódio'),

-- XXVIII - Sais de Sódio
(0, 'Tartarato de Sódio e Potássio', '100g', 'XXVIII - Sais de Sódio');






