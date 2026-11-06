import { useEffect, useState } from "react";
import Header from "./components/Header";
import FeaturedProducts from "./components/FeaturedProducts";
import ProductCatalog from "./components/ProductCatalog";
import Login from "./components/Login";
import { obtenerDestacados } from "./services/productosService";

/* --- PRODUCTOS DE EJEMPLO (ya no se usan) ---
   Eran datos escritos a mano para la sección de destacados. Ahora los
   destacados vienen de obtenerDestacados() (base de datos o, si el
   backend no está encendido, data/productos.json), ordenados por popularidad.

const products = [
  { id: 1, name: "Tijeras escolares para zurdos", category: "Útiles escolares", price: 89, rating: 4.7, isNew: true, icon: "✂️" },
  { id: 2, name: "Cuaderno con espiral", category: "Papelería", price: 65, rating: 4.5, isNew: false, icon: "📓" },
  { id: 3, name: "Ratón ergonómico para zurdos", category: "Tecnología", price: 699, rating: 4.8, isNew: true, icon: "🖱️" },
];
*/

function App() {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario") || "null")
  );
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [pendiente, setPendiente] = useState(null); // producto que quería comprar antes de iniciar sesión

  // Productos destacados (los de mayor popularidad)
  const [destacados, setDestacados] = useState([]);
  const [cargandoDestacados, setCargandoDestacados] = useState(true);
  const [errorDestacados, setErrorDestacados] = useState("");

  useEffect(() => {
    let activo = true;

    obtenerDestacados()
      .then((datos) => activo && setDestacados(datos))
      .catch(() =>
        activo && setErrorDestacados("No se pudieron cargar los productos destacados.")
      )
      .finally(() => activo && setCargandoDestacados(false));

    return () => {
      activo = false;
    };
  }, []);

  const hacerCompra = (producto) => {
    // Aquí va tu lógica real: agregar al carrito, ir al pago, etc.
    alert(`Agregaste "${producto.name}" al carrito`);
  };

  // Se llama desde el botón "Comprar / Agregar al carrito" de cada producto
  const comprar = (producto) => {
    if (!usuario) {
      setPendiente(producto);   // recordamos qué quería comprar
      setMostrarLogin(true);    // y pedimos iniciar sesión
      return;
    }
    hacerCompra(producto);
  };

  const alIniciarSesion = (u) => {
    setUsuario(u);
    setMostrarLogin(false);
    if (pendiente) {            // continúa la compra que había empezado
      hacerCompra(pendiente);
      setPendiente(null);
    }
  };

  const cerrarLogin = () => {
    setMostrarLogin(false);
    setPendiente(null);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <>
      <Header
        usuario={usuario}
        onLoginClick={() => setMostrarLogin(true)}
        onLogout={cerrarSesion}
      />

      <main className="container">
        <h1>Catálogo LeftTools</h1>

        <FeaturedProducts
          products={destacados}
          loading={cargandoDestacados}
          error={errorDestacados}
          onBuy={comprar}
        />

        <section id="catalogo">
          <h2>Nuestros productos</h2>
          <ProductCatalog onBuy={comprar} />
        </section>
      </main>

      {mostrarLogin && <Login onLogin={alIniciarSesion} onClose={cerrarLogin} />}
    </>
  );
}

export default App;