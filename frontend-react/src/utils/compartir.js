/**
 * Enlace directo a la ficha de un producto.
 * La aplicación usa HashRouter, así que el enlace tiene la forma
 * https://sitio/#/producto/34 y funciona al pegarlo en cualquier navegador.
 */
export function urlFicha(id) {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/producto/${id}`;
}

/** ¿El navegador ofrece el menú nativo de compartir (celulares, sobre todo)? */
export function puedeCompartirNativo() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/**
 * Copia texto al portapapeles. Devuelve true si lo logró.
 * Usa la API moderna y, si no está disponible (por ejemplo en http sin
 * localhost), un método alterno con un campo de texto temporal.
 */
export async function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      // se intenta el método alterno
    }
  }

  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.setAttribute("readonly", "");
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.appendChild(campo);
  campo.select();

  let copiado = false;
  try {
    copiado = document.execCommand("copy");
  } catch {
    copiado = false;
  }
  campo.remove();
  return copiado;
}
