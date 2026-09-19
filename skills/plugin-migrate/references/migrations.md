# Catálogo de migraciones conocidas

Detección y normalización, **por familia**, del contenido que versiones anteriores de SDD Devkit dejaron
con otra estructura. La detección es siempre **estructural** (comparar contra el layout de
`${PLUGIN_ROOT}/references/artifacts.md` y las plantillas vigentes de cada skill) — los artefactos no
llevan marca de versión del plugin. Las reglas transversales (conservar ids, no reescribir redacción,
confirmar antes de escribir) están en el `SKILL.md` y aplican a todas las familias.

En multi-repo, cada familia se evalúa **por repositorio** (repo de especificaciones y cada submódulo),
cada copia contra la plantilla que le corresponde.

---

## 1. Archivos del harness fuera del formato de su plantilla

**Plantillas vigentes:** `${PLUGIN_ROOT}/skills/arch-init/assets/` — `agents-template.md` (raíz) /
`agents-submodule-template.md` (submódulo), `claude-template.md`, `memory-template.md`,
`adr-index-template.md`, `standards-index-template.md`.

**Detección:** `AGENTS.md`, `CLAUDE.md`, `.agents/MEMORY.md`, `docs/adr/README.md` o
`docs/standards/README.md` existe pero es **reconociblemente el mismo archivo** (mismo propósito) con
otro formato: le faltan secciones de la plantilla, tiene otros títulos u otro orden, o perdió los
comentarios-marcador (`<!-- … -->` que `arch-manage` usa como punto de inserción en los índices).
Un archivo con un **propósito distinto** al del harness no es un hallazgo de esta familia: mostrarlo y
preguntar si fusionar, reemplazar o dejar como está.

**Normalización** — imponer la estructura de la plantilla sin perder contenido:

1. **Estructura desde la plantilla:** secciones, títulos exactos, orden y comentarios-marcador.
   Restaurar todo marcador que falte — sin ellos `arch-manage` no tiene punto de inserción.
2. **Reubicar el contenido propio** en la sección equivalente: reglas sueltas de un `AGENTS.md`
   artesanal → `# Reglas generales`; preferencias de un `MEMORY.md` propio → `## Preferencias`;
   entradas ya listadas en un índice → líneas en el formato del marcador
   (`- [ADR-XXX: Título](ADR-XXX-slug.md)` / `- [Nombre del estándar](<slug>.md)`), ordenadas por id.
3. **Excepción del stack:** si el `AGENTS.md` original ya describía el stack, ese contenido se
   **preserva** bajo `# Stack tecnológico` (reemplaza el comentario de la plantilla). Si no decía nada
   del stack, la sección queda con el comentario de la plantilla — la rellena `arch-init` en su cierre,
   nunca este skill.
4. **`CLAUDE.md`:** la plantilla vigente es un puntero (`@AGENTS.md`). Un `CLAUDE.md` artesanal cuyo
   contenido es material de `AGENTS.md` se reubica allí y el `CLAUDE.md` se reduce al puntero.
5. **Contenido sin sección equivalente:** conservarlo al final bajo un encabezado propio, nunca
   descartarlo, y mencionarlo al presentar el diff.

Si el usuario declina la normalización de un archivo, dejarlo intacto y registrar en el cierre que queda
fuera de formato — el resto del catálogo lee estos archivos por sus títulos de sección y puede no verlos.

## 2. `.sdd-devkit/settings.json` con claves de versiones anteriores

**Detección:** el archivo existe y su contenido no valida contra
`${PLUGIN_ROOT}/schemas/settings.schema.json` — típicamente por **claves obsoletas** que versiones
anteriores escribían (p. ej. `trackingEnabled` y `trackingUrl` en la raíz, que el schema vigente rechaza
por `additionalProperties: false`), o por claves obligatorias que entonces no existían.

**Normalización:** eliminar las claves que el schema rechaza y añadir las obligatorias que falten con los
valores de `${PLUGIN_ROOT}/skills/arch-init/assets/settings-template.json` — **sin tocar ningún valor
que el usuario ya fijó**. El archivo nunca se reescribe entero.

## 3. Glosario en la ruta antigua

**Detección:** existe `docs/specs/glossary.md` (ruta de versiones anteriores) y no `docs/glossary.md`.

**Normalización:** `git mv docs/specs/glossary.md docs/glossary.md` y reescribir las referencias
internas del repo que citaban la ruta antigua. Si ambos existen, no fusionar por cuenta propia:
mostrar ambos y preguntar.

## 4. Documentación técnica de capability en estructura anterior

**Estructura vigente:** `docs/architecture/[capability]/` con `README.md` (propósito, tablas índice y
Observaciones — **sin contratos ni definiciones**), `models/MD-XXX-{slug}.md`, `apis/API-XXX-{slug}.md`
(un archivo por **grupo** de endpoints de una entidad o funcionalidad, con ancla explícita de método+ruta
`<a id="post-invoices">` por operación), `flows/FL-XXX-{slug}.md`, `diagrams/DG-XXX-{slug}.md` y
`assets/`.

