import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { obtenerProductos } from "../services/productosService";
import { buscarProductos } from "../utils/buscarProductos";

const PAGE_SIZE = 20;

/**
 * Lista de resultados para un texto. Es independiente del catálogo principal:
 * recibe un texto y muestra las tarjetas que coinciden. Más adelante este
 * mismo lugar servirá para mostrar los resultados de filtros y ordenamiento.
 */
function ListaResultados({ consulta }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let activo = true;
    obtenerProductos()
      .then((datos) => activo && setProductos(datos))
      .catch(() => activo && setError("No se pudieron cargar los productos."))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return <p className="catalog__status" role="status" aria-live="polite">Buscando…</p>;
  }
  if (error) {
    return <p className="catalog__status" role="alert">{error}</p>;
  }

  const resultados = buscarProductos(productos, consulta);

  if (resultados.length === 0) {
    return (
      <p className="empty" role="status">
        No se encontraron productos para «{consulta}».
      </p>
    );
  }

  const totalPaginas = Math.ceil(resultados.length / PAGE_SIZE);
  const visibles = resultados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  function irAPagina(nueva) {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <p className="catalog__count" role="status">
        {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
      </p>

      <ProductGrid products={visibles} />

      {totalPaginas > 1 && (
        <nav className="pager" aria-label="Páginas de resultados">
          <button className="btn" onClick={() => irAPagina(pagina - 1)} disabled={pagina === 1}>
            ← Anterior
          </button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button className="btn" onClick={() => irAPagina(pagina + 1)} disabled={pagina === totalPaginas}>
            Siguiente →
          </button>
        </nav>
      )}
    </>
  );
}

function Resultados() {
  const [params] = useSearchParams();
  const consulta = (params.get("q") ?? "").trim();

  return (
    <main className="container">
      <p><Link to="/">← Volver al catálogo</Link></p>

      {consulta ? (
        <>
          <h1>Resultados para «{consulta}»</h1>
          {/* key: al buscar otro texto, la lista vuelve a la página 1 */}
          <ListaResultados key={consulta} consulta={consulta} />
        </>
      ) : (
        <>
          <h1>Buscar productos</h1>
          <p className="empty">Escribe en la barra de búsqueda para encontrar productos.</p>
        </>
      )}
    </main>
  );
}

export default Resultados;
