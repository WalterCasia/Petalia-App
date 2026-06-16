-- Ruta: database/seed.sql
USE petalia_db;

INSERT IGNORE INTO plants (id, name, scientific_name, watering_frequency_days, description, image_url) VALUES
(1, 'Monstera Deliciosa', 'Monstera deliciosa', 7, 'Popular planta de interior conocida por sus hojas grandes con cortes característicos. Prefiere luz indirecta y riego moderado.', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'),
(2, 'Calathea Orbifolia', 'Calathea orbifolia', 5, 'Planta exótica con hojas redondas y rayas plateadas. Requiere alta humedad y riego constante para mantener el suelo húmedo pero no encharcado.', 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'),
(3, 'Sansevieria Trifasciata', 'Sansevieria trifasciata', 14, 'También conocida como lengua de suegra, es una planta extremadamente resistente que purifica el aire. Tolerante a la sequía y de bajo mantenimiento.', 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600');
