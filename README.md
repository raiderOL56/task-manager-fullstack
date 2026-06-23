# Task Manager Fullstack

Aplicación fullstack para gestión de tareas desarrollada con React, FastAPI, PostgreSQL, RabbitMQ, MongoDB y Docker.

El sistema permite crear, listar, actualizar y eliminar tareas desde una interfaz web. Además, cada operación sobre una tarea genera un evento que se publica en RabbitMQ, es procesado por un consumer en Python y se guarda como registro de auditoría en MongoDB.

---

## Arquitectura general

```text
React Frontend
    ↓ HTTP
FastAPI Backend
    ↓
PostgreSQL

FastAPI Backend
    ↓ publica eventos
RabbitMQ
    ↓ consume eventos
Audit Consumer
    ↓
MongoDB
```

---

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Hooks personalizados
- Fetch API

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Pydantic

### Mensajería y auditoría

- RabbitMQ
- Consumer en Python
- MongoDB

### Infraestructura

- Docker
- Docker Compose

---


## Servicios Docker

El proyecto se ejecuta con Docker Compose y levanta los siguientes servicios:

| Servicio | Descripción | Puerto |
|---|---|---|
| frontend | Aplicación React con Vite | 5173 |
| backend | API REST con FastAPI | 8000 |
| postgres | Base de datos SQL | 5433 |
| rabbitmq | Broker de mensajes | 5672 |
| rabbitmq management | Panel web de RabbitMQ | 15672 |
| mongodb | Base de datos NoSQL para auditoría | 27017 |
| consumer | Servicio Python que consume eventos de RabbitMQ | Interno |

---

## Requisitos previos

Tener instalado:

- Docker
- Docker Compose
- Git

No es necesario instalar Python, Node.js, PostgreSQL, MongoDB ni RabbitMQ localmente para ejecutar el proyecto, ya que todo se levanta con Docker.

---

## Cómo ejecutar el proyecto

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

Verificar que todos los contenedores estén arriba:

```bash
docker compose ps
```

Deben aparecer los servicios:

```text
task-postgres-container
task-mongodb-container
task-rabbitmq-container
task-backend-container
task-consumer-container
task-frontend-container
```

---

## Accesos principales

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

Swagger / documentación interactiva de la API:

```text
http://localhost:8000/docs
```

RabbitMQ Management:

```text
http://localhost:15672
```

Credenciales RabbitMQ:

```text
Usuario: guest
Password: guest
```

---

## Endpoints principales

### Listar tareas

```http
GET /tasks
```

### Obtener tarea por ID

```http
GET /tasks/{task_id}
```

### Crear tarea

```http
POST /tasks
```

Body:

```json
{
  "title": "Crear frontend",
  "description": "Construir interfaz en React",
  "status": "pending"
}
```

### Actualizar tarea

```http
PUT /tasks/{task_id}
```

Body de ejemplo:

```json
{
  "status": "completed"
}
```

### Eliminar tarea

```http
DELETE /tasks/{task_id}
```

Respuesta esperada:

```text
204 No Content
```

---

## Flujo funcional

### Crear tarea

```text
Frontend
  ↓ POST /tasks
Backend FastAPI
  ↓ guarda tarea
PostgreSQL
  ↓ publica evento task_created
RabbitMQ
  ↓ consumer procesa evento
MongoDB guarda auditoría
```

### Actualizar tarea

```text
Frontend
  ↓ PUT /tasks/{task_id}
Backend FastAPI
  ↓ actualiza tarea
PostgreSQL
  ↓ publica evento task_updated
RabbitMQ
  ↓ consumer procesa evento
MongoDB guarda auditoría
```

### Eliminar tarea

```text
Frontend
  ↓ DELETE /tasks/{task_id}
Backend FastAPI
  ↓ elimina tarea
PostgreSQL
  ↓ publica evento task_deleted
RabbitMQ
  ↓ consumer procesa evento
MongoDB guarda auditoría
```

---

## Eventos publicados

El backend publica eventos en RabbitMQ en la cola:

```text
task_events
```

Eventos generados:

```text
task_created
task_updated
task_deleted
```

Ejemplo de evento:

```json
{
  "event": "task_created",
  "payload": {
    "task_id": 1,
    "title": "Crear frontend",
    "status": "pending"
  },
  "timestamp": "2026-06-23T00:00:00"
}
```

---

## Ver logs del consumer

Para ver en tiempo real los eventos procesados por el consumer:

```bash
docker compose logs -f consumer
```

También se pueden ver los últimos logs:

```bash
docker compose logs --tail=80 consumer
```

---

## Ver cola en RabbitMQ

Entrar a:

```text
http://localhost:15672
```

Ir a:

```text
Queues and Streams → task_events
```

También puede revisarse por consola:

