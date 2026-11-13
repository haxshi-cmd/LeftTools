import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/global.css";
function Header({ usuario, onLoginClick, onLogout }) {
  const { pathname, search } = useLocation();

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        left<span>tools</span>
      </Link>

      <nav className="mainnav">
        <Link to="/">Catálogo</Link>
        <a href="/guia">Guía para zurdos</a>
        <a href="/ofertas">Ofertas</a>
      </nav>

      {/* key: al cambiar de página la barra se reinicia con el texto de esa página */}
      <SearchBar key={pathname + search} />

      <div className="controls">
        <button className="btn">Interfaz: zurda</button>
        <button className="btn">🌙</button>

        {usuario ? (
          <>
            <span className="btn" title={usuario.correo}>
              👤 {usuario.nombre.split(" ")[0]}
            </span>
            <button className="btn" onClick={onLogout}>
              Salir
            </button>
          </>
        ) : (
          <button
            className="btn"
            onClick={onLoginClick}
            aria-label="Iniciar sesión"
            title="Iniciar sesión"
          >
            👤
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
