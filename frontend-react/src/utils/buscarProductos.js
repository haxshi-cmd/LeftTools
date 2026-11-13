// Quita mayúsculas y acentos para comparar: "Ratón" y "raton" son iguales.
export function normalizar(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Busca en el nombre, la categoría y la descripción de cada producto.
 * - Ignora mayúsculas y acentos.
 * - Si se escriben varias palabras, el producto debe contener todas
 *   (por ejemplo "tijeras zurdos").
 * - Con texto vacío no devuelve nada.
 * Es el mismo método que ya se usaba para el nombre, ahora aplicado
 * a los tres campos.
 */
export function buscarProductos(productos, texto) {
  const palabras = normalizar(texto).trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];

  return productos.filter((producto) => {
    const contenido = normalizar(
      `${producto.nombre} ${producto.categoria} ${producto.descripcion}`
    );
    return palabras.every((palabra) => contenido.includes(palabra));
  });
}
