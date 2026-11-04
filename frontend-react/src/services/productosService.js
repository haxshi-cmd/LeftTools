import productosRespaldo from "../data/productos.json";

const API_URL = "http://localhost:3000/api";

export async function obtenerDestacados() {
  const respuesta = await fetch(
    `${API_URL}/productos/destacados`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los productos.");
  }

  const resultado = await respuesta.json();

  return resultado.datos || [];
}

// Deja el producto con los 3 campos que usa la tarjeta (+ id y categoría).
function normalizar(fila) {
  return {
    id: fila.id ?? fila.id_producto,
    nombre: fila.nombre,
    precio: Number(fila.precio) || 0,
    imagen: fila.imagen ?? fila.imagen_url ?? "",
    categoria: fila.categoria ?? ""
  };
}

/**
 * Catálogo completo para la vista de productos.
 * Lee GET /api/productos (base de datos). Si el backend no está
 * encendido, usa data/productos.json (exportado del .sql).
 */
export async function obtenerProductos() {
  try {
    const respuesta = await fetch(`${API_URL}/productos`);

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const resultado = await respuesta.json();
    return (resultado.datos || []).map(normalizar);
  } catch (error) {
    console.warn(
      "API no disponible, se usa data/productos.json:",
      error.message
    );
    return productosRespaldo.map(normalizar);
  }
}
