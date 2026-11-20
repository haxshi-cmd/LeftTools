# Plan de pruebas — F06 · Ficha de producto

## Puesta en marcha

1. **Base de datos.** En phpMyAdmin, base `estructuras` → pestaña SQL → ejecutar `database/002_ficha_producto.sql`.
   - Agrega `productos.utilidad_zurdos` y crea `etiquetas`, `producto_etiqueta`, `producto_imagenes`, `tiendas` y `producto_tienda`.
   - Se puede ejecutar más de una vez sin duplicar datos y no borra nada existente.
   - Requiere MariaDB (XAMPP): usa `ADD COLUMN IF NOT EXISTS`.
2. **Backend.** `cd backend` → `npm install` → `npm start` (puerto 3000).
3. **Frontend.** `cd frontend-react` → `npm install` → `npm run dev` y abrir la dirección que muestre Vite.
4. Desde el catálogo, hacer clic en cualquier tarjeta (o en una sugerencia del buscador) para abrir `#/producto/<id>`.

> Si el backend está apagado o responde con error, la ficha se arma sola con `src/data/productos.json` + `src/data/fichas.json`
> (mismo comportamiento que ya tienen el catálogo y los destacados).

## Datos que el equipo debe completar

- [ ] **Tiendas (T06.3.1).** Las 10 tiendas cargadas son **de ejemplo** (nombres genéricos, teléfonos y coordenadas aproximadas del centro de Cancún). Sustituirlas por las reales con `UPDATE tiendas ...` o desde phpMyAdmin, y ajustar `producto_tienda`.
- [ ] **Fotografías (T06.2.1).** La foto principal sale de `productos.imagen_url`. Las adicionales se agregan en `producto_imagenes` (plantilla al final del `.sql`). Con una sola foto la galería muestra solo la imagen; con dos o más aparecen flechas, miniaturas y contador.
- [ ] **Utilidad para zurdos (T06.1.3).** Los textos de `productos.utilidad_zurdos` son una primera redacción; revisarlos y ajustarlos al producto real.
- [ ] Si se cambian tiendas, etiquetas o textos en la base, replicar los cambios en `src/data/fichas.json` para que el respaldo sin backend quede igual.

## HU06.1 — Consultar información del producto

- [ ] T06.1.1 · La ficha tiene galería a la izquierda e información a la derecha en escritorio, y una sola columna en móvil.
- [ ] T06.1.2 · Se muestran nombre, precio (formato `$129.90`), categoría, marca, descripción y etiquetas.
- [ ] T06.1.2 · La etiqueta de existencias dice «Disponible», «Últimas piezas» (stock ≤ 5) o «Agotado».
- [ ] T06.1.3 · Aparece el recuadro «¿Por qué es útil para personas zurdas?» con el texto de `utilidad_zurdos`. Si el campo está vacío, el recuadro no se muestra.
- [ ] T06.1.4 · `GET http://localhost:3000/api/productos/54` devuelve la ficha completa y los datos coinciden con la base.
- [ ] `GET /api/productos/9999`, `/api/productos/abc` y `/api/productos/0` responden 404 con `{"mensaje":"Producto no encontrado."}`.
- [ ] Un producto con `estado = 'inactivo'` responde 404; uno con `estado = 'agotado'` se muestra con la etiqueta «Agotado».
- [ ] `GET /api/productos/destacados` sigue funcionando (la ruta nueva no la afecta).
- [ ] Con MariaDB detenida, la API responde 500 sin mostrar credenciales y la ficha se sigue mostrando desde el respaldo.
- [ ] `#/producto/9999` y `#/producto/abc` muestran «No encontramos este producto» con el botón «Ver el catálogo».

## HU06.2 — Visualizar fotografías

