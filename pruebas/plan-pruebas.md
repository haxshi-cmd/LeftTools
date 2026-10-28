# Plan de pruebas — T01.3.3 y T01.3.4

## T01.3.3 — Consulta de productos destacados

- [ ] Ejecutar la migración en una copia de la base y comprobar que `productos` conserva sus registros.
- [ ] Marcar 2–3 productos reales con `destacado = 1` y `estado = 'activo'`.
- [ ] Abrir `GET /api/productos/destacados` y comprobar que devuelve solo productos destacados activos y su categoría.
- [ ] Confirmar que nombre, precio, descripción, categoría, imagen y disponibilidad corresponden a la base.
- [ ] Probar la respuesta cuando ningún producto está marcado como destacado: debe devolver `{"datos":[]}`.
- [ ] Detener MariaDB o configurar credenciales incorrectas: el endpoint debe responder con error 500 sin exponer credenciales.
- [ ] Verificar que la interfaz muestra carga, estado vacío y error de conexión.
- [ ] Probar `?limite=3` y un límite superior a 24; el endpoint debe respetar el máximo.

## T01.3.4 — Visualización responsiva

Probar en las herramientas de desarrollador del navegador con estas dimensiones aproximadas:

- [ ] Escritorio: 1280 × 800; tres columnas, textos legibles y sin desbordamientos.
- [ ] Tableta: 768 × 1024; dos columnas.
- [ ] Móvil: 390 × 844; una columna compacta, imagen y texto alineados.
- [ ] Móvil estrecho: 320 × 700; no debe aparecer desplazamiento horizontal de toda la página.
- [ ] Probar nombres largos, descripciones vacías, imagen URL rota y productos agotados.
- [ ] Recorrer la página con teclado y comprobar el foco visible.
- [ ] Confirmar que el catálogo que ya existía sigue funcionando y que sus filtros no se rompen.

## Criterio de aceptación
La tarea se considera terminada cuando la API obtiene datos de la tabla existente, los estados vacío/error se muestran correctamente y el bloque se puede usar en escritorio, tableta y móvil sin desbordamientos.
