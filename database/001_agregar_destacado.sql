-- Migración para la tabla productos EXISTENTE de LeftTools.
-- Ejecutar en la base de datos que ya contiene productos y categorias.
-- No crea ni reemplaza la tabla productos.

ALTER TABLE productos
  ADD COLUMN destacado TINYINT(1) NOT NULL DEFAULT 0
  AFTER es_zurdo;

CREATE INDEX idx_productos_destacados_estado
  ON productos (destacado, estado);
