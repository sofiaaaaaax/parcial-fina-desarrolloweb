# Reseñas de Restaurantes — Aplicación Full-Stack

Aplicación web full-stack para el registro, autenticación y gestión de reseñas de restaurantes con aislamiento de información por usuario, construida con **Angular**, **Node.js / Express** y **MySQL / MariaDB**.

## Integrantes

* **Sofia Lopez Holguin**
* **Mateo Lastra Castillo**
* **Juan Manuel Londoño Rios**

---

## Características principales

* **Registro e inicio de sesión (`JWT`):** Autenticación con contraseña encriptada (`bcryptjs`) y emisión de token JWT (`jsonwebtoken`), con persistencia de sesión en `sessionStorage`.
* **Protección de rutas:** Guard en Angular (`authGuard`) para rutas privadas y *middleware* de autenticación en el backend (`Authorization: Bearer <token>`).
* **Aislamiento de datos por usuario:** Cada usuario solo puede consultar, crear, editar y eliminar sus propias reseñas (`usuario_id`).
* **CRUD completo de reseñas:** Gestión de reseñas con *nombre del restaurante*, *calificación*, *fecha de visita* y *observaciones*.
* **Interfaz temática:** Diseño oscuro cálido con detalles dorados y crema, fondos visuales y vista adaptable.

---

## Estructura del proyecto

```text
.
├── backend/            # API REST en Node.js + Express + MySQL
│   ├── src/
│   │   ├── config/     # Conexión a base de datos (pool mysql2/promise)
│   │   ├── middleware/ # Validación de token JWT
│   │   ├── routes/     # Rutas de autenticación y reseñas
│   │   └── app.js
│   └── package.json
├── frontend/           # Aplicación SPA en Angular
│   ├── public/         # Recursos estáticos e imágenes de fondo
│   ├── src/
│   │   └── app/
│   │       ├── guards/
│   │       ├── pages/
│   │       └── services/
│   └── package.json
├── .env.example        # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

---

## Requisitos previos

* Node.js (versión 18 o superior recomendada)
* MySQL / MariaDB en ejecución (por ejemplo, vía XAMPP / phpMyAdmin)
* Angular CLI (opcional, si deseas ejecutar comandos `ng` directamente)

---

## Configuración y ejecución local

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example` (nunca subas el `.env` real al repositorio):

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=resenas_restaurantes
JWT_SECRET=clave_secreta_segura
```

### 2. Base de datos

Crea la base de datos y las tablas `usuarios` y `resenas` en MySQL/MariaDB antes de iniciar el servidor:

```sql
CREATE DATABASE IF NOT EXISTS resenas_restaurantes;
USE resenas_restaurantes;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre_restaurante VARCHAR(150) NOT NULL,
  calificacion INT NOT NULL,
  fecha_visita DATE NOT NULL,
  observaciones TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resenas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);
```

### 3. Ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

> Si no tienes el script `dev`, usa `npm start` o `node src/app.js` según esté configurado en `backend/package.json`.

### 4. Ejecutar el frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
npm install
npm start
```
