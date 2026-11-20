import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GaleriaProducto from "../components/GaleriaProducto";
import TiendasProducto from "../components/TiendasProducto";
import CompartirProducto from "../components/CompartirProducto";
import { obtenerFicha } from "../services/productosService";
import "../styles/ficha.css";

const dinero = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

// Etiqueta de existencias según el inventario general del producto.
function disponibilidad({ estado, stock }) {
  if (estado === "agotado" || stock <= 0) return { clase: "no", texto: "Agotado" };
  if (stock <= 5) return { clase: "poco", texto: "Últimas piezas" };
  return { clase: "ok", texto: "Disponible" };
}

function irATiendas() {
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById("tiendas")
    ?.scrollIntoView({ behavior: reducir ? "auto" : "smooth" });
}

/**
 * Ficha de producto: #/producto/:id
 * Muestra la información (HU06.1), la galería (HU06.2), las tiendas (HU06.3)
 * y el botón para compartir (HU06.4).
 */
function Ficha({ id, onReintentar }) {
  const [estado, setEstado] = useState({ cargando: true, ficha: null, error: "" });
  const { cargando, ficha, error } = estado;

  useEffect(() => {
    let activo = true;

    obtenerFicha(id)
      .then((datos) => activo && setEstado({ cargando: false, ficha: datos, error: "" }))
      .catch(() =>
        activo &&
        setEstado({
          cargando: false,
          ficha: null,
          error: "No se pudo cargar la ficha del producto."
        })
      );

    return () => {
      activo = false;
    };
  }, [id]);

  // Al abrir una ficha desde el catálogo la página empieza arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // El título de la pestaña lleva el nombre del producto.
  useEffect(() => {
    if (!ficha) return undefined;
    const previo = document.title;
    document.title = `${ficha.nombre} · LeftTools`;
    return () => {
      document.title = previo;
    };
  }, [ficha]);

  if (cargando) {
    return (
      <p className="catalog__status" role="status" aria-live="polite">
        Cargando producto…
      </p>
    );
  }

  if (error) {
    return (
      <div className="catalog__status" role="alert">
        <p>{error}</p>
        <button type="button" className="btn" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="ficha__vacio" role="status">
        <h1>No encontramos este producto</h1>
        <p>Es posible que ya no esté disponible o que el enlace sea incorrecto.</p>
        <Link className="btn btn--acento" to="/">
          Ver el catálogo
        </Link>
      </div>
    );
  }

  const stock = disponibilidad(ficha);

  return (
    <article className="ficha">
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/">Catálogo</Link>
        {ficha.categoria && <> › <span>{ficha.categoria}</span></>} ›{" "}
        <span aria-current="page">{ficha.nombre}</span>
      </nav>

      <div className="ficha__top">
        <GaleriaProducto imagenes={ficha.imagenes} nombre={ficha.nombre} />

        <div className="ficha__info">
          <div className="ficha__cabecera">
            <p className="ficha__eyebrow">
              {[ficha.categoria, ficha.marca].filter(Boolean).join(" · ")}
            </p>
            <h1>{ficha.nombre}</h1>
          </div>

          <div className="ficha__compra">
            <p className="ficha__precio">{dinero.format(ficha.precio)}</p>
            <span className={`estado estado--${stock.clase}`}>{stock.texto}</span>
          </div>

          {ficha.etiquetas.length > 0 && (
            <ul className="etiquetas" aria-label="Etiquetas">
              {ficha.etiquetas.map((etiqueta) => (
                <li key={etiqueta} className="etiqueta">
                  {etiqueta}
                </li>
              ))}
            </ul>
          )}

          <div className="ficha__acciones">
            <button type="button" className="btn btn--acento ficha__boton" onClick={irATiendas}>
              <span aria-hidden="true">📍</span>
              Dónde comprarlo
            </button>
            <CompartirProducto producto={ficha} />
          </div>

          {ficha.descripcion && (
            <section className="ficha__bloque" aria-labelledby="ficha-descripcion">
              <h2 id="ficha-descripcion">Descripción</h2>
              <p>{ficha.descripcion}</p>
            </section>
          )}

          {ficha.utilidad && (
            <section className="ficha__bloque ficha__utilidad" aria-labelledby="ficha-utilidad">
              <h2 id="ficha-utilidad">¿Por qué es útil para personas zurdas?</h2>
              <p>{ficha.utilidad}</p>
            </section>
          )}
        </div>
      </div>

      <section id="tiendas" className="ficha__tiendas" aria-labelledby="ficha-tiendas">
        <h2 id="ficha-tiendas">Dónde conseguirlo</h2>
        <TiendasProducto tiendas={ficha.tiendas} />
      </section>
    </article>
  );
}

function Producto() {
  const { id } = useParams();
  const [intento, setIntento] = useState(0);

  return (
    <main className="container">
      {/* key: al cambiar de producto (o reintentar) la ficha se reinicia desde cero */}
      <Ficha
        key={`${id}-${intento}`}
        id={id}
        onReintentar={() => setIntento((n) => n + 1)}
      />
    </main>
  );
}

export default Producto;
