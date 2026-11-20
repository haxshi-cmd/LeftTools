/**
 * Enlace de «Ver en mapa» para una tienda (se abre en Google Maps, sin clave de API).
 * - Con coordenadas, marca el punto exacto.
 * - Sin coordenadas, busca por nombre y dirección.
 */
export function urlMapa(tienda) {
  const { latitud, longitud, nombre, direccion, ciudad } = tienda;

  const consulta =
    latitud != null && longitud != null
      ? `${latitud},${longitud}`
      : [nombre, direccion, ciudad].filter(Boolean).join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}