```bash
docker compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Un resultado esperado cuando todo funciona correctamente es:

```text
task_events    0    0    1
```

Esto significa:

```text
messages_ready = 0
messages_unacknowledged = 0
consumers = 1
```

Es normal que no haya mensajes pendientes si el consumer está funcionando, porque los procesa y confirma con ACK.

---

## Ver registros de auditoría en MongoDB

Entrar a MongoDB:

```bash
docker compose exec mongodb mongosh
```

Seleccionar la base de datos:

```javascript
use task_manager_logs
```

Ver colecciones:

```javascript
show collections
```

Ver últimos registros de auditoría:

```javascript
db.audit_logs.find().sort({ _id: -1 }).limit(5).pretty()
```

Ejemplo de documento guardado:

```json
{
  "_id": "ObjectId(...)",
  "event": "task_created",
  "payload": {
    "task_id": 1,
    "title": "Crear frontend",
    "status": "pending"
  },
  "timestamp": "2026-06-23T00:00:00",
  "processed_at": "2026-06-23T00:00:01"
}
```

Filtrar por evento:

```javascript
db.audit_logs.find({ event: "task_created" }).pretty()
```

```javascript
db.audit_logs.find({ event: "task_updated" }).pretty()
```

```javascript
db.audit_logs.find({ event: "task_deleted" }).pretty()
```

Salir de MongoDB:

```javascript
exit
```

---

## Migraciones con Alembic

El proyecto usa Alembic para gestionar migraciones de base de datos.

Generar una migración nueva:

```bash
cd backend
alembic revision --autogenerate -m "migration description"
```

Aplicar migraciones:

```bash
alembic upgrade head
```

En este proyecto la tabla principal es:

```text
tasks
```

---

## Modelo principal

La entidad principal del sistema es `Task`.

Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| id | integer | Identificador de la tarea |
| title | string | Título de la tarea |
| description | string/null | Descripción opcional |
| status | string | Estado de la tarea |
| created_at | datetime | Fecha de creación |

Estados permitidos desde frontend:

```text
pending
completed
```

---

## Frontend

El frontend está construido con React, TypeScript y Vite.

La lógica de tareas se separó en un custom hook:

```text
src/hooks/useTasks.ts
```

Responsabilidades principales:

```text
TaskForm.tsx     → formulario para crear tareas
TaskList.tsx     → listado, completar y eliminar tareas
useTasks.ts      → estado y lógica de tareas
tasksApi.ts      → comunicación HTTP con FastAPI
task.ts          → tipos TypeScript
App.tsx          → composición principal de la pantalla
```

Flujo de llamada del frontend:

```text
Componente visual
    ↓
App
    ↓
useTasks
    ↓
tasksApi
    ↓
Backend FastAPI
```

---

## Backend

El backend está construido con FastAPI.

Responsabilidades principales:

```text
task_routes.py       → endpoints REST
task_service.py      → lógica de negocio
task_model.py        → modelo SQLAlchemy
task_schema.py       → schemas Pydantic
database.py          → conexión a PostgreSQL
event_publisher.py   → publicación de eventos en RabbitMQ
main.py              → configuración principal de FastAPI
```

---

## Consumer

El consumer es un servicio Python independiente.

Responsabilidades:

```text
Conectarse a RabbitMQ
Escuchar la cola task_events
Procesar mensajes recibidos
Guardar registros de auditoría en MongoDB
Confirmar mensajes con ACK
```

Si ocurre un error procesando un mensaje, el consumer usa NACK para notificar el fallo.

---

## Comandos útiles

Levantar todo:

```bash
docker compose up --build -d
```

Detener todo:

```bash
docker compose down
```

Detener todo eliminando volúmenes:

```bash
docker compose down -v
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs del backend:

```bash
docker compose logs -f backend
```

Ver logs del frontend:

```bash
docker compose logs -f frontend
```

Ver logs del consumer:

```bash
docker compose logs -f consumer
```

Ver logs de RabbitMQ:

```bash
docker compose logs -f rabbitmq
```

Ver logs de PostgreSQL:

```bash
docker compose logs -f postgres
```

Ver logs de MongoDB:

```bash
docker compose logs -f mongodb
```

---

## Validación end-to-end

Para validar el flujo completo:

1. Levantar el proyecto:

```bash
docker compose up --build -d
```

2. Abrir frontend:

```text
http://localhost:5173
```

3. Crear una tarea desde la pantalla.

4. Cambiar su estado a completed.

5. Cambiar su estado nuevamente a pending.

6. Eliminar la tarea.

7. Revisar logs del consumer:

```bash
docker compose logs --tail=80 consumer
```

8. Revisar auditoría en MongoDB:

```bash
docker compose exec mongodb mongosh
```

```javascript
use task_manager_logs
db.audit_logs.find().sort({ _id: -1 }).limit(10).pretty()
```

Deben existir registros con eventos:

```text
task_created
task_updated
task_deleted
```

---

## Notas técnicas

- El frontend consume la API usando `fetch`.
- El backend expone una API REST.
- PostgreSQL almacena el estado actual de las tareas.
- RabbitMQ transporta eventos generados por operaciones sobre tareas.
- MongoDB almacena logs de auditoría.
- El consumer se ejecuta como servicio independiente.
- Docker Compose levanta toda la infraestructura y servicios de aplicación.

---

## Estado actual del proyecto

Funcionalidades implementadas:

- Crear tareas.
- Listar tareas.
- Obtener tarea por ID.
- Actualizar tareas.
- Completar tareas.
- Marcar tareas como pending.
- Eliminar tareas.
- Publicar eventos en RabbitMQ.
- Consumir eventos desde RabbitMQ.
- Guardar auditoría en MongoDB.
- Ejecutar frontend, backend, consumer y bases de datos con Docker Compose.
