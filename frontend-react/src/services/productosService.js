
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
