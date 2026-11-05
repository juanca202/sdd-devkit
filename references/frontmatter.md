# Frontmatter de los artefactos — base común

Referencia transversal del plugin **SDD Devkit**. Fija cómo se declara la **cabecera** de todo artefacto
documental del harness (historias, tareas, work items, incidentes, casos de prueba, requerimientos,
investigaciones, wireframes, partes de progreso): un bloque **YAML frontmatter** al inicio del archivo, con
**claves y valores enumerados en inglés**. Es lo que leen los demás skills; sustituye a la antigua cabecera
visible (`**Estado:**`, `**Fecha de creación:**`, …) y a la marca oculta `<!-- <prefijo>:status=… -->`, que
**ya no existen** en ningún artefacto vigente.

## La regla

- **Primera línea del archivo.** El bloque abre con `---` en la línea 1 y cierra con `---`; nada antes (ni
  comentarios ni líneas en blanco). Después del cierre va el título `# <ID>: <título>` y el cuerpo.
- **YAML válido.** Claves `snake_case`, un valor por clave, listas `[a, b]` o con viñetas, objetos anidados
  con sangría. Nunca `{{placeholders}}` dentro del bloque: `{{` no es YAML. Una plantilla muestra valores de
  ejemplo y las opciones en un comentario `# …` al final de la línea; al publicar se sustituye el ejemplo y
  se puede borrar el comentario. Un texto con `:`, `#`, `[` o comillas se entrecomilla (`"…"`).
- **Claves y valores enumerados en inglés, siempre.** `status: Ready`, `priority: High`,
  `perspective: Boundary`, `kind: bug-fix`. Son identificadores, no contenido: no se traducen aunque el idioma
  resuelto por [`language.md`](language.md) sea otro. Los valores de **texto libre** (`definition_owner`,
  `business_approval`, `environment`, `timebox`…) sí van en el idioma resuelto, igual que el cuerpo.
- **Las claves opcionales se omiten**, no se dejan vacías ni en `null`. Una clave presente tiene valor.
- **Rutas relativas a la carpeta del archivo**, sin enlace markdown: `story: ../README.md`,
  `requirement: ../../requirements/SRS-003-pagos/README.md`. En el cuerpo esas mismas rutas sí se escriben
  como enlace ([`linking.md`](linking.md)); el frontmatter es para máquinas.
- **Fechas** `YYYY-MM-DD`; con hora, `"YYYY-MM-DD HH:mm"` entre comillas.
- **El frontmatter es la única fuente de la cabecera.** Ningún artefacto repite sus campos como líneas
  `**Campo:**` bajo el título. Lo que una persona necesita leer de la cabecera lo lee ahí; lo que otro skill
  necesita comparar, también.
- **Se conserva al publicar y al sincronizar.** Al subir un artefacto a un tracker (`sync … push`) el
  frontmatter se mapea campo a campo según la referencia del proveedor; al bajarlo, se regenera desde los
  campos del work item. Nunca se pega literal en la descripción del work item.

## Claves comunes

| Clave | Valor | En qué artefactos |
|-------|-------|-------------------|
| `id` | Identificador del artefacto: `US-XXX`, `TK-XXX`, `WI-XXX`, `BUG-XXX`, `TC-XXX`, `SRS-XXX`, `PRD-XXX`, `RQ-XXX`, `FT-XXX`, `RS-XXX`, `WF-XXX` | Todos los que tienen id propio; los archivos secundarios de una carpeta (`discovery.md`, `validation.md`, `progress.md`, `story-validation.md`) no lo llevan |
| `type` | Tipo del artefacto: `user-story` · `task` · `work-item` · `incident` · `test-case` · `srs` · `prd` · `rq` · `feature` · `research` · `discovery` · `validation` · `diagnosis` · `wireframe` · `progress` · `test-automation` · `story-validation` | Todos. Sustituye al prefijo de la antigua marca (`us:`, `tk:`, `wi:`…) |
| `status` | Estado del artefacto. `Draft` · `Ready` en la mayoría; `Draft` · `Ready` · `Obsolete` en un TC; `Proposed` · `Approved` en un WF; `Pending` · `In Progress` · `Done` en `progress.md` y `test-cases-automation.md` | Todos |
| `created` / `updated` | Fecha de creación y de última actualización | Donde la plantilla los define |
| `repository` / `repositories` | Nombre git del repositorio (o lista, en una US) | TK, WI, BUG, US |
| `assignee` | Persona asignada (`git config user.name` si no se indica) | TK, WI |
| `created_by` / `reported_by` | Autor del documento / del reporte | RS, discovery, diagnosis, TC, BUG |
| `work_item` | Objeto `{ system, id, url }` con el work item del gestor de proyectos vinculado: `system` es el nombre corto que define la referencia del proveedor (p. ej. `ADO`), `id` el identificador en el tracker, `url` el enlace. Se omite entero si no hay tracker o no se creó el work item | US, TK, WI, BUG, TC, RQ, FT, diagnosis |

Las claves propias de cada tipo (`invest`, `dor`, `kind`, `test_type`, `perspective`, `priority`,
`severity`, `reproducibility`, `timebox`, `resolution`…) y sus valores admitidos están en la **plantilla**
de cada artefacto, que es la fuente normativa; esta referencia solo fija el mecanismo.

## Cómo lo lee un consumidor

Un skill que necesita el estado, el tipo o cualquier campo de cabecera de un artefacto **parsea el
frontmatter**: abre el archivo, toma el bloque entre el primer `---` y el siguiente `---`, y lee la clave.
Nunca busca una línea `**Estado:**` ni un comentario HTML: no existen. Lo que se compara es el **valor**
(`status == Ready`), estable en cualquier idioma.

Un artefacto **sin frontmatter** (o cuyo frontmatter no abre en la línea 1) es contenido de una versión
anterior del plugin: el skill se detiene en ese hallazgo y deriva a `/plugin-migrate`, que es el único que lo
normaliza (ver [`../skills/plugin-migrate/references/migrations.md`](../skills/plugin-migrate/references/migrations.md)).

## Lo que no cambia

- Los **informes con veredicto** (`quality-check`, `code-review`, `coverage-verify`, `arch-audit`,
  `spike-report`) siguen llevando su **marca oculta** al pie, con `verdict=…`: es el contrato de las puertas
  de cierre y lo define [`verdicts.md`](verdicts.md). Esta referencia no los toca.
- Los **estándares** de `docs/standards/` ya tenían frontmatter (`arch-manage`); el `**Estado:**` de cada
  bloque `## <Requisito>` es un campo del cuerpo, no de la cabecera, y se conserva.
- Las **secciones por unidad** de `progress.md` y `test-cases-automation.md` (una por `TK-XXX`/`TC-XXX`
  implementado) siguen siendo secciones del cuerpo con su propia marca `<!-- unit:id=… · status=… -->`:
  el frontmatter describe el documento, no cada unidad.
- Las etiquetas visibles del **cuerpo** (títulos de sección, celdas de tablas, `**Veredicto:**` de un
  informe) siguen en el idioma resuelto, y sus valores enumerados siguen en inglés, como dice
  [`verdicts.md`](verdicts.md).
