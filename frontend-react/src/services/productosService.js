import productosRespaldo from "../data/productos.json";
import fichasRespaldo from "../data/fichas.json";

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

/* ---------------------------------------------------------------------
 * Ficha de producto (F06)
 * ------------------------------------------------------------------- */

// Quita fotos sin dirección y direcciones repetidas.
function normalizarImagenes(lista) {
  const vistas = new Set();
  const resultado = [];
  for (const imagen of lista ?? []) {
    const url = typeof imagen === "string" ? imagen : imagen?.url;
    if (!url || vistas.has(url)) continue;
    vistas.add(url);
    resultado.push({ url, descripcion: imagen?.descripcion ?? "" });
  }
  return resultado;
}

// MySQL entrega DECIMAL como texto ("21.160400"); null = sin ubicación.
function coordenada(valor) {
  const numero = Number(valor);
  return valor == null || valor === "" || !Number.isFinite(numero) ? null : numero;
}

// Deja la ficha con los campos que usa la interfaz, venga de la API o del respaldo.
function normalizarFicha(fila) {
  return {
    id: fila.id ?? fila.id_producto,
    nombre: fila.nombre,
    precio: Number(fila.precio) || 0,
    categoria: fila.categoria ?? "",
    marca: fila.marca ?? "",
    descripcion: fila.descripcion ?? "",
    utilidad: fila.utilidad_zurdos ?? fila.utilidad ?? "",
    stock: Number(fila.stock) || 0,
    estado: fila.estado ?? "activo",
    etiquetas: (fila.etiquetas ?? []).filter(Boolean),
    imagenes: normalizarImagenes(fila.imagenes),
    tiendas: (fila.tiendas ?? []).map((t) => ({
      id: t.id ?? t.id_tienda,
      nombre: t.nombre,
      direccion: t.direccion ?? "",
      ciudad: t.ciudad ?? "",
      telefono: t.telefono ?? "",
      latitud: coordenada(t.latitud),
      longitud: coordenada(t.longitud),
      disponible: t.disponible == null ? true : Boolean(Number(t.disponible))
    }))
  };
}

// Ficha armada con data/productos.json + data/fichas.json (sin backend).
function fichaDeRespaldo(id) {
  const base = productosRespaldo.find((p) => String(p.id) === String(id));
  if (!base) return null;

  const extra = fichasRespaldo[String(id)] ?? {};
  return normalizarFicha({
    ...base,
    ...extra,
    imagenes: [
      { url: base.imagen, descripcion: base.nombre },
      ...(extra.imagenes ?? [])
    ]
  });
}

function usarRespaldoFicha(id, motivo) {
  console.warn(`API no disponible, ficha desde data/fichas.json: ${motivo}`);
  return fichaDeRespaldo(id);
}

/**
 * Ficha completa de un producto.
 * Lee GET /api/productos/:id (base de datos). Si el backend no está
 * encendido o falla, usa data/productos.json + data/fichas.json.
 * Devuelve null cuando el producto no existe.
 */
export async function obtenerFicha(id) {
  // Solo ids numéricos: cualquier otra cosa no puede ser un producto.
  if (!/^\d+$/.test(String(id))) return null;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}/productos/${id}`);
  } catch (error) {
    return usarRespaldoFicha(id, error.message);
  }

  if (respuesta.status === 404) return null;
  if (!respuesta.ok) return usarRespaldoFicha(id, `HTTP ${respuesta.status}`);

  try {
    const resultado = await respuesta.json();
    return normalizarFicha(resultado.datos);
  } catch (error) {
    return usarRespaldoFicha(id, error.message);
  }
}
