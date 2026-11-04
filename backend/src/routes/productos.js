const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/productos/destacados
router.get("/destacados", async (req, res) => {
  try {
    const limiteSolicitado = Number.parseInt(req.query.limite, 10);
    const limite = Number.isInteger(limiteSolicitado)
      ? Math.min(Math.max(limiteSolicitado, 1), 24)
      : 8;

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
         c.nombre AS categoria
       FROM productos AS p
       INNER JOIN categorias AS c
         ON c.id_categoria = p.id_categoria
       WHERE p.destacado = 1
         AND p.estado = 'activo'
         AND c.activa = 1
       ORDER BY p.fecha_creacion DESC, p.id_producto DESC
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
         p.precio,
         p.imagen_url,
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

module.exports = router;
