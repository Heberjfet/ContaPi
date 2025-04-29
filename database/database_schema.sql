-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: contapaqi
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

-- Crear la nueva base de datos
CREATE DATABASE IF NOT EXISTS contapi CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- Usar la nueva base de datos
USE contapi;

-- ------------------------------------------------------
-- Estructura de la tabla `usuarios`
-- ------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,          -- Identificador único
  `nombre` VARCHAR(100) NOT NULL,            -- Nombre del usuario
  `email` VARCHAR(100) NOT NULL,             -- Email del usuario
  `password` VARCHAR(255) NOT NULL,          -- Contraseña del usuario
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `empresas`
-- ------------------------------------------------------
CREATE TABLE `empresas` (
  `id` INT NOT NULL AUTO_INCREMENT,          -- Identificador único
  `nombre` VARCHAR(100) NOT NULL,            -- Nombre de la empresa
  `rfc` VARCHAR(20) NOT NULL,                -- RFC de la empresa
  `direccion` VARCHAR(200) NOT NULL,         -- Dirección de la empresa
  `telefono` VARCHAR(20) NOT NULL,           -- Teléfono de la empresa
  `email` VARCHAR(100) NOT NULL,             -- Email de la empresa
  `usuario_id` INT DEFAULT NULL,             -- Relación con el usuario
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `empresas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `cuentas_madre`
-- ------------------------------------------------------
CREATE TABLE `cuentas_madre` (
  `id` INT NOT NULL AUTO_INCREMENT,          -- Identificador único
  `nombre` VARCHAR(100) NOT NULL,            -- Nombre de la cuenta madre
  `editable` BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si la cuenta madre es modificable (FALSE para globales)
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `subcuentas`
-- ------------------------------------------------------
CREATE TABLE `subcuentas` (
  `id` INT NOT NULL AUTO_INCREMENT,          -- Identificador único
  `nombre` VARCHAR(100) NOT NULL,            -- Nombre de la subcuenta
  `cuenta_madre_id` INT NOT NULL,            -- Relación con la cuenta madre
  `empresa_id` INT NOT NULL,                 -- Relación con la empresa
  PRIMARY KEY (`id`),
  KEY `cuenta_madre_id` (`cuenta_madre_id`),
  KEY `empresa_id` (`empresa_id`),
  CONSTRAINT `subcuentas_ibfk_1` FOREIGN KEY (`cuenta_madre_id`) REFERENCES `cuentas_madre` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subcuentas_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `transacciones`
-- ------------------------------------------------------
CREATE TABLE `transacciones` (
  `id` INT NOT NULL AUTO_INCREMENT,          -- Identificador único
  `fecha` DATE NOT NULL,                     -- Fecha de la transacción
  `descripcion` VARCHAR(255) NOT NULL,       -- Descripción de la transacción
  `monto` DECIMAL(10, 2) NOT NULL,           -- Monto de la transacción
  `empresa_id` INT NOT NULL,                 -- Relación con la empresa
  `cuenta_madre_id` INT NOT NULL,            -- Relación con la cuenta madre
  `subcuenta_id` INT DEFAULT NULL,           -- Relación con la subcuenta (opcional)
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
  PRIMARY KEY (`id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `cuenta_madre_id` (`cuenta_madre_id`),
  KEY `subcuenta_id` (`subcuenta_id`),
  CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transacciones_ibfk_2` FOREIGN KEY (`cuenta_madre_id`) REFERENCES `cuentas_madre` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transacciones_ibfk_3` FOREIGN KEY (`subcuenta_id`) REFERENCES `subcuentas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Insertar cuentas madre globales
-- ------------------------------------------------------
INSERT INTO `cuentas_madre` (`nombre`, `editable`)
VALUES
  ('Caja', FALSE),
  ('Bancos', FALSE),
  ('Clientes', FALSE),
  ('Proveedores', FALSE),
  ('Capital Social', FALSE),
  ('Ingresos', FALSE),
  ('Gastos', FALSE);
