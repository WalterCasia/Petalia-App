-- ==========================================
-- BASE DE DATOS: PETALIA (RootNode Technologies)
-- ==========================================
CREATE DATABASE IF NOT EXISTS petaliadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petaliadb;


-- ==========================================
-- TABLA USUARIOS
-- ==========================================


CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- TABLA API FUENTES
-- ==========================================


CREATE TABLE api_fuentes (
    id_api INT AUTO_INCREMENT PRIMARY KEY,
    nombre_api VARCHAR(100) NOT NULL,
    url_api VARCHAR(255),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- TABLA CATÁLOGO DE PLANTAS
-- Información general obtenida de API
-- ==========================================


CREATE TABLE catalogo_plantas (
    id_catalogo INT AUTO_INCREMENT PRIMARY KEY,
    id_api INT,


    nombre_cientifico VARCHAR(150) NOT NULL,
    nombre_comun VARCHAR(150),


    descripcion TEXT,


    frecuencia_riego_dias INT,


    luz_recomendada VARCHAR(100),


    temperatura_min DECIMAL(5,2),
    temperatura_max DECIMAL(5,2),


    imagen_url VARCHAR(500),


    FOREIGN KEY (id_api)
        REFERENCES api_fuentes(id_api)
);


-- ==========================================
-- TABLA PLANTAS DEL USUARIO
-- ==========================================


CREATE TABLE plantas_usuario (
    id_planta_usuario INT AUTO_INCREMENT PRIMARY KEY,


    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,


    nombre_personalizado VARCHAR(100),


    fecha_adquisicion DATE,


    fecha_ultimo_riego DATE,


    favorita BOOLEAN DEFAULT FALSE,


    estado ENUM(
        'Activa',
        'Muerta',
        'Regalada'
    ) DEFAULT 'Activa',


    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),


    FOREIGN KEY (id_catalogo)
        REFERENCES catalogo_plantas(id_catalogo)
);


-- ==========================================
-- TABLA FOTOS DE PLANTAS
-- ==========================================


CREATE TABLE fotos_plantas (
    id_foto INT AUTO_INCREMENT PRIMARY KEY,


    id_planta_usuario INT NOT NULL,


    url_foto VARCHAR(500) NOT NULL,


    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (id_planta_usuario)
        REFERENCES plantas_usuario(id_planta_usuario)
);


-- ==========================================
-- TABLA HISTORIAL DE CUIDADOS
-- ==========================================


CREATE TABLE historial_cuidados (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,


    id_planta_usuario INT NOT NULL,


    tipo_cuidado ENUM(
        'Riego',
        'Fertilizacion',
        'Poda',
        'Trasplante'
    ) NOT NULL,


    fecha_realizada DATETIME DEFAULT CURRENT_TIMESTAMP,


    observaciones TEXT,


    FOREIGN KEY (id_planta_usuario)
        REFERENCES plantas_usuario(id_planta_usuario)
);


-- ==========================================
-- TABLA CALENDARIO DE RIEGO
-- ==========================================


CREATE TABLE calendario_riego (
    id_calendario INT AUTO_INCREMENT PRIMARY KEY,


    id_planta_usuario INT NOT NULL,


    fecha_programada DATE NOT NULL,


    completado BOOLEAN DEFAULT FALSE,


    FOREIGN KEY (id_planta_usuario)
        REFERENCES plantas_usuario(id_planta_usuario)
);


-- ==========================================
-- TABLA NOTIFICACIONES
-- ==========================================


CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,


    id_usuario INT NOT NULL,


    titulo VARCHAR(100) NOT NULL,


    mensaje TEXT,


    fecha_envio DATETIME,


    leida BOOLEAN DEFAULT FALSE,


    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);


-- ==========================================
-- TABLA FAVORITOS
-- ==========================================


CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,


    id_usuario INT NOT NULL,
    id_catalogo INT NOT NULL,


    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),


    FOREIGN KEY (id_catalogo)
        REFERENCES catalogo_plantas(id_catalogo)
);


-- ==========================================
-- TABLA IDENTIFICACIÓN DE PLANTAS
-- API DE RECONOCIMIENTO
-- ==========================================


