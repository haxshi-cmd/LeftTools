
function ProductCard({ product }) {
  const dinero = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  });

  return (
    <li className="card">
      <div className="thumb">
        {product.icon || "✦"}
      </div>

      <div className="body">
        {product.isNew && (
          <span className="badge">Nuevo</span>
        )}

        <h2>{product.name || product.nombre}</h2>

        <p className="meta">
          {product.category || product.categoria}
        </p>

        <div className="row">
          <strong>
            {dinero.format(Number(product.price ?? product.precio) || 0)}
          </strong>

          {product.rating != null && (
            <span>★ {Number(product.rating).toFixed(1)}</span>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProductCard;