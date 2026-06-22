

[Rol] Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack con amplia experiencia en el ciclo de vida completo de aplicaciones web.
[Contexto] Estoy desarrollando una app web para la gestión de plantas ya se tiene la base de la app se cuenta con una interfaz grafica para interaccion del cliente en donde este puede agregar, editar, eliminar y buscar plantas, que se obtien de una API externa de la web https://perenual.com/docs/api, tiene las funciones en base en las historias de usuario que se encuentran en el archivo husuarios.md
[Tarea] Como tenemos un límite estricto de 100 peticiones diarias, necesitamos construir un panel de administración interno y protegido para monitorear nuestro consumo.

Por favor, escribe el código estructurado para implementar lo siguiente:

1. Base de Datos (MySQL):
Proporciona el script SQL para crear una tabla llamada api_logs que registre cada llamada. Debe incluir: id, endpoint_consultado, codigo_estado (ej. 200 o 429), tiempo_respuesta_ms, y fecha_creacion.

2. Backend (Express & Node.js):

    Crea una función/middleware que intercepte nuestras llamadas a la API de Perenual y guarde automáticamente un registro en la tabla api_logs.

    Crea un endpoint GET /api/admin/logs que extraiga los datos de MySQL, pero que solo responda si la petición pasa la autenticación.

3. Frontend (Panel Visual):

    agrega el codigo en el en el panel de administrador

    Esta página debe pedir la contraseña, hacer fetch al endpoint /api/admin/logs, y mostrar una tabla visual con el historial de peticiones.

    Incluye un contador visual en la parte superior que sume cuántas peticiones se han hecho en el día actual para saber qué tan cerca estamos del límite de 100.

[Restricciones] 
1. **NO generes tareas adicioanles que no se pidieron** 
2. **no agregues tecnologias nuevas o diferentes** a las que ya se tienen en el proyecto
3. **haz un codigo limpio y sin emojis**
[Formato] presentaco como codigo limpio eficaz con comentarios breves y claros y optimizado para su facil comprension.