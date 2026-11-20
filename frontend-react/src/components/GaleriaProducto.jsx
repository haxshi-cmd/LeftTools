import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Galería de fotografías del producto (HU06.2).
 *  - Foto grande con miniaturas, flechas y contador "2 / 4".
 *  - Teclado: ← → cambian de foto; Enter/clic amplía; Esc cierra la ampliación.
 *  - Si una foto no carga se descarta; si ninguna carga se muestra un recuadro.
 *  - Mientras la foto carga se muestra "Cargando fotografía…".
 */
function GaleriaProducto({ imagenes = [], nombre }) {
  const [rotas, setRotas] = useState([]);       // direcciones que no cargaron
  const [cargadas, setCargadas] = useState([]); // direcciones ya cargadas
  const [indice, setIndice] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const botonAmpliar = useRef(null);
  const botonCerrar = useRef(null);

  const fotos = imagenes.filter((foto) => !rotas.includes(foto.url));
  const total = fotos.length;
  const actual = total > 0 ? Math.min(indice, total - 1) : 0;
  const foto = fotos[actual];
  const cargando = Boolean(foto) && !cargadas.includes(foto.url);

  const marcarRota = (url) =>
    setRotas((previas) => (previas.includes(url) ? previas : [...previas, url]));
  const marcarCargada = (url) =>
    setCargadas((previas) => (previas.includes(url) ? previas : [...previas, url]));

  const ir = (salto) => setIndice((actual + salto + total) % total);

  const textoAlterno = (f) =>
    f.descripcion && f.descripcion !== nombre ? `${nombre}: ${f.descripcion}` : nombre;

  // Al ampliar: foco en el botón de cerrar y sin desplazamiento de la página.
  useEffect(() => {
    if (!ampliada) return undefined;
    botonCerrar.current?.focus();
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [ampliada]);

  function cerrarAmpliacion() {
    setAmpliada(false);
    botonAmpliar.current?.focus();
  }

  function alPulsarTecla(evento) {
    if (total < 2) return;
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      ir(-1);
    } else if (evento.key === "ArrowRight") {
      evento.preventDefault();
      ir(1);
    }
  }

  function alPulsarEnVisor(evento) {
    if (evento.key === "Escape") {
      evento.stopPropagation();
      cerrarAmpliacion();
      return;
    }
    if (evento.key !== "Tab") return;

    // El foco se queda dentro de la ventana ampliada.
    const botones = evento.currentTarget.querySelectorAll("button");
    const primero = botones[0];
    const ultimo = botones[botones.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  return (
    <div
      className="galeria"
      role="group"
      aria-roledescription="galería"
      aria-label={`Fotografías de ${nombre}`}
      onKeyDown={alPulsarTecla}
    >
      <div className="galeria__visor">
        {foto ? (
          <button
            ref={botonAmpliar}
            type="button"
            className="galeria__ampliar"
            onClick={() => setAmpliada(true)}
            aria-label={`Ampliar fotografía de ${nombre}`}
          >
            {cargando && (
              <span className="galeria__cargando" role="status">
                Cargando fotografía…
              </span>
            )}
            <img
              key={foto.url}
              src={foto.url}
              alt={textoAlterno(foto)}
              onLoad={() => marcarCargada(foto.url)}
              onError={() => marcarRota(foto.url)}
              ref={(el) => {
                // Por si la foto ya estaba en caché y el evento load se adelantó.
                if (el && el.complete && el.naturalWidth > 0) marcarCargada(foto.url);
              }}
            />
          </button>
        ) : (
          <div className="galeria__vacia" role="img" aria-label="Sin fotografía disponible">
            <span aria-hidden="true">✦</span>
            <p>Sin fotografía disponible</p>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              className="galeria__flecha galeria__flecha--prev"
              onClick={() => ir(-1)}
              aria-label="Foto anterior"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="galeria__flecha galeria__flecha--next"
              onClick={() => ir(1)}
              aria-label="Foto siguiente"
            >
              <span aria-hidden="true">›</span>
            </button>
            <p className="galeria__contador" aria-live="polite">
              <span className="sr">Foto </span>
              {actual + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="galeria__miniaturas" aria-label="Miniaturas">
          {fotos.map((f, i) => (
            <li key={f.url}>
              <button
                type="button"
                className="galeria__mini"
                onClick={() => setIndice(i)}
                aria-label={`Ver foto ${i + 1} de ${total}`}
                aria-current={i === actual ? "true" : undefined}
              >
                <img
                  src={f.url}
                  alt=""
                  loading="lazy"
                  onError={() => marcarRota(f.url)}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {ampliada && foto && createPortal(
        <div
          className="visor"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografía ampliada de ${nombre}`}
          onKeyDown={alPulsarEnVisor}
          onMouseDown={(e) => e.target === e.currentTarget && cerrarAmpliacion()}
        >
          <button
            ref={botonCerrar}
            type="button"
            className="visor__cerrar"
            onClick={cerrarAmpliacion}
            aria-label="Cerrar fotografía ampliada"
          >
            <span aria-hidden="true">✕</span>
          </button>

          <div className="visor__marco">
            {total > 1 && (
              <button
                type="button"
                className="galeria__flecha visor__flecha visor__flecha--prev"
                onClick={() => ir(-1)}
                aria-label="Foto anterior"
              >
                <span aria-hidden="true">‹</span>
              </button>
            )}

            <img
              className="visor__img"
              src={foto.url}
              alt={textoAlterno(foto)}
              onError={() => marcarRota(foto.url)}
            />

            {total > 1 && (
              <button
                type="button"
                className="galeria__flecha visor__flecha visor__flecha--next"
                onClick={() => ir(1)}
                aria-label="Foto siguiente"
              >
                <span aria-hidden="true">›</span>
              </button>
            )}
          </div>

          <p className="visor__pie" aria-live="polite">
            {total > 1 ? `${actual + 1} / ${total}` : ""}
          </p>
        </div>,
        // Portal al <body>: así la ampliación queda por encima del encabezado
        // aunque la galería (sticky) cree su propio contexto de apilamiento.
        document.body
      )}
    </div>
  );
}

export default GaleriaProducto;
