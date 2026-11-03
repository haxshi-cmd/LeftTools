
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="empty">
        No hay productos con esos filtros.
      </p>
    );
  }

  return (
    <ul className="grid">
      {products.map((product) => (
        <ProductCard
          key={product.id ?? product.id_producto}
          product={product}
        />
      ))}
    </ul>
  );
}

export default ProductGrid;