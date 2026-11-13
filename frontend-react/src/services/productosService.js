import productosRespaldo from "../data/productos.json";

const API_URL = "http://localhost:3000/api";

// Deja el producto con los campos que usa la interfaz.
function normalizar(fila) {
  return {
    id: fila.id ?? fila.id_producto,
    nombre: fila.nombre,
    precio: Number(fila.precio) || 0,
    imagen: fila.imagen ?? fila.imagen_url ?? "",
    categoria: fila.categoria ?? "",
    descripcion: fila.descripcion ?? "", // se usa para buscar por descripción
    // null = el producto todavía no tiene popularidad asignada
    popularidad: fila.popularidad == null ? null : Number(fila.popularidad)
  };
}

// Mayor popularidad primero; los que no tienen valor (null) al final.
// Si empatan, el más reciente (id más alto) primero. Es el mismo orden
// que usa el backend en /api/productos/destacados.
function porPopularidad(a, b) {
  if (a.popularidad === null && b.popularidad !== null) return 1;
  if (a.popularidad !== null && b.popularidad === null) return -1;
  if (a.popularidad !== b.popularidad) return b.popularidad - a.popularidad;
  return b.id - a.id;
}

/**
 * Productos destacados (sección de inicio): los de mayor popularidad.
 * Lee GET /api/productos/destacados (base de datos). Si el backend no
 * está encendido, usa data/productos.json ordenado igual.
 */
export async function obtenerDestacados(limite = 4) {
  try {
    const respuesta = await fetch(
      `${API_URL}/productos/destacados?limite=${limite}`
    );

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const resultado = await respuesta.json();
    return (resultado.datos || []).map(normalizar);
  } catch (error) {
    console.warn(
      "API no disponible, destacados desde data/productos.json:",
      error.message
    );
    return productosRespaldo
      .map(normalizar)
      .sort(porPopularidad)
      .slice(0, limite);
  }
}

// El catálogo, el buscador y los resultados usan los mismos productos:
// se consultan una sola vez y se comparten (se vuelven a pedir al recargar la página).
let productosEnMemoria = null;

/**
 * Catálogo completo para la vista de productos.
 * Lee GET /api/productos (base de datos). Si el backend no está
 * encendido, usa data/productos.json (exportado del .sql).
 */
export function obtenerProductos() {
  if (!productosEnMemoria) {
    productosEnMemoria = cargarProductos().catch((error) => {
      productosEnMemoria = null; // si falla, el próximo intento vuelve a consultar
      throw error;
    });
  }
  return productosEnMemoria;
}

async function cargarProductos() {
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
