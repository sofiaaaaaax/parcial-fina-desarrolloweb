-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2026 a las 04:31:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

CREATE DATABASE IF NOT EXISTS resenas_restaurantes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE resenas_restaurantes;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: resenas_restaurantes
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla resenas
--

CREATE TABLE resenas (
  id int(11) NOT NULL,
  usuario_id int(11) NOT NULL,
  nombre_restaurante varchar(150) NOT NULL,
  calificacion tinyint(4) NOT NULL CHECK (calificacion between 1 and 5),
  fecha_visita date NOT NULL,
  observaciones text DEFAULT NULL,
  creado_en timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla usuarios
--

CREATE TABLE usuarios (
  id int(11) NOT NULL,
  nombre varchar(100) NOT NULL,
  email varchar(120) NOT NULL,
  password_hash varchar(255) NOT NULL,
  creado_en timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla usuarios
--

INSERT INTO usuarios (id, nombre, email, password_hash, creado_en) VALUES
(1, 'sofia', 'sofia@gmail.com', '$2b$10$Mo0ZmTdyjK.Ri8wAqGNPvOpr4XeMkq5Kj17wfZRf6MCGbYkoXeHWS', '2026-11-25 02:03:11'),
(2, 'gabo', 'gabo@gmail.com', '$2b$10$PT1bmkAwFoaKxpl3OeRcLO9/XxdxhHm0JBWSskvT4m41rZMw1Imw2', '2026-11-25 02:06:44');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla resenas
--
ALTER TABLE resenas
  ADD PRIMARY KEY (id),
  ADD KEY fk_resenas_usuario (usuario_id);

--
-- Indices de la tabla usuarios
--
ALTER TABLE usuarios
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla resenas
--
ALTER TABLE resenas
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla usuarios
--
ALTER TABLE usuarios
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla resenas
--
ALTER TABLE resenas
  ADD CONSTRAINT fk_resenas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
