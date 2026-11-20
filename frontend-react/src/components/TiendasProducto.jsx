import { urlMapa } from "../utils/mapas";

/**
 * Tiendas donde se consigue el producto (HU06.3).
 * Cada tienda muestra nombre, dirección, teléfono, disponibilidad y el botón
 * «Ver en mapa», que abre la ubicación en una pestaña nueva.
 */
function TiendasProducto({ tiendas = [] }) {
  if (tiendas.length === 0) {
    return (
      <p className="empty" role="status">
        Por ahora no hay tiendas registradas para este producto.
      </p>
    );
  }

  return (
    <ul className="tiendas" aria-label="Tiendas con este producto">
      {tiendas.map((tienda) => {
        const direccion = [tienda.direccion, tienda.ciudad].filter(Boolean).join(", ");
        const telefono = tienda.telefono.replace(/[^\d+]/g, "");

        return (
          <li key={tienda.id} className="tienda">
            <div className="tienda__datos">
              <h3 className="tienda__nombre">{tienda.nombre}</h3>
              {direccion && <p className="tienda__linea">{direccion}</p>}
              {telefono && (
                <p className="tienda__linea">
                  <a href={`tel:${telefono}`}>{tienda.telefono}</a>
                </p>
              )}
              <span
                className={`estado ${tienda.disponible ? "estado--ok" : "estado--no"}`}
              >
                {tienda.disponible ? "Disponible" : "Sin existencias"}
              </span>
            </div>

            <a
              className="btn btn--acento tienda__mapa"
              href={urlMapa(tienda)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">📍</span>
              Ver en mapa
              <span className="sr">
                {" "}
                de {tienda.nombre} (se abre en una pestaña nueva)
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default TiendasProducto;
