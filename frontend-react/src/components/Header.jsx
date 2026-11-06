import "../styles/global.css";
function Header({ usuario, onLoginClick, onLogout }) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        left<span>tools</span>
      </a>

      <nav className="mainnav">
        <a href="/">Catálogo</a>
        <a href="/guia">Guía para zurdos</a>
        <a href="/ofertas">Ofertas</a>
      </nav>

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
