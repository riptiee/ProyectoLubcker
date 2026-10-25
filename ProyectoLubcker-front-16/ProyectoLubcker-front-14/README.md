# Lubcker E-Commerce - Guía de Instalación y Ejecución

Este proyecto es un e-commerce desarrollado con **Spring Boot (Backend)**, **React (Frontend)** y **MySQL (Base de Datos)**.

---

## 1. Configuración de la Base de Datos (MySQL)
1. Abra **MySQL Workbench** o su gestor de preferencia.
2. Cree una base de datos llamada `Lubcker`:
   ```sql
   CREATE DATABASE Lubcker;
   ```
3. El sistema generará las tablas automáticamente en el primer inicio gracias a la propiedad `ddl-auto=update`.

---

## 2. Configuración y Ejecución del Backend (Spring Boot)
El backend utiliza variables de entorno para proteger las credenciales de la base de datos.

### Variables de entorno requeridas:
* `DB_URL`: Ruta de conexión (Ej: `jdbc:mysql://localhost:3306/Lubcker?useSSL=false&serverTimezone=UTC`)
* `DB_USER`: Usuario de MySQL (Ej: `root`)
* `DB_PASSWORD`: Contraseña de su servidor MySQL

### Cómo ejecutar en Spring Tool Suite (STS):
1. Haga clic derecho sobre el proyecto -> **Run As** -> **Run Configurations...**
2. Vaya a la pestaña **Environment**.
3. Añada las tres variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`) con sus valores locales.
4. Presione **Apply** y luego **Run**.

---

## 3. Configuración y Ejecución del Frontend (React)
El frontend requiere centralizar la URL de la API mediante una variable de entorno.

### Pasos para ejecutar:
1. En la raíz de la carpeta del frontend, asegúrese de que exista un archivo `.env` con la siguiente línea:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```
2. Abra una terminal en la carpeta del frontend e instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie la aplicación de desarrollo:
   ```bash
   npm start
   ```
4. La aplicación se abrirá automáticamente en `http://localhost:3000`.
