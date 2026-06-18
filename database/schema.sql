-- Ruta: database/schema.sql

-- ==========================================
-- TABLA plantas_usuario (Colección Personal)
-- ==========================================

CREATE TABLE plantas_usuario (
    id_planta_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,
    nombre_personalizado VARCHAR(100),
    fecha_adquisicion DATE,
    fecha_ultimo_riego DATE,
    favorita BOOLEAN DEFAULT FALSE,
    estado ENUM('Activa','Muerta','Regalada' ) DEFAULT 'Activa',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_catalogo) REFERENCES catalogo_plantas(id_catalogo)
);


-- ==========================================
-- TABLA favoritos (Favoritos)
-- ==========================================

CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_catalogo) REFERENCES catalogo_plantas(id_catalogo)
);
CREATE DATABASE IF NOT EXISTS petalia_db;
USE petalia_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150) NOT NULL UNIQUE,
  watering_frequency_days INT NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
