import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import { obtenerProductos } from "../services/productosService";

const PAGE_SIZE = 20;

/**
 * Catálogo: carga los productos y los muestra en el expositor
 * (ProductGrid), 20 por página.
 */
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => activo && setProducts(datos))
      .catch(() => activo && setError("No se pudo cargar el catálogo."))
      .finally(() => activo && setLoading(false));

    return () => {
      activo = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibles = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function irAPagina(nueva) {
    setPage(nueva);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  if (loading) {
    return (
      <p className="catalog__status" role="status" aria-live="polite">
        Cargando catálogo…
      </p>
    );
  }

  if (error) {
    return <p className="catalog__status" role="alert">{error}</p>;
  }

  return (
    <>
      <p className="catalog__count">
        {products.length} {products.length === 1 ? "producto" : "productos"}
      </p>

      <ProductGrid products={visibles} />

      {totalPages > 1 && (
        <nav className="pager" aria-label="Páginas del catálogo">
          <button
            className="btn"
            onClick={() => irAPagina(page - 1)}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            className="btn"
            onClick={() => irAPagina(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente →
          </button>
        </nav>
      )}
    </>
  );
}

export default ProductCatalog;
