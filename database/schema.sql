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