- [ ] T06.2.2 · La galería muestra la foto grande, miniaturas debajo y el contador «1 / N».
- [ ] T06.2.3 · Las flechas ‹ › y las miniaturas cambian la foto; de la última se vuelve a la primera.
- [ ] T06.2.3 · Con el foco en la galería, las teclas ← y → cambian de foto.
- [ ] T06.2.3 · Clic en la foto (o Enter) la amplía; Esc, el botón ✕ o un clic en el fondo oscuro la cierran y el foco regresa a la foto.
- [ ] T06.2.3 · Con la foto ampliada el encabezado queda cubierto y la página de fondo no se desplaza.
- [ ] T06.2.4 · Con red lenta (DevTools → Network → Slow 3G) aparece «Cargando fotografía…» y desaparece al cargar.
- [ ] T06.2.4 · Con una URL de foto rota, esa foto se descarta de la galería y el contador se ajusta. Si todas fallan aparece «Sin fotografía disponible».
- [ ] Producto con una sola foto: no aparecen flechas ni miniaturas.

## HU06.3 — Consultar tiendas disponibles

- [ ] T06.3.1 · `SELECT * FROM producto_tienda WHERE id_producto = 54;` devuelve las tiendas asociadas.
- [ ] T06.3.2 · La sección «Dónde conseguirlo» muestra nombre, dirección, teléfono y disponibilidad de cada tienda.
- [ ] T06.3.2 · Las tiendas con existencias aparecen antes que las que dicen «Sin existencias» (probar con el producto 36).
- [ ] T06.3.2 · Un producto sin tiendas muestra «Por ahora no hay tiendas registradas para este producto.»
- [ ] T06.3.3 · «Ver en mapa» abre Google Maps en una pestaña nueva, marcando las coordenadas de la tienda (o buscando por dirección si no tiene coordenadas).
- [ ] T06.3.3 · El botón «Dónde comprarlo» baja hasta la sección de tiendas.
- [ ] T06.3.4 · Comparar tres productos de categorías distintas y confirmar que cada uno muestra únicamente sus tiendas.

## HU06.4 — Compartir un producto

- [ ] T06.4.1 · El botón «Compartir» abre un panel con el enlace; Esc lo cierra.
- [ ] T06.4.2 · El enlace tiene la forma `http://<sitio>/#/producto/<id>` y corresponde al producto abierto.
- [ ] T06.4.2 · «Copiar enlace» copia al portapapeles y muestra «Enlace copiado al portapapeles.»
- [ ] T06.4.2 · «WhatsApp» y «Correo» abren con el mensaje y el enlace ya escritos. En celular aparece además «Otras aplicaciones…» (menú nativo).
- [ ] T06.4.3 · Pegar el enlace copiado en una pestaña nueva (y en una ventana de incógnito) abre la misma ficha.
- [ ] T06.4.3 · Probar el enlace desde otro dispositivo de la misma red (usando la IP del equipo en lugar de `localhost`).

## Navegación y compatibilidad

- [ ] Clic en cualquier parte de una tarjeta (foto, nombre o precio) del catálogo, de los destacados y de los resultados abre su ficha.
- [ ] Clic en una sugerencia del buscador abre la ficha y cierra el desplegable.
- [ ] Con teclado: Tab llega al nombre de la tarjeta (se ve el aro de foco) y Enter abre la ficha.
- [ ] Botón «Atrás» del navegador regresa al catálogo.
- [ ] Al abrir una ficha desde un catálogo desplazado hacia abajo, la ficha empieza arriba.
- [ ] El título de la pestaña muestra «<producto> · LeftTools».

## Visualización responsiva

Probar en las herramientas de desarrollador con estas dimensiones:

- [ ] Escritorio 1280 × 800: dos columnas; la galería queda fija al desplazarse.
- [ ] Tableta 768 × 1024: una columna, sin desbordamientos.
- [ ] Móvil 390 × 844: una columna; botones de ancho completo.
- [ ] Móvil estrecho 320 × 700 (también con el panel de compartir abierto): sin desplazamiento horizontal.
- [ ] Nombre de producto muy largo y descripción vacía: el diseño no se rompe.

## Criterio de aceptación

La tarea se considera terminada cuando la ficha obtiene sus datos de la base (con respaldo si el backend está apagado), la galería, las tiendas con «Ver en mapa» y el enlace para compartir funcionan en escritorio, tableta y móvil, y el catálogo, los destacados y el buscador existentes siguen funcionando.