**Detección** (cualquiera de estas señales):

- Existe `docs/specs/technical-docs/` (ruta de versiones anteriores), con archivos o carpetas dentro.
- Existe `docs/architecture/[capability].md` como **archivo suelto**, sin carpeta.
- Una carpeta de capability define modelos, flujos o diagramas **dentro del README** (encabezados
  `### MD-…`/`### FL-…`/`### DG-…`) en vez de en sus archivos, o sus archivos no siguen
  `MD-XXX-{slug}.md` / `FL-XXX-{slug}.md` / `DG-XXX-{slug}.md`, o faltan las tablas índice.
- Las **APIs viven en el README** (encabezados `### API-XXX: …` con o sin ancla `<a id="api-xxx">`) en vez
  de en `apis/API-XXX-{slug}.md`.
- Existe `apis/` pero con **un `API-XXX` por operación** (`API-001-crear-factura.md`,
  `API-002-listar-facturas.md`) en vez de un grupo por entidad o funcionalidad, o sus operaciones no llevan
  el ancla de método+ruta.

**Normalización:** mover a `docs/architecture/[capability]/`; extraer cada modelo, flujo y diagrama a su
archivo en `models/`/`flows/`/`diagrams/`, nombrado con su **id heredado tal cual** (un `MD-01` de 2
dígitos → `MD-01-{slug}.md`; no renumerar ni rellenar a 3 dígitos) y el slug kebab-case de su nombre
vigente (congelado desde la migración); crear las tablas índice del README enlazando cada archivo;
conservar fechas y Observaciones.

**Las APIs se reagrupan**, y es el único punto donde los ids **no** se conservan uno a uno: los
`API-XXX` de la estructura anterior eran una operación cada uno, y la vigente es un archivo por **grupo**
de entidad o funcionalidad. Proponer la agrupación al usuario (por el recurso que manipula cada ruta;
`/auth/*` y similares como funcionalidad) y **confirmarla antes de escribir**; luego crear
`apis/API-XXX-{slug}.md` por grupo con ids nuevos que continúan la secuencia de la capability, mover
cada operación intacta a su grupo y darle su ancla de método+ruta sin prefijo de versión. El mapeo
`README.md#api-004` → `apis/API-001-facturas.md#post-invoices` es parte obligatoria del reporte,
porque es el que rompe enlaces entrantes. Si el hallazgo es solo un `apis/` con un archivo por operación,
la reagrupación es la misma sin mover nada de sitio.

Reescribir las referencias internas (secciones Referencias de US/TK/WI) según el mapeo y reportar el
mapeo completo — los consumidores externos al repo no se pueden reescribir desde aquí.

## 5. Historias de usuario con cabecera de versiones anteriores

**Plantilla vigente:** `${PLUGIN_ROOT}/skills/work-define/assets/user-story-template.md`.

**Detección:** el `README.md` de una US no trae alguna de las líneas vigentes de cabecera —
`**Repositorios:**`, `**INVEST:**`, `**DoR:**` — o le falta la marca parseable `<!-- us:status=… -->`.
(`**Requerimiento:**` y `**Work Item…:**` son opcionales: su ausencia no es un hallazgo.)

**Normalización:** añadir solo lo derivable del propio documento, sin inventar: `Repositorios` desde su
sección homónima si existe como sección; `INVEST` y `DoR` calculados desde las tablas de la sección
Validación (🟢 = Cumple, 🟡 = Parcial, 🔴 = No cumple, `/ total` de filas evaluadas, colores a 0
omitidos); la marca `us:status` desde la línea `**Estado:**`. `Requerimiento:` solo si el origen SRS es
rastreable (la US aparece en la tabla «Historias de usuario derivadas» de un SRS) — si no, se omite.
Lo no derivable queda como laguna reportada, para cerrarse con `work-define`.

## 6. Estándares de dominio con formato anterior

**Detección:** un `docs/standards/…` con tablas de criterios **por requisito** en vez de la tabla única
`## Criterios de cumplimiento`, sin columna `Requisito`, o con la columna `Verificación` en
`yes`/`no`/`TODO`/`N/A` en vez de **enlace o `Pending`**.

**Normalización:** consolidar en la tabla única (ids `CR-XXX` conservados); en `Verificación`, si el
chequeo del CR existe en el archivo de checks localizado por convención
(`scripts/arch/checks/<slug-estándar>.<ext>`, con el `CR-XXX` en su contenido), escribir el **enlace**
relativo a ese archivo; si no existe, `Pending`. No crear fitness functions aquí — eso es de
`arch-manage`.

## 7. Referencias internas a rutas movidas

**Detección:** tras aplicar las familias 3, 4 o 6, quedan en el repositorio citas a las rutas antiguas
(secciones Referencias de US/TK/WI, índices, prosa de documentos del proyecto).

**Normalización:** reescribirlas según el mapeo viejo → nuevo de esta corrida. Es el **último paso** de
toda migración que mueva rutas, no una familia opcional. Lo que cite esas rutas desde fuera del repo
(tracker externo, wikis) solo puede reportarse en el mapeo del cierre.
