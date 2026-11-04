-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2026 a las 01:04:21
-- Versión del servidor: 10.11.16-MariaDB
-- Versión de PHP: 8.3.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `estructuras`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `imagen_url` varchar(500) DEFAULT NULL,
  `es_zurdo` tinyint(1) NOT NULL DEFAULT 1,
  `estado` enum('activo','inactivo','agotado') NOT NULL DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `id_categoria`, `nombre`, `descripcion`, `marca`, `precio`, `stock`, `imagen_url`, `es_zurdo`, `estado`, `fecha_creacion`) VALUES
(34, 1, 'Tijeras ergonomicas para zurdos', 'Tijeras con hojas invertidas para realizar cortes precisos con la mano izquierda.', 'LeftyTools', 149.90, 25, 'https://www.pascuamx.com/tienda/tijeras-para-zurdos-21cm-8-2%E2%80%B3/', 1, 'activo', '2026-11-03 23:33:40'),
(35, 1, 'Cuaderno espiral para zurdos', 'Cuaderno con espiral superior para evitar molestias al escribir con la mano izquierda.', 'LeftyPaper', 89.90, 40, 'https://www.amazon.com.mx/Jutom-cuadernos-izquierda-universitaria-suministros/dp/B0CT27ZXDB', 1, 'activo', '2026-11-03 23:33:40'),
(36, 2, 'Destornillador ergonomico para zurdos', 'Herramienta manual con mango ergonomico que facilita el agarre y la manipulacion.', 'ToolMaster', 129.90, 20, 'https://www.walmart.com.mx/ip/destornillador-para-zurdos-con-trinquete-en-t-de-grado-profesional-engranaje-de-3-posiciones-para-un-trinquete-eficiente-juego-de-llaves-de-grifo-con-mango-en-t-ajustable-varilla-de-mango/00958195129239', 1, 'activo', '2026-11-03 23:33:40'),
(37, 2, 'Pinzas de precision para zurdos', 'Pinzas disenadas para facilitar trabajos de precision utilizando la mano izquierda.', 'PrecisionTools', 79.90, 30, 'https://www.amazon.com.mx/verduras-zanahoria-antideslizante-cuchillas-inoxidable/dp/B0DS6Y4DWL', 1, 'activo', '2026-11-03 23:33:40'),
(38, 3, 'Pelador de verduras para zurdos', 'Pelador con diseno ergonomico para facilitar el pelado de frutas y verduras.', 'KitchenLeft', 119.90, 22, 'https://www.hobbees.com.mx/products/non-stick-titanium-micro-serrated-scissors-tijera-de-titanium-para-zurdos', 1, 'activo', '2026-11-03 23:33:40'),
(39, 3, 'Cuchillo de cocina para zurdos', 'Cuchillo con filo adaptado para facilitar los cortes con la mano izquierda.', 'ChefLeft', 459.00, 10, 'https://global.ichimonji.co.jp/es/pages/left-handed-knives', 1, 'activo', '2026-11-03 23:33:40'),
(40, 4, 'Tijeras de podar para zurdos', 'Tijeras de jardin con agarre adaptado para realizar cortes de ramas y plantas.', 'GardenPro', 249.90, 15, 'https://grupocsmexico.com/felco/producto/tijeras-felco-9-tijeras-para-podar-a-una-mano-zurdo/', 1, 'activo', '2026-11-03 23:33:40'),
(41, 4, 'Pala de jardin ergonomica', 'Pala manual con mango comodo para realizar trabajos de jardineria.', 'GreenTools', 179.90, 18, 'https://www.amazon.com/-/es/ergon%C3%B3mico-secundario-rastrillos-herramientas-construcci%C3%B3n/dp/B06WW5TLZV', 1, 'activo', '2026-11-03 23:33:40'),
(42, 5, 'Mouse ergonomico para zurdos', 'Mouse con diseno ergonomico adaptado para utilizarse con la mano izquierda.', 'ErgoTech', 389.00, 18, 'https://www.amazon.com.mx/KUNSI-inal%C3%A1mbrico-ergon%C3%B3mico-ajustable-computadora/dp/B0F4J1J65P', 1, 'activo', '2026-11-03 23:33:40'),
(43, 5, 'Teclado numerico para zurdos', 'Teclado numerico independiente para facilitar el acceso a operaciones desde el lado izquierdo.', 'TechLeft', 299.00, 12, 'https://gt.ebay.com/b/Left-Handed-Keyboard/33963/bn_7023345782', 1, 'activo', '2026-11-03 23:33:40'),
(44, 6, 'Set de lapices profesionales', 'Conjunto de lapices de dibujo con diferentes graduaciones para ilustracion y bocetos.', 'ArtDesign', 189.90, 25, 'https://www.amazon.com.mx/Stabilo-EASYgraph-escritura-unidades-Graphite/dp/B003WQFADG', 1, 'activo', '2026-11-03 23:33:40'),
(45, 6, 'Tableta de dibujo digital', 'Tableta digitalizadora para realizar ilustraciones y disenos mediante computadora.', 'CreativeTech', 1299.00, 8, 'https://www.infobae.com/2012/08/29/667581-genius-presento-oficialmente-una-tableta-digital-pensada-zurdos/', 1, 'activo', '2026-11-03 23:33:40'),
(46, 7, 'Guante de beisbol para zurdos', 'Guante deportivo con configuracion para jugadores que lanzan con la mano derecha y atrapan con la izquierda.', 'SportLeft', 699.00, 10, 'https://www.mercadolibre.com.mx/guante-de-beisbol-zurdo-radach-pro-115in-rojo-negro-115/p/MLM53340966', 1, 'activo', '2026-11-03 23:33:40'),
(47, 7, 'Guante de golf para zurdos', 'Guante deportivo disenado para ofrecer mejor agarre durante el juego de golf.', 'GolfPro', 249.90, 20, 'https://www.amazon.com.mx/Fockety-Silicona-Antideslizante-el%C3%A1stico-Entrenamiento/dp/B0GR6SB5J3', 1, 'activo', '2026-11-03 23:33:40'),
(48, 8, 'Guitarra acustica para zurdos', 'Guitarra acustica con distribucion de cuerdas y configuracion para musicos zurdos.', 'MusicPro', 3299.00, 5, 'https://es.fender.com/pages/left-handed', 1, 'activo', '2026-11-03 23:33:40'),
(49, 8, 'Ukelele para zurdos', 'Ukelele con configuracion de cuerdas adaptada para interpretar musica con la mano izquierda.', 'SoundLeft', 899.00, 7, 'https://ukesmx.com/ukulele-para-zurdos/', 1, 'activo', '2026-11-03 23:33:40'),
(50, 9, 'Apoya muneca ergonomico', 'Accesorio acolchado para brindar comodidad durante sesiones prolongadas de trabajo.', 'ComfortZone', 159.90, 30, 'https://www.mercadolibre.com.mx/soporte-ergonomico-apoya-muneca-90gradosshop-silicona-zurdo-negro/p/MLM29080764', 1, 'activo', '2026-11-03 23:33:40'),
(51, 9, 'Lapiz ergonomico de agarre', 'Lapiz con adaptador ergonomico que facilita la sujecion y escritura con la mano izquierda.', 'EasyGrip', 59.90, 45, 'https://www.amazon.com.mx/Maped-Visio-224320-Bol%C3%ADgrafo-zurdos/dp/B00ASN6ND2', 1, 'activo', '2026-11-03 23:33:40'),
(53, 10, 'Abaco educativo', 'Material didactico para aprender operaciones matematicas de manera visual y practica.', 'LearningPro', 129.90, 20, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', 1, 'activo', '2026-11-03 23:33:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_productos_categorias` (`id_categoria`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
