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
  ('Activo' , FALSE), 
('Pagos anticipados',FALSE), 
('Impuestos a favor',FALSE), 
('Inventario',FALSE), 
('Impuestos acreditables',FALSE), 
('Impuestos acreditables por pagar',FALSE), 
('Anticipo a proveedores',FALSE), 
('Mobiliario',FALSE), 
('Equipo de computo',FALSE),
('Pasivo', FALSE), 
('Cuentas por pagar',FALSE),  
('Cobros anticipados',FALSE), 
('Anticipo de cliente',FALSE), 
('Impuestos trasladados',FALSE), 
('Devoluciones',FALSE), 
('Descuentos',FALSE), 
('Gastos de ventas',FALSE), 
('Gastos generales',FALSE), 
('Costos de venta',FALSE); 


ALTER TABLE subcuentas ADD COLUMN editable BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE subcuentas ALTER cuenta_madre_id SET DEFAULT 1;

INSERT INTO `subcuentas` (`nombre`, `editable`, `cuenta_madre_id`, `empresa_id`)
VALUES
  ('Caja y efectivo' , FALSE, 1, 1),
  ('Bancos nacionales', FALSE, 1, 1),
  ('IVA ', FALSE, 1, 1),
  ('ISR', FALSE, 1, 1),
  ('Materia prima', FALSE, 1, 1),
  ('IVA acreditable', FALSE, 1, 1),
  ('IVA pendiente por pagar', FALSE, 1, 1),
  ('Anticipo de proveedores', FALSE, 1, 1),
  ('Proveedores nacionales', FALSE, 1, 1),
  ('Proveedores internacionales', FALSE, 1, 1),
  ('Cuentas por pagar a corto plazo', FALSE, 1, 1),
  ('Anticipo de clientes', FALSE, 1, 1),
  ('IVA trasladado', FALSE, 1, 1),
  ('ISR diferido', FALSE, 1, 1),
  ('Capital fijo', FALSE, 1, 1),
  ('Capital variable', FALSE, 1, 1),
  ('Devoluciones, descuento o bonificacion', FALSE, 1, 1),
  ('Costo de venta', FALSE, 1, 1),
  ('Tiempos extras', FALSE, 1, 1),
  ('PTU', FALSE, 1, 1),
  ('Papeleria y equipo de oficina', FALSE, 1, 1),
  ('Limpieza', FALSE, 1, 1),
  ('Mano de obra', FALSE, 1, 1),
  ('Regalias', FALSE, 1, 1),
  ('Utilidades', FALSE, 1, 1),
  ('Perdida de venta', FALSE, 1, 1),
  ('Ganancia de venta', FALSE, 1, 1),
  ('Sueldos y salarios', FALSE, 1, 1);

  CREATE TABLE descarga_masiva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folio_fiscal VARCHAR(20) NOT NULL,
    rfc VARCHAR(20) NOT NULL,
    nombre_razon_social VARCHAR(255) NOT NULL
);

INSERT INTO descarga_masiva (folio_fiscal, rfc, nombre_razon_social) VALUES
('3A2F1G9H0J2K4L6M7N8P', 'GOML850101HDFRLL01', 'Gómez López S.A. de C.V.'),
('8B9N2M3C4X5Z6A7S8D9F', 'FERC920205HGTNLR09', 'Ferretería del Centro'),
('5V6B7N8M9J0K1L2P3Q4R', 'RACL890312MCHTRR05', 'Ramos y Cía S. de R.L.'),
('9L8K7J6H5G4F3D2S1A0Q', 'JUAR810428MGTRMN03', 'Juaréz Hermanos Constructores'),
('2Q3W4E5R6T7Y8U9I0O1P', 'LOMO760921HGTRFS07', 'Logística Moderna'),
('4P3O2I1U9Y8T7R6E5W4', 'MARA990101MDFPLN04', 'Marketing Rápido S.A.'),
('1X2C3V4B5N6M7Z8A9S0', 'TOVE940515HCSNTR02', 'Tortillas El Buen Sabor'),
('9Q8W7E6R5T4Y3U2I1O0', 'BECR910718HDFTNP06', 'Bebidas y Cremas del Sur'),
('3M2N1B0V9C8X7Z6A5S4', 'GARC870904MPLRFS08', 'Garcia & Asociados'),
('0P9O8I7U6Y5T4R3E2W1', 'INTE920623HGTLLL05', 'Integrales y Servicios'),
('5L6K7J8H9G0F1D2S3A4', 'SALO901001HDFNXT03', 'Salón Estilo Total'),
('2Q1W3E4R5T6Y7U8I9O0', 'CAME951102MCHNRD07', 'Camiones del Noroeste'),
('4Z5X6C7V8B9N0M1L2K3', 'MURA870305MGTLFN06', 'Muebles Rápidos S.A.'),
('7P6O5I4U3Y2T1R9E8W7', 'ROGR780721HDFNRN01', 'Rogelio Granados y Cía.'),
('6Y7U8I9O0P1A2S3D4F5', 'PESA860104MPLMZL09', 'Pesca Segura del Golfo'),
('3C4X5Z6A7S8D9F0G1H2', 'ALVE931010HCSGRR02', 'Alimentos Veracruz S.A.'),
('9B0N1M2J3K4L5P6Q7R8', 'JOMA950712MGTNSP03', 'Joyería María'),
('1D2F3G4H5J6K7L8M9N0', 'RENE800623HGTLNT06', 'Renta y Equipo del Norte'),
('2A3S4D5F6G7H8J9K0L1', 'SOMA850914HDFRLM02', 'Soluciones en Madera'),
('0O9I8U7Y6T5R4E3W2Q1', 'VIDE780101MGTLDR08', 'Vidriería del Este');