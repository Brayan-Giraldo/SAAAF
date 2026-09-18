-- Esquema MySQL del modulo Java. No se ha ejecutado contra MySQL en esta entrega.
CREATE DATABASE IF NOT EXISTS saaaf_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saaaf_db;

-- No se elimina una tabla existente. Ejecutar primero en una base de pruebas.

CREATE TABLE IF NOT EXISTS activos (
    id_activo INT AUTO_INCREMENT PRIMARY KEY,
    codigo_activo VARCHAR(30) NOT NULL UNIQUE,
    nombre_activo VARCHAR(120) NOT NULL,
    tipo_activo VARCHAR(60) NOT NULL,
    area VARCHAR(80) NOT NULL,
    responsable VARCHAR(100),
    estado ENUM('Disponible','Asignado','Mantenimiento','Baja') NOT NULL DEFAULT 'Disponible',
    fecha_registro DATE NOT NULL,
    observaciones VARCHAR(255),
    CONSTRAINT chk_codigo_activo CHECK (CHAR_LENGTH(codigo_activo) >= 3)
);

