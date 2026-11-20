-- =====================================================================
-- F06 · Ficha de producto  (HU06.1 – HU06.4)
-- Migración 002 para la base de datos EXISTENTE `estructuras` (MariaDB 10.11).
--
-- Qué hace:
--   1. Agrega a `productos` la columna `utilidad_zurdos`        (T06.1.3)
--   2. Crea `etiquetas` y `producto_etiqueta`                    (T06.1.2)
--   3. Crea `producto_imagenes` (fotos adicionales)              (T06.2.1)
--   4. Crea `tiendas` y `producto_tienda`                        (T06.3.1)
--   5. Carga datos iniciales para los 22 productos actuales.
--
-- Es seguro ejecutarla más de una vez (IF NOT EXISTS / INSERT IGNORE /
-- solo rellena `utilidad_zurdos` cuando está vacía).
-- NO modifica ni borra productos, categorías ni usuarios.
--
-- Ejecutar: phpMyAdmin -> base `estructuras` -> pestaña SQL -> pegar y ejecutar.
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1. Utilidad para personas zurdas (texto que explica por qué sirve)
-- ---------------------------------------------------------------------
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS utilidad_zurdos TEXT NULL
  AFTER descripcion;

-- ---------------------------------------------------------------------
-- 2. Etiquetas del producto (relación muchos a muchos)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS etiquetas (
  id_etiqueta INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(60)  NOT NULL,
  PRIMARY KEY (id_etiqueta),
  UNIQUE KEY uq_etiquetas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS producto_etiqueta (
  id_producto INT UNSIGNED NOT NULL,
  id_etiqueta INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_producto, id_etiqueta),
  KEY idx_pe_etiqueta (id_etiqueta),
  CONSTRAINT fk_pe_producto FOREIGN KEY (id_producto)
    REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pe_etiqueta FOREIGN KEY (id_etiqueta)
    REFERENCES etiquetas (id_etiqueta) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 3. Galería: fotografías ADICIONALES del producto
--    La foto principal sigue siendo `productos.imagen_url`; la API la
--    pone siempre en primer lugar y luego agrega estas, por `orden`.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto_imagenes (
  id_imagen   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_producto INT UNSIGNED NOT NULL,
  url         VARCHAR(500) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  orden       SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id_imagen),
  KEY idx_pi_producto (id_producto, orden),
  CONSTRAINT fk_pi_producto FOREIGN KEY (id_producto)
    REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 4. Tiendas y su relación con los productos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tiendas (
  id_tienda INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre    VARCHAR(150) NOT NULL,
  direccion VARCHAR(255) DEFAULT NULL,
  ciudad    VARCHAR(100) DEFAULT NULL,
  telefono  VARCHAR(30)  DEFAULT NULL,
  latitud   DECIMAL(9,6) DEFAULT NULL,
  longitud  DECIMAL(9,6) DEFAULT NULL,
  activa    TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id_tienda)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS producto_tienda (
  id_producto INT UNSIGNED NOT NULL,
  id_tienda   INT UNSIGNED NOT NULL,
  disponible  TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id_producto, id_tienda),
  KEY idx_pt_tienda (id_tienda),
  CONSTRAINT fk_pt_producto FOREIGN KEY (id_producto)
    REFERENCES productos (id_producto) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pt_tienda FOREIGN KEY (id_tienda)
    REFERENCES tiendas (id_tienda) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- DATOS INICIALES
-- =====================================================================

-- 5a. Utilidad para zurdos (solo si todavía no tiene texto)

UPDATE productos SET utilidad_zurdos = 'Las tijeras comunes están hechas para la mano derecha: al cortar con la izquierda las hojas se separan y la línea de corte queda tapada. Aquí las hojas están invertidas, así que la presión natural del pulgar izquierdo las mantiene unidas y el corte siempre se ve.'
 WHERE id_producto = 34 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'En un cuaderno de espiral lateral, la muñeca izquierda choca con las anillas al escribir cerca del margen. Con el espiral en la parte superior no hay nada bajo la mano, así que se escribe y se pasa de página sin estorbos.'
 WHERE id_producto = 35 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Muchas herramientas manuales están pensadas para accionarse con la derecha. Su mango ergonómico se sujeta con comodidad con la mano izquierda y permite girar sin torcer la muñeca ni cambiar de mano a mitad del trabajo.'
 WHERE id_producto = 36 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Las pinzas de precisión suelen estar orientadas para el pulgar derecho. Estas facilitan sujetar y guiar piezas pequeñas con la izquierda, con mejor control de la punta y sin tapar la zona de trabajo.'
 WHERE id_producto = 37 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'La hoja del pelador está orientada para pelar con el movimiento natural de la mano izquierda, de modo que no hay que torcer la muñeca ni cambiar el agarre para que la cuchilla corte bien.'
 WHERE id_producto = 38 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'En un cuchillo común el filo está pensado para la mano derecha y, al usarlo con la izquierda, tiende a desviarse y a tapar la vista del corte. El filo adaptado corta recto al presionar con la izquierda y deja ver la trayectoria.'
 WHERE id_producto = 39 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'En unas tijeras de podar para diestros la hoja de corte queda del lado contrario y la rama se atora al cortar con la izquierda. Con el agarre invertido, la hoja cortante queda del lado correcto y el corte es limpio con menos esfuerzo.'
 WHERE id_producto = 40 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'El mango ergonómico reparte la presión en la palma y evita ampollas y molestias en la muñeca durante sesiones largas de jardinería, trabajando con la mano izquierda al frente.'
 WHERE id_producto = 41 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Los ratones comunes tienen el contorno para el pulgar y los botones principales pensados para la mano derecha. Este diseño está adaptado para que la palma y el pulgar izquierdos descansen de forma natural y el clic principal quede bajo el dedo índice izquierdo.'
 WHERE id_producto = 42 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Un teclado con bloque numérico a la derecha obliga a cruzar el brazo o soltar el ratón. Un teclado numérico independiente se coloca del lado izquierdo y permite capturar cifras con la mano izquierda sin cruzar el brazo sobre el teclado.'
 WHERE id_producto = 43 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Al escribir de izquierda a derecha, la mano izquierda arrastra sobre el trazo recién hecho y mancha el grafito. Este set con distintas graduaciones permite elegir grafitos más duros, que manchan menos, para detalles y sombras.'
 WHERE id_producto = 44 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Al dibujar en una superficie digital no hay grafito ni tinta que se corran al pasar la mano, y la tableta se puede colocar en el ángulo más cómodo para la mano izquierda.'
 WHERE id_producto = 45 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Es el modelo para jugadores que lanzan con la mano izquierda: el guante se usa en la mano derecha, de modo que la izquierda queda libre para tomar la pelota y lanzar sin tener que quitarse el guante.'
 WHERE id_producto = 46 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Un golfista zurdo guía el palo con la mano derecha al frente, por lo que el guante se usa en la derecha. Los guantes comunes se venden para la mano izquierda; esta versión da agarre antideslizante en la mano correcta.'
 WHERE id_producto = 47 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Está fabricada en espejo para quien rasguea con la mano izquierda y pisa los trastes con la derecha. Así se pueden seguir acordes y tablaturas normales sin invertir el orden de las cuerdas, como pasa al voltear una guitarra para diestros.'
 WHERE id_producto = 48 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Viene con las cuerdas dispuestas para quien rasguea con la mano izquierda, evitando voltear un ukelele para diestros y cambiar las cuerdas a mano para que los acordes suenen bien.'
 WHERE id_producto = 49 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Quien escribe o usa el ratón con la mano izquierda suele apoyar la muñeca en el borde del escritorio, que es duro y la inclina. El apoyo acolchado la mantiene recta y reduce la tensión en sesiones prolongadas.'
 WHERE id_producto = 50 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'El adaptador acomoda los dedos en una posición natural, un poco alejada de la punta. Así la mano no tapa lo que se escribe, se arrastra menos sobre el trazo fresco y se reduce la fatiga al escribir con la izquierda.'
 WHERE id_producto = 51 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Los niños zurdos pueden mover las cuentas con la mano izquierda y colocar el bastidor en la posición que les resulte más cómoda, de modo que aprenden a contar sin adaptar su postura.'
 WHERE id_producto = 53 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Con la cinta en la mano izquierda, la numeración corre de derecha a izquierda, así que los números quedan en la orientación correcta para leerlos al medir, sin voltear la cinta ni leerla al revés.'
 WHERE id_producto = 54 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Los sacapuntas comunes obligan a girar el lápiz en el sentido de las agujas del reloj, que es cómodo con la derecha. Este tiene las cuchillas orientadas para girar el lápiz en sentido contrario, el movimiento natural de la mano izquierda.'
 WHERE id_producto = 55 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');
UPDATE productos SET utilidad_zurdos = 'Los relojes comunes llevan la corona del lado derecho para ajustarlos con la mano derecha. Aquí la corona está adaptada para ajustar la hora y consultarla con comodidad usando la mano izquierda.'
 WHERE id_producto = 56 AND (utilidad_zurdos IS NULL OR utilidad_zurdos = '');

-- 5b. Etiquetas
INSERT IGNORE INTO etiquetas (nombre) VALUES
  ('Accesorios'),
  ('Arte'),
  ('Bricolaje'),
  ('Béisbol'),
  ('Captura de datos'),
  ('Chef'),
  ('Cocina'),
  ('Comodidad'),
  ('Corte'),
  ('Cuadernos'),
  ('Cuerdas'),
  ('Deportes'),
  ('Dibujo'),
  ('Educación'),
  ('Ergonómico'),
  ('Escritura'),
  ('Escuela'),
  ('Exterior'),
  ('Golf'),
  ('Herramientas'),
  ('Jardinería'),
  ('Medición'),
  ('Música'),
  ('Niños'),
  ('Oficina'),
  ('Papelería'),
  ('Precisión'),
  ('Principiantes y expertos'),
  ('Relojes'),
  ('Tecnología'),
  ('Uso diario');

-- Producto <-> etiqueta (se asocia por nombre; ignora productos que no existan)
INSERT IGNORE INTO producto_etiqueta (id_producto, id_etiqueta)
SELECT p.id_producto, e.id_etiqueta
FROM (
  SELECT 34 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 34 AS pid, 'Corte' AS etiqueta
  UNION ALL
  SELECT 34 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 35 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 35 AS pid, 'Escritura' AS etiqueta
  UNION ALL
  SELECT 35 AS pid, 'Cuadernos' AS etiqueta
  UNION ALL
  SELECT 36 AS pid, 'Herramientas' AS etiqueta
  UNION ALL
  SELECT 36 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 36 AS pid, 'Bricolaje' AS etiqueta
  UNION ALL
  SELECT 37 AS pid, 'Herramientas' AS etiqueta
  UNION ALL
  SELECT 37 AS pid, 'Precisión' AS etiqueta
  UNION ALL
  SELECT 37 AS pid, 'Bricolaje' AS etiqueta
  UNION ALL
  SELECT 38 AS pid, 'Cocina' AS etiqueta
  UNION ALL
  SELECT 38 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 38 AS pid, 'Corte' AS etiqueta
  UNION ALL
  SELECT 39 AS pid, 'Cocina' AS etiqueta
  UNION ALL
  SELECT 39 AS pid, 'Corte' AS etiqueta
  UNION ALL
  SELECT 39 AS pid, 'Chef' AS etiqueta
  UNION ALL
  SELECT 40 AS pid, 'Jardinería' AS etiqueta
  UNION ALL
  SELECT 40 AS pid, 'Corte' AS etiqueta
  UNION ALL
  SELECT 40 AS pid, 'Exterior' AS etiqueta
  UNION ALL
  SELECT 41 AS pid, 'Jardinería' AS etiqueta
  UNION ALL
  SELECT 41 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 41 AS pid, 'Exterior' AS etiqueta
  UNION ALL
  SELECT 42 AS pid, 'Oficina' AS etiqueta
  UNION ALL
  SELECT 42 AS pid, 'Tecnología' AS etiqueta
  UNION ALL
  SELECT 42 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 43 AS pid, 'Oficina' AS etiqueta
  UNION ALL
  SELECT 43 AS pid, 'Tecnología' AS etiqueta
  UNION ALL
  SELECT 43 AS pid, 'Captura de datos' AS etiqueta
  UNION ALL
  SELECT 44 AS pid, 'Arte' AS etiqueta
  UNION ALL
  SELECT 44 AS pid, 'Dibujo' AS etiqueta
  UNION ALL
  SELECT 44 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 45 AS pid, 'Arte' AS etiqueta
  UNION ALL
  SELECT 45 AS pid, 'Tecnología' AS etiqueta
  UNION ALL
  SELECT 45 AS pid, 'Dibujo' AS etiqueta
  UNION ALL
  SELECT 46 AS pid, 'Deportes' AS etiqueta
  UNION ALL
  SELECT 46 AS pid, 'Béisbol' AS etiqueta
  UNION ALL
  SELECT 46 AS pid, 'Exterior' AS etiqueta
  UNION ALL
  SELECT 47 AS pid, 'Deportes' AS etiqueta
  UNION ALL
  SELECT 47 AS pid, 'Golf' AS etiqueta
  UNION ALL
  SELECT 47 AS pid, 'Exterior' AS etiqueta
  UNION ALL
  SELECT 48 AS pid, 'Música' AS etiqueta
  UNION ALL
  SELECT 48 AS pid, 'Cuerdas' AS etiqueta
  UNION ALL
  SELECT 48 AS pid, 'Principiantes y expertos' AS etiqueta
  UNION ALL
  SELECT 49 AS pid, 'Música' AS etiqueta
  UNION ALL
  SELECT 49 AS pid, 'Cuerdas' AS etiqueta
  UNION ALL
  SELECT 49 AS pid, 'Principiantes y expertos' AS etiqueta
  UNION ALL
  SELECT 50 AS pid, 'Oficina' AS etiqueta
  UNION ALL
  SELECT 50 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 50 AS pid, 'Comodidad' AS etiqueta
  UNION ALL
  SELECT 51 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 51 AS pid, 'Escritura' AS etiqueta
  UNION ALL
  SELECT 51 AS pid, 'Ergonómico' AS etiqueta
  UNION ALL
  SELECT 53 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 53 AS pid, 'Educación' AS etiqueta
  UNION ALL
  SELECT 53 AS pid, 'Niños' AS etiqueta
  UNION ALL
  SELECT 54 AS pid, 'Herramientas' AS etiqueta
  UNION ALL
  SELECT 54 AS pid, 'Medición' AS etiqueta
  UNION ALL
  SELECT 54 AS pid, 'Precisión' AS etiqueta
  UNION ALL
  SELECT 55 AS pid, 'Escuela' AS etiqueta
  UNION ALL
  SELECT 55 AS pid, 'Escritura' AS etiqueta
  UNION ALL
  SELECT 55 AS pid, 'Papelería' AS etiqueta
  UNION ALL
  SELECT 56 AS pid, 'Accesorios' AS etiqueta
  UNION ALL
  SELECT 56 AS pid, 'Relojes' AS etiqueta
  UNION ALL
  SELECT 56 AS pid, 'Uso diario' AS etiqueta
) AS v
INNER JOIN productos AS p ON p.id_producto = v.pid
INNER JOIN etiquetas AS e ON e.nombre = v.etiqueta;

-- 5c. Tiendas de EJEMPLO.
--   ATENCIÓN: son datos de demostración (nombres genéricos, teléfonos y
--   coordenadas aproximadas del centro de Cancún). Sustitúyelos por las
--   tiendas reales con UPDATE o desde phpMyAdmin antes de la entrega.
INSERT IGNORE INTO tiendas (id_tienda, nombre, direccion, ciudad, telefono, latitud, longitud, activa) VALUES
  (1, 'Papelería Escolar Centro', 'Av. Tulum, SM 22', 'Cancún, Q. Roo', '998 000 0001', 21.1632, -86.8266, 1),
  (2, 'Ferretería La Esquina', 'Av. Uxmal, SM 25', 'Cancún, Q. Roo', '998 000 0002', 21.1604, -86.8312, 1),
  (3, 'Hogar y Cocina Cancún', 'Av. Bonampak, SM 4', 'Cancún, Q. Roo', '998 000 0003', 21.1527, -86.8271, 1),
  (4, 'Jardín y Vivero Verde', 'Av. Nader, SM 5', 'Cancún, Q. Roo', '998 000 0004', 21.1651, -86.8289, 1),
  (5, 'Tecno Oficina Cancún', 'Av. Cobá, SM 3', 'Cancún, Q. Roo', '998 000 0005', 21.1586, -86.8247, 1),
  (6, 'Arte y Color', 'Av. Yaxchilán, SM 22', 'Cancún, Q. Roo', '998 000 0006', 21.1639, -86.8245, 1),
  (7, 'Deportes Cancún', 'Av. Tulum, SM 21', 'Cancún, Q. Roo', '998 000 0007', 21.1561, -86.8262, 1),
  (8, 'Casa Musical Cancún', 'Av. Chichén Itzá, SM 24', 'Cancún, Q. Roo', '998 000 0008', 21.1619, -86.833, 1),
  (9, 'Accesorios y Relojes del Caribe', 'Av. Tulum, SM 23', 'Cancún, Q. Roo', '998 000 0009', 21.1597, -86.8269, 1),
  (10, 'Súper Útiles Cancún', 'Av. López Portillo, SM 29', 'Cancún, Q. Roo', '998 000 0010', 21.1675, -86.8199, 1);

-- 5d. Producto <-> tienda (ignora productos o tiendas que no existan)
INSERT IGNORE INTO producto_tienda (id_producto, id_tienda, disponible)
SELECT p.id_producto, t.id_tienda, v.disp
FROM (
  SELECT 34 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 34 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 35 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 35 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 36 AS pid, 2 AS tid, 1 AS disp
  UNION ALL
  SELECT 36 AS pid, 10 AS tid, 0 AS disp
  UNION ALL
  SELECT 37 AS pid, 2 AS tid, 1 AS disp
  UNION ALL
  SELECT 37 AS pid, 5 AS tid, 1 AS disp
  UNION ALL
  SELECT 38 AS pid, 3 AS tid, 1 AS disp
  UNION ALL
  SELECT 38 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 39 AS pid, 3 AS tid, 1 AS disp
  UNION ALL
  SELECT 40 AS pid, 4 AS tid, 1 AS disp
  UNION ALL
  SELECT 40 AS pid, 2 AS tid, 1 AS disp
  UNION ALL
  SELECT 41 AS pid, 4 AS tid, 1 AS disp
  UNION ALL
  SELECT 41 AS pid, 2 AS tid, 0 AS disp
  UNION ALL
  SELECT 42 AS pid, 5 AS tid, 1 AS disp
  UNION ALL
  SELECT 42 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 43 AS pid, 5 AS tid, 1 AS disp
  UNION ALL
  SELECT 44 AS pid, 6 AS tid, 1 AS disp
  UNION ALL
  SELECT 44 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 45 AS pid, 5 AS tid, 1 AS disp
  UNION ALL
  SELECT 45 AS pid, 6 AS tid, 1 AS disp
  UNION ALL
  SELECT 46 AS pid, 7 AS tid, 1 AS disp
  UNION ALL
  SELECT 47 AS pid, 7 AS tid, 1 AS disp
  UNION ALL
  SELECT 47 AS pid, 9 AS tid, 0 AS disp
  UNION ALL
  SELECT 48 AS pid, 8 AS tid, 1 AS disp
  UNION ALL
  SELECT 49 AS pid, 8 AS tid, 1 AS disp
  UNION ALL
  SELECT 50 AS pid, 5 AS tid, 1 AS disp
  UNION ALL
  SELECT 50 AS pid, 9 AS tid, 1 AS disp
  UNION ALL
  SELECT 51 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 51 AS pid, 9 AS tid, 1 AS disp
  UNION ALL
  SELECT 51 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 53 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 53 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 54 AS pid, 2 AS tid, 1 AS disp
  UNION ALL
  SELECT 54 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 55 AS pid, 1 AS tid, 1 AS disp
  UNION ALL
  SELECT 55 AS pid, 10 AS tid, 1 AS disp
  UNION ALL
  SELECT 56 AS pid, 9 AS tid, 1 AS disp
) AS v
INNER JOIN productos AS p ON p.id_producto = v.pid
INNER JOIN tiendas   AS t ON t.id_tienda   = v.tid;

-- =====================================================================
-- 6. Fotografías adicionales (T06.2.1) — PLANTILLA
--    Agrega aquí las fotos que reúna el equipo (una fila por foto).
--    La foto principal NO se repite: ya sale de productos.imagen_url.
--    `orden` define la posición en la galería (1, 2, 3 ...).
-- =====================================================================
-- INSERT INTO producto_imagenes (id_producto, url, descripcion, orden) VALUES
--   (54, 'https://ejemplo.com/cinta-lateral.jpg', 'Vista lateral de la cinta métrica', 1),
--   (54, 'https://ejemplo.com/cinta-numeros.jpg', 'Numeración de derecha a izquierda',  2);

-- Verificación rápida (debe devolver 22 filas con tiendas y etiquetas):
-- SELECT p.id_producto, p.nombre,
--        (SELECT COUNT(*) FROM producto_tienda   pt WHERE pt.id_producto = p.id_producto) AS tiendas,
--        (SELECT COUNT(*) FROM producto_etiqueta pe WHERE pe.id_producto = p.id_producto) AS etiquetas
-- FROM productos p ORDER BY p.id_producto;
