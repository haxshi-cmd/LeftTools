import { useRef, useState } from "react";
import { copiarTexto, puedeCompartirNativo, urlFicha } from "../utils/compartir";

const dinero = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

/**
 * Botón «Compartir» de la ficha (HU06.4).
 * Abre un panel con el enlace directo a la ficha y tres formas de enviarlo:
 * copiar el enlace, WhatsApp y correo; en celulares también el menú nativo.
 * Devuelve el botón y el panel como elementos hermanos para que el contenedor
 * (la fila de acciones) los acomode.
 */
function CompartirProducto({ producto }) {
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState("");
  const boton = useRef(null);

  const enlace = urlFicha(producto.id);
  const titulo = `${producto.nombre} · LeftTools`;
  const mensaje = `Te recomiendo «${producto.nombre}» (${dinero.format(producto.precio)}) en LeftTools:`;

  async function copiar() {
    const logrado = await copiarTexto(enlace);
    setAviso(
      logrado
        ? "Enlace copiado al portapapeles."
        : "No se pudo copiar. Selecciona el enlace y cópialo manualmente."
    );
  }

  async function compartirNativo() {
    try {
      await navigator.share({ title: titulo, text: mensaje, url: enlace });
    } catch (error) {
      // AbortError = la persona cerró el menú: no es un fallo.
      if (error?.name !== "AbortError") {
        setAviso("No se pudo abrir el menú de compartir. Usa «Copiar enlace».");
      }
    }
  }

  function alternar() {
    setAbierto((valor) => !valor);
    setAviso("");
  }

  function alPulsarTecla(evento) {
    if (evento.key === "Escape" && abierto) {
      setAbierto(false);
      boton.current?.focus();
    }
  }

  return (
    <>
      <button
        ref={boton}
        type="button"
        className="btn ficha__boton"
        onClick={alternar}
        aria-expanded={abierto}
        aria-controls="panel-compartir"
      >
        <span aria-hidden="true">🔗</span>
        Compartir
      </button>

      {abierto && (
        <div
          id="panel-compartir"
          className="compartir"
          role="group"
          aria-label="Compartir este producto"
          onKeyDown={alPulsarTecla}
        >
          <label className="compartir__campo">
            <span className="compartir__etiqueta">Enlace de la ficha</span>
            <input
              type="text"
              readOnly
              value={enlace}
              onFocus={(e) => e.target.select()}
            />
          </label>

          <div className="compartir__acciones">
            <button type="button" className="btn btn--acento" onClick={copiar}>
              Copiar enlace
            </button>

            <a
              className="btn"
              href={`https://wa.me/?text=${encodeURIComponent(`${mensaje} ${enlace}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
              <span className="sr"> (se abre en una pestaña nueva)</span>
            </a>

            <a
              className="btn"
              href={`mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(`${mensaje}\n${enlace}`)}`}
            >
              Correo
            </a>

            {puedeCompartirNativo() && (
              <button type="button" className="btn" onClick={compartirNativo}>
                Otras aplicaciones…
              </button>
            )}
          </div>

          <p className="compartir__aviso" role="status" aria-live="polite">
            {aviso}
          </p>
        </div>
      )}
    </>
  );
}

export default CompartirProducto;
