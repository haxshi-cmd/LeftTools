
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductGrid from "./components/ProductGrid";

function App() {

  const products = [
    {
      id: 1,
      name: "Tijeras escolares para zurdos",
      category: "Útiles escolares",
      price: 89,
      rating: 4.7,
      isNew: true,
      icon: "✂️"
    },
    {
      id: 2,
      name: "Cuaderno con espiral",
      category: "Papelería",
      price: 65,
      rating: 4.5,
      isNew: false,
      icon: "📓"
    },
    {
      id: 3,
      name: "Ratón ergonómico para zurdos",
      category: "Tecnología",
      price: 699,
      rating: 4.8,
      isNew: true,
      icon: "🖱️"
    }
  ];

  return (
    <>
      <Header />

      <main className="container">

        <h1>Catálogo LeftTools</h1>

        <section>
          <h2>Nuestros productos</h2>

          <ProductGrid products={products} />

        </section>

      </main>
    </>
  );
}

export default App;
