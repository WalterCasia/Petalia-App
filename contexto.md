<context>
    Desarrollar desde cero la plataforma web "Petalia", un sistema diseñado para que entusiastas de las plantas exóticas registren colecciones personales, automaticen el cálculo de tiempos de riego, guarden favoritos, registren logs históricos de cumplimiento mediante un botón de "Check" y monitoreen estados de alerta en tiempo real.
    El backend se construirá con Node.js, Express y la librería asíncrona mysql2/promise, conectándose a una base de datos relacional MySQL. La seguridad de acceso e inyección de sesiones se manejará obligatoriamente mediante JSON Web Tokens (JWT) y el cifrado de contraseñas con bcryptjs. 
    En esta sesión, asumirás el rol del Desarrollador 1 (Dev Ops, Auth & Base Data). Tu responsabilidad es construir los cimientos del backend, la base de datos y la API de solo lectura del catálogo general.
</context>

<tasks>
    1. Inicialización y Configuración Global: 
       - Crear el `package.json` con las dependencias necesarias (express, mysql2, bcryptjs, jsonwebtoken, dotenv, cors).
       - Crear el archivo `.env` de ejemplo y `.gitignore`.
       - Configurar el punto de entrada `server.js` y la aplicación Express en `app.js` con CORS, parseo de JSON y un `errorMiddleware.js` global.
    2. Configuración de Base de Datos:
       - Diseñar el `database/schema.sql` creando las tablas base para `Users` y `Plants` (Catálogo General).
       - Crear el archivo `database/seed.sql` con al menos 3 plantas exóticas de prueba (ej. Monstera Deliciosa, Calathea Orbifolia).
       - Configurar el pool de conexiones asíncronas en `src/config/db.js`.
    3. Módulo de Autenticación (Auth):
       - Crear el modelo `src/models/User.js` con métodos para buscar por email e insertar nuevos usuarios.
       - Implementar `src/controllers/authController.js` para registrar (hasheando contraseñas) y loguear (generando JWT).
       - Definir `src/routes/authRoutes.js` y el middleware de protección de rutas `src/middlewares/authMiddleware.js`.
    4. Módulo del Catálogo General (Plantas):
       - Crear el modelo `src/models/Plant.js` para realizar consultas de solo lectura (`SELECT`) al catálogo.
       - Implementar `src/controllers/plantController.js` para listar todas las plantas y buscar por ID.
       - Definir `src/routes/plantRoutes.js`.
</tasks>

<constraints>
    1. Límites Estrictos de Código: TIENES PROHIBIDO generar código o crear archivos asignados a P2, P3 o P4 (ej. userPlantController, dashboardRoutes, o public/index.html). Debes enfocarte SOLO en los archivos etiquetados como (P1) en el árbol de directorios.
    2. Base de Datos Asíncrona: No uses callbacks. Debes usar obligatoriamente `mysql2/promise` y constructos `async/await`.
    3. Seguridad SQL: Todas las consultas a la base de datos en los modelos (`User.js`, `Plant.js`) deben usar "Prepared Statements" (consultas parametrizadas con `?`) para evitar inyección SQL.
    4. Seguridad de Contraseñas: Las contraseñas en texto plano jamás deben tocar la base de datos. Usa `bcryptjs` en `authController.js` antes de instanciar el modelo.
    5. Arquitectura Limpia: Los controladores NO deben tener consultas SQL crudas. Toda consulta SQL debe estar encapsulada en métodos dentro de los archivos de la carpeta `models/`.
    6. Manejo de Errores: Todos los controladores deben usar bloques `try...catch` y pasar los errores al `errorMiddleware.js` usando la función `next(error)`.
</constraints>

<output_format>
    Genera el código para el Desarrollador 1 entregando cada archivo (P1) en un bloque de código separado.
    En la primera línea de cada bloque de código, debes indicar la ruta exacta del archivo comentada.
    Ejemplo de formato requerido:

    ```javascript
    // Ruta: src/config/db.js
    const mysql = require('mysql2/promise');
    // ... resto del código
    ```

    ```sql
    -- Ruta: database/schema.sql
    CREATE DATABASE IF NOT EXISTS petalia_db;
    -- ... resto del código
    ```

    Proporciona un código limpio, comentado y listo para ser copiado, pegado y ejecutado por el equipo.
</output_format>