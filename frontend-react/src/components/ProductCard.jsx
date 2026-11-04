import { useState } from "react";

const dinero = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

/**
 * Tarjeta de producto: foto, nombre y precio.
 * Acepta { nombre, precio, imagen } (catálogo) o { name, price, icon }
 * (datos de ejemplo de la página de inicio).
 */
function ProductCard({ product }) {
  const [imagenFalla, setImagenFalla] = useState(false);

  const nombre = product.nombre || product.name;
  const precio = Number(product.precio ?? product.price) || 0;
  const imagen = product.imagen || product.imagen_url;

  return (
    <li className="card">
      <div className="thumb">
        {imagen && !imagenFalla ? (
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            onError={() => setImagenFalla(true)}
          />
        ) : (
          <span className="thumb__fallback" aria-hidden="true">
            {product.icon || "✦"}
          </span>
        )}
      </div>

      <div className="body">
        <h3 className="card__name" title={nombre}>
          {nombre}
        </h3>
        <strong className="card__price">{dinero.format(precio)}</strong>
      </div>
    </li>
  );
}

export default ProductCard;
