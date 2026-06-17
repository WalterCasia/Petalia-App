# P2 - Collection & favoritos (Rama Carlos)

## Restricciones Obligatorias

* Trabajar únicamente sobre la rama Git `Carlos`.
* No cambiar de rama.
* No hacer merge.
* No modificar archivos asignados a P1, P3 o P4.
* No crear nuevas carpetas.
* No alterar la estructura actual del proyecto.
* Asumir que JWT, authMiddleware, db.js, User.js y Plant.js ya existen y funcionan correctamente.
* Utilizar exclusivamente async/await y mysql2/promise.
* Todas las consultas SQL deben ser parametrizadas con `?`.

---

# Checklist de Implementación P2

## Base de Datos

### Tarea P2-01

* [ ] Extender `database/schema.sql`
* [ ] Crear tabla `plantas_usuario`
* [ ] Definir PK autoincremental
* [ ] Crear FK hacia `Users`
* [ ] Crear FK hacia `Plants`
* [ ] Agregar timestamps

### Tarea P2-02

* [ ] Extender `database/schema.sql`
* [ ] Crear tabla `favoritos`
* [ ] Crear FK hacia `Users`
* [ ] Crear FK hacia `Plants`
* [ ] Agregar restricción UNIQUE(user_id, plant_id)

---

## Modelo UserPlant

### Tarea P2-03

* [ ] Completar `src/models/UserPlant.js`
* [ ] Método create()
* [ ] Método findAllByUser()
* [ ] Método findById()
* [ ] Método update()
* [ ] Método delete()

### Tarea P2-04

* [ ] Validar que todas las consultas utilicen Prepared Statements
* [ ] Verificar uso de async/await
* [ ] No incluir lógica HTTP

---

## Modelo Favorite

### Tarea P2-05

* [ ] Completar `src/models/Favorite.js`
* [ ] Método addFavorite()
* [ ] Método removeFavorite()
* [ ] Método getUserfavoritos()
* [ ] Método exists()

### Tarea P2-06

* [ ] Verificar Prepared Statements
* [ ] Verificar async/await

---

## Controlador UserPlant

### Tarea P2-07

* [ ] Completar `src/controllers/userPlantController.js`
* [ ] Endpoint agregar planta
* [ ] Endpoint listar colección
* [ ] Endpoint obtener planta por ID
* [ ] Endpoint actualizar planta
* [ ] Endpoint eliminar planta

### Tarea P2-08

* [ ] Todos los métodos con try/catch
* [ ] Todos los errores enviados mediante next(error)
* [ ] Sin consultas SQL directas

---

## Controlador Favorite

### Tarea P2-09

* [ ] Completar `src/controllers/favoriteController.js`
* [ ] Endpoint agregar favorito
* [ ] Endpoint eliminar favorito
* [ ] Endpoint listar favoritos

### Tarea P2-10

* [ ] Evitar favoritos duplicados
* [ ] Utilizar métodos del modelo Favorite
* [ ] Implementar try/catch y next(error)

---

## Rutas UserPlant

### Tarea P2-11

* [ ] Completar `src/routes/userPlantRoutes.js`
* [ ] Importar authMiddleware
* [ ] Proteger todas las rutas
* [ ] Registrar rutas CRUD

---

## Rutas Favorite

### Tarea P2-12

* [ ] Completar `src/routes/favoriteRoutes.js`
* [ ] Importar authMiddleware
* [ ] Proteger todas las rutas
* [ ] Registrar rutas de favoritos

---

## Validaciones Finales

### Tarea P2-13

* [ ] Verificar que ningún archivo P1 haya sido modificado
* [ ] Verificar que ningún archivo P3 haya sido modificado
* [ ] Verificar que ningún archivo P4 haya sido modificado

### Tarea P2-14

* [ ] Revisar imports y exports
* [ ] Revisar nombres de rutas
* [ ] Revisar consistencia MVC

### Tarea P2-15

* [ ] Confirmar que todos los cambios pertenecen exclusivamente a:

  * database/schema.sql (solo extensión P2)
  * src/models/UserPlant.js
  * src/models/Favorite.js
  * src/controllers/userPlantController.js
  * src/controllers/favoriteController.js
  * src/routes/userPlantRoutes.js
  * src/routes/favoriteRoutes.js

### Tarea P2-16

* [ ] Generar resumen final de archivos modificados
* [ ] Confirmar permanencia en rama Git `Carlos`
