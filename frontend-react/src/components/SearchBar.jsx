import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { obtenerProductos } from "../services/productosService";
import { buscarProductos } from "../utils/buscarProductos";
import "../styles/search.css";

const MAX_SUGERENCIAS = 6;

const dinero = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

// Foto pequeña; si no carga, se muestra el símbolo ✦ (igual que la tarjeta).
function Miniatura({ imagen }) {
  const [falla, setFalla] = useState(false);

  if (!imagen || falla) {
    return <span className="search__thumb search__thumb--vacia" aria-hidden="true">✦</span>;
  }

  return (
    <img
      className="search__thumb"
      src={imagen}
      alt=""
      loading="lazy"
      onError={() => setFalla(true)}
    />
  );
}

/**
 * Barra de búsqueda del navbar.
 *  - Mientras se escribe, muestra debajo una lista con las coincidencias.
 *  - Con Enter lleva a la página de resultados (#/buscar?q=texto).
 */
function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();

  // Si ya estamos en la página de resultados, la barra conserva el texto buscado.
  const [texto, setTexto] = useState(pathname === "/buscar" ? params.get("q") ?? "" : "");
  const [abierto, setAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const entrada = useRef(null);

  useEffect(() => {
    let activo = true;
    obtenerProductos()
      .then((datos) => activo && setProductos(datos))
      .catch(() => {}); // sin datos la lista simplemente no muestra coincidencias
    return () => {
      activo = false;
    };
  }, []);

  const consulta = texto.trim();
  const coincidencias = consulta ? buscarProductos(productos, consulta) : [];
  const sugerencias = coincidencias.slice(0, MAX_SUGERENCIAS);
  const mostrarLista = abierto && consulta !== "";

  function enviar(evento) {
    evento.preventDefault();
    if (!consulta) return;          // Enter sin texto: no pasa nada
    setAbierto(false);
    entrada.current?.blur();
    navigate(`/buscar?q=${encodeURIComponent(consulta)}`);
  }

  function alSalir(evento) {
    // Cierra la lista cuando el foco sale de la barra (por ejemplo, al tocar fuera).
    if (!evento.currentTarget.contains(evento.relatedTarget)) setAbierto(false);
  }

  return (
    <form
      className="search"
      role="search"
      onSubmit={enviar}
      onBlur={alSalir}
      onKeyDown={(e) => e.key === "Escape" && setAbierto(false)}
    >
      <input
        ref={entrada}
        type="search"
        name="q"
        value={texto}
        placeholder="Buscar por nombre, categoría o descripción"
        aria-label="Buscar productos"
        autoComplete="off"
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
      />

      {mostrarLista && (
        // onMouseDown evita que la lista se cierre al hacer clic dentro de ella
        <div className="search__panel" onMouseDown={(e) => e.preventDefault()}>
          {sugerencias.length > 0 ? (
            <>
              <ul className="search__list" aria-label="Coincidencias">
                {sugerencias.map((producto) => (
                  <li key={producto.id} className="search__item">
                    <Miniatura imagen={producto.imagen} />
                    <span className="search__text">
                      <span className="search__name">{producto.nombre}</span>
                      <span className="search__meta">{producto.categoria}</span>
                    </span>
                    <span className="search__price">{dinero.format(producto.precio)}</span>
                  </li>
                ))}
              </ul>
              <p className="search__hint" role="status">
                {coincidencias.length > sugerencias.length
                  ? `${coincidencias.length} coincidencias · `
                  : ""}
                Presiona Enter para ver todos los resultados
              </p>
            </>
          ) : (
            <p className="search__empty" role="status">
              Sin resultados para «{consulta}»
            </p>
          )}
        </div>
      )}
    </form>
  );
}

export default SearchBar;