CREATE TABLE identificaciones (
    id_identificacion INT AUTO_INCREMENT PRIMARY KEY,


    id_usuario INT NOT NULL,


    imagen_subida VARCHAR(500),


    planta_detectada VARCHAR(150),


    porcentaje_confianza DECIMAL(5,2),


    fecha_identificacion DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);


-- ==========================================
-- TABLA NOTAS PERSONALES
-- ==========================================


CREATE TABLE notas_planta (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,


    id_planta_usuario INT NOT NULL,


    nota TEXT NOT NULL,


    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (id_planta_usuario)
        REFERENCES plantas_usuario(id_planta_usuario)
);


-- ==========================================
-- DATOS INICIALES
-- ==========================================


INSERT INTO usuarios ( nombre, email, password_hash)
VALUES
( 'Juan Perez', 'juan@gmail.com', '123456'),
( 'Ana Lopez', 'ana@gmail.com', '123456');


INSERT INTO api_fuentes ( nombre_api, url_api)
VALUES
( 'Perenual API', 'https://perenual.com/api');


INSERT INTO catalogo_plantas ( id_api, nombre_cientifico, nombre_comun, descripcion, frecuencia_riego_dias, luz_recomendada, temperatura_min, temperatura_max, imagen_url)
VALUES
( 1, 'Monstera Deliciosa', 'Costilla de Adan', 'Planta tropical de interior', 7, 'Luz indirecta', 18, 30, 'imagenes/monstera.jpg' ),


( 1, 'Sansevieria Trifasciata', 'Lengua de Suegra', 'Planta resistente de bajo mantenimiento', 15, 'Luz indirecta', 15, 35, 'imagenes/sansevieria.jpg' ),


( 1, 'Epipremnum Aureum', 'Pothos', 'Planta colgante muy popular', 5, 'Luz indirecta', 18, 30, 'imagenes/pothos.jpg' ),


( 1, 'Ficus Lyrata', 'Ficus Lira', 'Planta ornamental de hojas grandes', 7, 'Luz brillante', 18, 28, 'imagenes/ficus.jpg' ),


( 1, 'Aloe Vera','Aloe Vera', 'Planta medicinal y decorativa',14, 'Sol directo',10, 35, 'imagenes/aloe.jpg' );


INSERT INTO plantas_usuario ( id_usuario, id_catalogo, nombre_personalizado,
fecha_adquisicion, fecha_ultimo_riego, favorita )
VALUES
( 1, 1, 'Beto', '2026-01-15', '2026-06-10', TRUE ),
( 1, 5, 'Medicinal', '2026-02-10', '2026-06-05', FALSE );


INSERT INTO historial_cuidados (
id_planta_usuario, tipo_cuidado, observaciones )
VALUES
( 1, 'Riego', 'Se realizo riego correctamente' ),
( 1, 'Poda', 'Se retiraron hojas secas' );


INSERT INTO fotos_plantas ( id_planta_usuario, url_foto )
VALUES
( 1, 'uploads/beto_1.jpg' );


INSERT INTO calendario_riego ( id_planta_usuario, fecha_programada )
VALUES
( 1, '2026-06-20' );


INSERT INTO notificaciones ( id_usuario, titulo, mensaje, fecha_envio )
VALUES
( 1, 'Riego pendiente', 'Hoy debes regar tu planta Beto',NOW() );


INSERT INTO favoritos ( id_usuario, id_catalogo )
VALUES
( 1, 2 );


INSERT INTO identificaciones ( id_usuario, imagen_subida, planta_detectada, porcentaje_confianza )
VALUES
( 1, 'uploads/planta_detectada.jpg', 'Monstera Deliciosa', 97.50 );


INSERT INTO notas_planta ( id_planta_usuario, nota )
VALUES
( 1, 'Mover cerca de la ventana para recibir mas luz' );


-- ==========================================
-- CONSULTAS DE PRUEBA
-- ==========================================


SELECT * FROM usuarios;
SELECT * FROM catalogo_plantas;
SELECT * FROM plantas_usuario;
SELECT * FROM historial_cuidados;
SELECT * FROM notificaciones;

