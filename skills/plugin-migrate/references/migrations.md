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

**Estructura vigente:** `docs/architecture/[capability]/` con `README.md` (propósito, APIs `API-XXX`
con ancla explícita `<a id="api-xxx">`, tablas índice), `models/MD-XXX-{slug}.md`,
`flows/FL-XXX-{slug}.md`, `diagrams/DG-XXX-{slug}.md` y `assets/`.

**Detección** (cualquiera de estas señales):

- Existe `docs/specs/technical-docs/` (ruta de versiones anteriores), con archivos o carpetas dentro.
- Existe `docs/architecture/[capability].md` como **archivo suelto**, sin carpeta.
- Una carpeta de capability define modelos, flujos o diagramas **dentro del README** (encabezados
  `### MD-…`/`### FL-…`/`### DG-…`) en vez de en sus archivos, o sus archivos no siguen
  `MD-XXX-{slug}.md` / `FL-XXX-{slug}.md` / `DG-XXX-{slug}.md`, o faltan las tablas índice.
- APIs del README sin su ancla explícita `<a id="…">`.

**Normalización:** mover a `docs/architecture/[capability]/`; extraer cada modelo, flujo y diagrama a su
archivo en `models/`/`flows/`/`diagrams/`, nombrado con su **id heredado tal cual** (un `MD-01` de 2
dígitos → `MD-01-{slug}.md`; no renumerar ni rellenar a 3 dígitos) y el slug kebab-case de su nombre
vigente (congelado desde la migración); crear las tablas índice del README enlazando cada archivo;
añadir a las APIs las anclas que falten; conservar fechas y Observaciones. Reescribir las referencias
internas (secciones Referencias de US/TK/WI) según el mapeo y reportar el mapeo completo — los
consumidores externos al repo no se pueden reescribir desde aquí.

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
