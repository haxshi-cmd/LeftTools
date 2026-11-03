
function Header() {
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
        <button className="btn">
          Interfaz: zurda
        </button>

        <button className="btn">
          🌙
        </button>
      </div>
    </header>
  );
}

export default Header;