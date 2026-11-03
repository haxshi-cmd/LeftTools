
import { useState } from "react";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";

// Datos provisionales: después se conectarán al backend.
const PRODUCTS = [
  {
    id: 1,
    name: "Tijeras escolares de filo izquierdo",
    cat: "utiles",
    sub: "tijeras",
    category: "Tijeras",
    price: 89,
    rating: 4.7,
    isNew: false,
    icon: "✂️"
  },
  {
    id: 2,
    name: "Cuaderno con espiral al lado derecho",
    cat: "utiles",
    sub: "cuadernos",
    category: "Cuadernos",
    price: 65,
    rating: 4.5,
    isNew: true,
    icon: "📓"
  },
  {
    id: 3,
    name: "Ratón ergonómico para mano izquierda",
    cat: "tecnologia",
    sub: "ratones",
    category: "Ratones",
    price: 699,
    rating: 4.7,
    isNew: false,
    icon: "🖱️"
  }
];

function Catalogo() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filters, setFilters] = useState([]);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || product.cat === category;

    const matchesFilters = filters.every((filter) => {
      if (filter === "new") return product.isNew;
      if (filter === "cheap") return product.price < 200;
      if (filter === "top") return product.rating >= 4.5;
      return true;
    });

    return matchesSearch && matchesCategory && matchesFilters;
  });

  function toggleFilter(filter) {
    setFilters((previous) =>
      previous.includes(filter)
        ? previous.filter((item) => item !== filter)
        : [...previous, filter]
    );
  }

  return (
    <>
      <Header />

      <main className="layout">
        <aside className="sidebar">
          <h2>Categorías</h2>

          <button onClick={() => setCategory("all")}>
            Todos los productos
          </button>

          <button onClick={() => setCategory("utiles")}>
            Útiles escolares
          </button>

          <button onClick={() => setCategory("tecnologia")}>
            Tecnología
          </button>
        </aside>

        <section>
          <h1>Catálogo de productos</h1>

          <input
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="chips">
            <button onClick={() => toggleFilter("new")}>
              Novedades
            </button>

            <button onClick={() => toggleFilter("cheap")}>
              Menos de $200
            </button>

            <button onClick={() => toggleFilter("top")}>
              Mejor valorados
            </button>
          </div>

          <ProductGrid products={filteredProducts} />
        </section>
      </main>
    </>
  );
}

export default Catalogo;