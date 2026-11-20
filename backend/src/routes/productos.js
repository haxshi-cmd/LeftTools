const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/productos/destacados
// Los destacados son los productos con mayor `popularidad`.
// Los que aún no tienen popularidad (NULL) quedan al final.
router.get("/destacados", async (req, res) => {
  try {
    const limiteSolicitado = Number.parseInt(req.query.limite, 10);
    const limite = Number.isInteger(limiteSolicitado)
      ? Math.min(Math.max(limiteSolicitado, 1), 24)
      : 4; // la sección de inicio tiene 4 espacios

    /* --- CONSULTA ANTERIOR (ya no sirve) ---
       Filtraba con la columna `destacado`, que ya no existe en la base de
       datos actual (se reemplazó por `popularidad`):
         WHERE p.destacado = 1
           AND p.estado = 'activo'
           AND c.activa = 1
         ORDER BY p.fecha_creacion DESC, p.id_producto DESC
    */
    const [productos] = await db.execute(
      `SELECT
         p.id_producto,
         p.nombre,
         p.descripcion,
         p.marca,
         p.precio,
         p.stock,
         p.imagen_url,
         p.es_zurdo,
         p.popularidad,
         c.nombre AS categoria
       FROM productos AS p
       INNER JOIN categorias AS c
         ON c.id_categoria = p.id_categoria
       WHERE p.estado = 'activo'
         AND c.activa = 1
       ORDER BY (p.popularidad IS NULL), p.popularidad DESC,
                p.fecha_creacion DESC, p.id_producto DESC
       LIMIT ?`,
      [limite]
    );

    res.json({ datos: productos });
  } catch (error) {
    console.error("Error al consultar productos destacados:", error.message);
    res.status(500).json({
      mensaje: "No fue posible consultar los productos destacados."
    });
  }
});

// GET /api/productos  -> catálogo completo (solo productos activos)
router.get("/", async (_req, res) => {
  try {
    const [productos] = await db.execute(
      `SELECT
         p.id_producto,
         p.nombre,
         p.descripcion,
         p.precio,
         p.imagen_url,
         p.popularidad,
         c.nombre AS categoria
       FROM productos AS p
       INNER JOIN categorias AS c
         ON c.id_categoria = p.id_categoria
       WHERE p.estado = 'activo'
         AND c.activa = 1
       ORDER BY p.id_producto`
    );

    res.json({ datos: productos });
  } catch (error) {
    console.error("Error al consultar el catálogo:", error.message);
    res.status(500).json({
      mensaje: "No fue posible consultar el catálogo."
    });
  }
});

// GET /api/productos/:id  -> ficha completa de un producto (F06)
// Devuelve datos del producto, utilidad para zurdos, etiquetas, fotografías
// y tiendas donde se consigue. Un producto agotado sigue consultable (para que
// un enlace compartido no se rompa); uno inactivo o inexistente responde 404.
// Está declarada después de /destacados, así que esa ruta nunca se confunde
// con un id. El id se valida aquí dentro (y no en el patrón de la ruta) para
// que funcione igual en Express 4 y 5 y siempre responda en JSON.
router.get("/:id", async (req, res) => {
  const texto = req.params.id;
  const id = Number(texto);

  // Solo dígitos, y dentro del rango INT UNSIGNED de MySQL/MariaDB: 1 … 4 294 967 295
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(id) || id < 1 || id > 4294967295) {
    return res.status(404).json({ mensaje: "Producto no encontrado." });
  }

  try {
    const [filas] = await db.execute(
      `SELECT
         p.id_producto,
         p.nombre,
         p.descripcion,
         p.utilidad_zurdos,
         p.marca,
         p.precio,
         p.stock,
         p.imagen_url,
         p.es_zurdo,
         p.estado,
         c.nombre AS categoria
       FROM productos AS p
       INNER JOIN categorias AS c
         ON c.id_categoria = p.id_categoria
       WHERE p.id_producto = ?
         AND p.estado IN ('activo', 'agotado')
         AND c.activa = 1`,
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    const producto = filas[0];

    const [[etiquetas], [fotos], [tiendas]] = await Promise.all([
      db.execute(
        `SELECT e.nombre
         FROM producto_etiqueta AS pe
         INNER JOIN etiquetas AS e
           ON e.id_etiqueta = pe.id_etiqueta
         WHERE pe.id_producto = ?
         ORDER BY e.nombre`,
        [id]
      ),
      db.execute(
        `SELECT url, descripcion
         FROM producto_imagenes
         WHERE id_producto = ?
         ORDER BY orden, id_imagen`,
        [id]
      ),
      db.execute(
        `SELECT
           t.id_tienda,
           t.nombre,
           t.direccion,
           t.ciudad,
           t.telefono,
           t.latitud,
           t.longitud,
           pt.disponible
         FROM producto_tienda AS pt
         INNER JOIN tiendas AS t
           ON t.id_tienda = pt.id_tienda
         WHERE pt.id_producto = ?
           AND t.activa = 1
         ORDER BY pt.disponible DESC, t.nombre`,
        [id]
      )
    ]);

    // La foto principal (productos.imagen_url) va siempre primero;
    // después, las adicionales sin repetir ninguna dirección.
    const imagenes = [];
    const vistas = new Set();
    const agregar = (url, descripcion) => {
      if (!url || vistas.has(url)) return;
      vistas.add(url);
      imagenes.push({ url, descripcion: descripcion ?? null });
    };
    agregar(producto.imagen_url, producto.nombre);
    fotos.forEach((foto) => agregar(foto.url, foto.descripcion));

    const { imagen_url: _principal, ...datosProducto } = producto;

    res.json({
      datos: {
        ...datosProducto,
        etiquetas: etiquetas.map((fila) => fila.nombre),
        imagenes,
        tiendas
      }
    });
  } catch (error) {
    console.error("Error al consultar la ficha del producto:", error.message);
    res.status(500).json({
      mensaje: "No fue posible consultar la ficha del producto."
    });
  }
});

module.exports = router;
