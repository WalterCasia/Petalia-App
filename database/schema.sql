-- Ruta: database/schema.sql
CREATE DATABASE IF NOT EXISTS petalia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petalia_db;

-- ==========================================
-- TABLA usuarios
-- ==========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA catalogo_plantas
-- ==========================================
CREATE TABLE IF NOT EXISTS catalogo_plantas (
    id_catalogo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cientifico VARCHAR(150) NOT NULL UNIQUE,
    nombre_comun VARCHAR(150),
    descripcion TEXT,
    frecuencia_riego_dias INT,
    luz_recomendada VARCHAR(100),
    temperatura_min DECIMAL(5,2),
    temperatura_max DECIMAL(5,2),
    imagen_url VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA plantas_usuario
-- ==========================================
CREATE TABLE IF NOT EXISTS plantas_usuario (
    id_planta_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,
    nombre_personalizado VARCHAR(100),
    fecha_adquisicion DATE,
    fecha_ultimo_riego DATE,
    fecha_ultimo_abono DATE,
    favorita BOOLEAN DEFAULT FALSE,
    estado ENUM('Activa', 'Muerta', 'Regalada') DEFAULT 'Activa',
    imagen_url VARCHAR(500),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_catalogo) REFERENCES catalogo_plantas(id_catalogo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA favoritos
-- ==========================================
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_catalogo) REFERENCES catalogo_plantas(id_catalogo) ON DELETE CASCADE,
    UNIQUE KEY (id_usuario, id_catalogo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA historial_cuidados
-- ==========================================
CREATE TABLE IF NOT EXISTS historial_cuidados (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_planta_usuario INT NOT NULL,
    tipo_cuidado ENUM('Riego', 'Fertilizacion', 'Poda', 'Trasplante') NOT NULL,
    fecha_realizada DATETIME DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_planta_usuario) REFERENCES plantas_usuario(id_planta_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA calendario_riego
-- ==========================================
CREATE TABLE IF NOT EXISTS calendario_riego (
    id_calendario INT AUTO_INCREMENT PRIMARY KEY,
    id_planta_usuario INT NOT NULL,
    fecha_programada DATE NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_planta_usuario) REFERENCES plantas_usuario(id_planta_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- TABLA notificaciones
-- ==========================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- DATOS SEMILLA (CATÁLOGO GENERAL)
-- ==========================================
INSERT IGNORE INTO catalogo_plantas (id_catalogo, nombre_cientifico, nombre_comun, descripcion, frecuencia_riego_dias, luz_recomendada, temperatura_min, temperatura_max, imagen_url)
VALUES
(1, 'Monstera Deliciosa', 'Costilla de Adán', 'Planta tropical de interior', 7, 'Luz indirecta', 18, 30, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'),
(2, 'Sansevieria Trifasciata', 'Lengua de Suegra', 'Planta resistente de bajo mantenimiento', 15, 'Luz indirecta', 15, 35, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'),
(3, 'Epipremnum Aureum', 'Pothos', 'Planta colgante muy popular', 5, 'Luz indirecta', 18, 30, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'),
(4, 'Ficus Lyrata', 'Ficus Lira', 'Planta ornamental de hojas grandes', 7, 'Luz brillante', 18, 28, 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'),
(5, 'Aloe Vera', 'Aloe Vera', 'Planta medicinal y decorativa', 14, 'Sol directo', 10, 35, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600');
