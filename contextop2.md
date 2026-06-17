<context>
    Desarrollar la segunda fase de la plataforma web "Petalia", un sistema diseñado para que entusiastas de las plantas exóticas registren colecciones personales, automaticen el cálculo de tiempos de riego, guarden favoritos, registren logs históricos de cumplimiento mediante un botón de "Check" y monitoreen estados de alerta en tiempo real.

    ```
    El backend se encuentra construido con Node.js, Express y la librería asíncrona mysql2/promise, conectándose a una base de datos relacional MySQL. La autenticación mediante JSON Web Tokens (JWT), el cifrado de contraseñas con bcryptjs, la configuración global del servidor y el catálogo general de plantas ya fueron desarrollados previamente por el equipo encargado de P1.

    En esta sesión, asumirás el rol del Desarrollador 2 (Personal Collection & favoritos). Tu responsabilidad es implementar la gestión de la colección personal de plantas de cada usuario y el sistema de favoritos, asegurando que todas las operaciones estén protegidas mediante JWT, respeten la arquitectura existente y mantengan una correcta separación entre rutas, controladores y modelos.
    ```
</context>

<tasks>
    1. Extensión de la Base de Datos:
       - Ampliar el archivo `database/schema.sql` agregando las tablas relacionales necesarias para la colección personal de plantas y el sistema de favoritos.
       - Crear la tabla `plantas_usuario` para almacenar las plantas registradas por cada usuario.
       - Crear la tabla `favoritos` para gestionar las plantas favoritas de los usuarios.
       - Definir correctamente claves primarias, foráneas, restricciones de integridad y reglas de eliminación.

```
2. Módulo de Colección Personal:
   - Crear el modelo `src/models/UserPlant.js` con métodos para:
     - Registrar una planta en la colección del usuario.
     - Obtener todas las plantas de un usuario.
     - Buscar una planta específica de la colección.
     - Actualizar información de una planta registrada.
     - Eliminar una planta de la colección.
   - Todas las consultas deben utilizar Prepared Statements y async/await.

3. API de Gestión de Colección:
   - Implementar `src/controllers/userPlantController.js`.
   - Crear endpoints para:
     - Agregar plantas a la colección personal.
     - Listar la colección completa del usuario autenticado.
     - Consultar una planta específica de la colección.
     - Modificar datos personalizados de una planta.
     - Eliminar plantas de la colección.
   - Utilizar bloques try/catch y delegar errores mediante next(error).

4. Módulo de Favoritos:
   - Crear el modelo `src/models/Favorite.js`.
   - Implementar métodos para:
     - Agregar favoritos.
     - Eliminar favoritos.
     - Listar favoritos del usuario autenticado.
     - Verificar si una planta ya se encuentra marcada como favorita.

5. API de Favoritos:
   - Implementar `src/controllers/favoriteController.js`.
   - Crear endpoints para:
     - Marcar una planta como favorita.
     - Remover una planta de favoritos.
     - Obtener el listado completo de favoritos.
   - Evitar registros duplicados de favoritos para un mismo usuario.

6. Rutas Protegidas:
   - Definir `src/routes/userPlantRoutes.js`.
   - Definir `src/routes/favoriteRoutes.js`.
   - Proteger todos los endpoints utilizando `authMiddleware.js`.
   - Garantizar que cada usuario solo pueda acceder y modificar sus propios registros.

7. Integración con la Arquitectura Existente:
   - Reutilizar el modelo `Plant.js` del catálogo general para validar la existencia de plantas antes de agregarlas a la colección.
   - Integrar correctamente los módulos desarrollados con la autenticación JWT existente.
   - Mantener la separación de responsabilidades entre modelos, controladores y rutas.
```

</tasks>

<output_format>
Genera el código para el Desarrollador 2 entregando cada archivo (P2) en un bloque de código separado.

````
En la primera línea de cada bloque de código, debes indicar la ruta exacta del archivo comentada.

Ejemplo de formato requerido:

```javascript
// Ruta: src/models/UserPlant.js
const db = require('../config/db');
// ... resto del código
```

```javascript
// Ruta: src/controllers/favoriteController.js
const Favorite = require('../models/Favorite');
// ... resto del código
```

```sql
-- Ruta: database/schema.sql
CREATE TABLE plantas_usuario (
    -- ... definición de tabla
);
```

Debes generar únicamente archivos pertenecientes a P2:

- database/schema.sql (únicamente extensiones correspondientes a P2)
- src/models/UserPlant.js
- src/models/Favorite.js
- src/controllers/userPlantController.js
- src/controllers/favoriteController.js
- src/routes/userPlantRoutes.js
- src/routes/favoriteRoutes.js

No debes generar, modificar ni sobrescribir archivos asignados a P1, P3 o P4.

Todo el código debe:
- Estar completamente comentado cuando sea necesario.
- Utilizar async/await.
- Implementar consultas parametrizadas con Prepared Statements.
- Mantener la arquitectura MVC definida por el proyecto.
- Estar listo para copiar, pegar y ejecutar sin modificaciones adicionales.

Si una funcionalidad depende de módulos desarrollados previamente en P1 (por ejemplo `authMiddleware.js`, `Plant.js` o `db.js`), debes asumir que dichos archivos ya existen y utilizarlos mediante importación o require, sin volver a implementarlos.
````

</output_format>
