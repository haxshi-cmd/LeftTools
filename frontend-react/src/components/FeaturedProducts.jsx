import ProductCard from "./ProductCard";

// Número de espacios (tarjetas) que reserva la sección.
const SLOTS = 4;

function Slot({ variant = "empty" }) {
  return (
    <li className={`card slot slot--${variant}`} aria-hidden="true">
      <div className="thumb slot__thumb">{variant === "empty" ? "✦" : ""}</div>
      <div className="body">
        <span className="slot__line slot__line--short" />
        <span className="slot__line" />
        <span className="slot__line slot__line--price" />
      </div>
    </li>
  );
}

/**
 * Sección de productos destacados (página de inicio).
 * Props:
 *  - products: arreglo de productos (mismo formato que ProductCard)
 *  - loading:  muestra espacios con efecto de carga
 *  - error:    mensaje de error opcional
 */
function FeaturedProducts({ products = [], loading = false, error = "" }) {
  const visibles = loading ? [] : products.slice(0, SLOTS);
  const libres = SLOTS - visibles.length;
  const variant = loading ? "loading" : "empty";

  let estado = "";
  if (loading) estado = "Cargando productos destacados…";
  else if (error) estado = error;
  else if (products.length === 0) {
    estado = "Todavía no hay productos destacados. Vuelve pronto.";
  }

  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="featured__head">
        <div>
          <p className="featured__eyebrow">Selección LeftTools</p>
          <h2 id="featured-title">Productos destacados</h2>
        </div>
        <p className="featured__lead">
          Artículos pensados para que estudiar y trabajar con la mano
          izquierda sea más cómodo.
        </p>
      </div>

      {estado && (
        <p className="featured__status" role="status" aria-live="polite">
          {estado}
        </p>
      )}

      <ul className="featured__grid" aria-label="Productos destacados">
        {visibles.map((product) => (
          <ProductCard
            key={product.id ?? product.id_producto}
            product={product}
          />
        ))}
        {Array.from({ length: libres }, (_, i) => (
          <Slot key={`slot-${i}`} variant={variant} />
        ))}
      </ul>
    </section>
  );
}

export default FeaturedProducts;
