---
id: WF-XXX
type: wireframe
status: Proposed                      # Proposed | Approved
solution_type: web                    # web | ios | android | hybrid | desktop
responsive: true                      # true | false; omitir si no aplica (apps nativas / escritorio)
origin: ../README.md                  # README.md del SRS-XXX | US-XXX | WI-XXX que origina la pantalla
related: [FR-XXX, FR-XXX]             # FR-XXX (SRS) o AC-XXX (US) que cubre la pantalla
---
<!--
Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. Las claves marcadas «omitir» se
quitan enteras cuando no aplican. No repetir ningún campo del frontmatter como línea `**Campo:**` bajo el título.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque al publicar el documento final.
Dos archivos por pantalla, en wireframes/ DENTRO DE LA CARPETA DEL ARTEFACTO que los origina
(SRS-XXX-…/wireframes/, US-XXX-…/wireframes/ o WI-XXX-…/wireframes/), nombrados con el estándar WF-XXX-{slug}:
id de 3 dígitos secuencial dentro de esa carpeta + slug kebab-case del nombre de la pantalla, fijado al crear el
wireframe; renombrar la pantalla después no renombra los archivos; el id es el contrato de enlace.
  - WF-XXX-{slug}.md  (este documento: descripción, componentes, estados, notas, historial de cambios)
  - WF-XXX-{slug}.svg (el wireframe visual, enlazado desde aquí — nunca pegado como código)
Los wireframes son un recurso del artefacto de implementación, NO documentación de arquitectura: nunca van en
docs/architecture/. Enlazar este archivo desde la tabla de wireframes del README.md del artefacto (sección 11 del
SRS; Referencias de la US o del WI) en la misma pasada. Un artefacto derivado (una US de un SRS) lo enlaza en la
carpeta de origen, no lo copia.
Lo crea SIEMPRE design-define (flujo «Wireframes» de references/flow.md), en modo delegado: lo invocan
requirement-refine (en un SRS-XXX) o work-define (en una US-XXX que toca UI y no hereda wireframes) mediante
subagente; esos skills nunca escriben este archivo ni su SVG, solo registran en su artefacto las rutas y el
estado que design-define devuelve. Es un mockup de baja/media fidelidad para validar alcance con el usuario —
no un diseño visual definitivo ni una guía de estilo. Color de marca, tipografía real y medidas pixel-perfect
no son responsabilidad de este skill; eso lo define diseño visual más adelante.
-->
# {{WF-XXX}}: {{nombre de la pantalla}}

{{Descripción, máximo 4 líneas y sin título: qué le permite hacer esta pantalla al actor, en qué contexto llega a ella y
qué ocurre al completarla; citar el/los `FR-XXX` (SRS) o `AC-XXX` (US) que cubre.}}

## Wireframe

<!--
El wireframe vive en un archivo SVG hermano, en el mismo directorio: wireframes/WF-XXX-{slug}.svg
Se ENLAZA aquí — nunca se pega el código SVG completo dentro de este documento (mismo criterio de
"enlazar, no pegar" que el resto del harness usa para archivos de apoyo).

Nivel de fidelidad — mockup visual, no solo cajas estructurales:
  - Proporciones razonablemente realistas de cada región (encabezado, navegación, contenido, acciones,
    pie) y de sus componentes (campos, botones, tarjetas, listas).
  - Contenido de ejemplo/placeholder (textos, etiquetas) — nunca el copy final.
  - Paleta en ESCALA DE GRISES para distinguir tipos de elemento (p. ej. gris claro para contenedores,
    gris medio para botones/inputs, gris oscuro o negro para texto) — sin colores de marca.
  - Tipografía genérica (sans-serif del sistema), sin especificar familia tipográfica real.
  - Etiquetas de texto dentro de cada componente indicando qué es (p. ej. "Botón: Guardar",
    "Campo: Correo electrónico") para que el propósito quede claro sin ambigüedad.

El viewBox se ajusta al **tipo de solución** declarado en la cabecera (lo resuelve el skill llamador — sección 11
del SRS o contexto de la US — y lo recibe design-define como entrada; ver references/flow.md de design-define,
«Flujo: Wireframes»):
  - App nativa / responsivo en modo móvil: retrato angosto, p. ej. `viewBox="0 0 375 812"`.
  - Aplicación web / escritorio: horizontal ancho, p. ej. `viewBox="0 0 1280 800"`.

Una pantalla compleja se divide en varios SVG (p. ej. estado vacío / estado con datos) antes que en un
solo diagrama saturado — usar la sección Estados para eso, un archivo `.svg` adicional por estado
relevante, con el mismo id y un sufijo (p. ej. `WF-XXX-{slug}-vacio.svg`).
-->
![Wireframe de {{nombre de la pantalla}}](./{{WF-XXX-slug}}.svg)

## Componentes

- {{componente}}: {{propósito y comportamiento esperado}}
- {{componente}}: {{…}}

## Estados

<!-- Sección opcional. Incluir solo si la pantalla tiene estados relevantes más allá del principal (vacío, error, carga, sin permisos). Cada estado con diferencias visuales significativas tiene su propio SVG (ver la nota sobre el viewBox y los SVG por estado); enlazarlo aquí. Eliminar la sección si no aplica. -->
- {{estado}}: {{qué cambia respecto a la pantalla principal}} — {{enlace al SVG del estado, si difiere visualmente}}

## Notas

- {{datos adicionales: navegación de entrada/salida, reglas de visibilidad por rol, validaciones visibles, decisiones de UX tomadas con el usuario; omitir la sección si no hay}}

## Historial de cambios

<!-- SOLO si hubo vueltas de revisión con el usuario. Al generar el wireframe, NO incluir esta sección (ni el encabezado ni la tabla). Se añade completa con la primera observación; una fila por observación y dónde quedó resuelta. -->
| Fecha | Observación del usuario | Resuelto en |
| ----- | ------------------------- | ------------ |
| {{YYYY-MM-DD}} | {{cambio pedido, textual}} | {{«SVG actualizado» y/o `FR-XXX`/`AC-XXX` actualizado/creado}} |
