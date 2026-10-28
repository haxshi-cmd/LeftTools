(() => {
  "use strict";

  const API = "http://localhost:3000/api/productos/destacados";
  const grid = document.querySelector("#destacados-grid");
  const estado = document.querySelector("#destacados-estado");

  if (!grid || !estado) return;

  const dinero = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  });

  function crearTarjeta(producto) {
    const li = document.createElement("li");
    li.className = "destacado-card";

    const imagen = document.createElement("div");
    imagen.className = "destacado-card__imagen";

    if (producto.imagen_url) {
      const img = document.createElement("img");
      img.src = producto.imagen_url;
      img.alt = producto.nombre || "Producto destacado";
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
        imagen.textContent = "✦";
        imagen.setAttribute("aria-hidden", "true");
      };
      imagen.appendChild(img);
    } else {
      imagen.textContent = "✦";
      imagen.setAttribute("aria-hidden", "true");
    }

    const contenido = document.createElement("div");
    contenido.className = "destacado-card__contenido";

    const categoria = document.createElement("p");
    categoria.className = "destacado-card__categoria";
    categoria.textContent = producto.categoria || "Producto";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre || "Producto sin nombre";

    const descripcion = document.createElement("p");
    descripcion.className = "destacado-card__descripcion";
    descripcion.textContent = producto.descripcion || "Consulta los detalles del producto.";

    const pie = document.createElement("div");
    pie.className = "destacado-card__pie";

    const precio = document.createElement("strong");
    precio.textContent = dinero.format(Number(producto.precio) || 0);

    const disponibilidad = document.createElement("span");
    disponibilidad.className = "destacado-card__stock";
    disponibilidad.textContent = Number(producto.stock) > 0 ? "Disponible" : "Agotado";

    pie.append(precio, disponibilidad);
    contenido.append(categoria, nombre, descripcion, pie);
    li.append(imagen, contenido);
    return li;
  }

  async function cargarDestacados() {
    estado.textContent = "Cargando productos destacados…";
    grid.replaceChildren();

    try {
      const respuesta = await fetch(API);
      if (!respuesta.ok) throw new Error("La API devolvió un error.");

      const resultado = await respuesta.json();
      const productos = Array.isArray(resultado.datos) ? resultado.datos : [];

      if (productos.length === 0) {
        estado.textContent = "Todavía no hay productos destacados. Vuelve pronto.";
        return;
      }

      grid.append(...productos.map(crearTarjeta));
      estado.textContent = `${productos.length} ${productos.length === 1 ? "producto destacado" : "productos destacados"}`;
    } catch (error) {
      console.error("No se pudieron cargar los productos destacados:", error);
      estado.textContent = "No pudimos cargar los productos destacados. Comprueba tu conexión e inténtalo de nuevo.";
    }
  }

  cargarDestacados();
})();
