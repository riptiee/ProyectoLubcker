DROP DATABASE IF EXISTS Lubcker;
CREATE DATABASE Lubcker;
USE Lubcker   ;

-- 1. Clientes y sus datos asociados
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL
);

CREATE TABLE direccion (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    provincia VARCHAR(100),
    ciudad VARCHAR(100),
    calle VARCHAR(100),
    altura int,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT UNIQUE NOT NULL,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 2. Productos y catalogación
CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL,
    id_categoria INT,
    id_resenas int,
    id_ficha int,
    id_orden int,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden),
    FOREIGN KEY (id_ficha) REFERENCES ficha_tecnica(id_ficha),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_resenas) REFERENCES resenas(id_resenas)
);

CREATE TABLE ficha_tecnica (
    id_ficha INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    modelo VARCHAR(50),
    presentacion VARCHAR(100),
    descripcion VARCHAR(255),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- 3. Ordenes, Ventas y Pagos
CREATE TABLE orden (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE detalle_orden (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario INT NOT NULL,
	subtotal INT NOT NULL,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE metodo_pago (
    id_metodo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_metodo_pago INT,
    estado BOOLEAN,
    monto INT NOT NULL,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo)
);

-- 4. Logística
CREATE TABLE empresa_logistica (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    sucursal VARCHAR(100) NOT NULL
);

CREATE TABLE envio (
    id_envio INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_direccion INT NOT NULL,
    id_empresa INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden),
    FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion),
    FOREIGN KEY (id_empresa) REFERENCES empresa_logistica(id_empresa)
);

-- 5. Reseñas
CREATE TABLE resenas (
    id_resenas INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    valoracion INT CHECK (valoracion BETWEEN 1 AND 5),
    descripcion VARCHAR(255),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);