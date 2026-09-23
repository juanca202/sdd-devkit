---
name: plugin-migrate
description: >-
  Normalizar contenido producido con versiones anteriores del plugin SDD Devkit a la estructura vigente: archivos del harness fuera del formato de su plantilla (AGENTS.md, .agents/MEMORY.md, índices de ADR/estándares), CLAUDE.md heredado que ya no forma parte del harness, settings.json con claves obsoletas (incluidas basePath/archivePath, hoy changesPath/currentPath/archivedPath) y el layout anterior de docs/specs/ (user-stories, work-items, features y docs/archive directamente bajo docs/) que se mueve a changes/, current/ y archived/, glosario en la ruta antigua, documentación técnica en docs/specs/technical-docs/ o como archivo único de capability, cabeceras de US sin sus líneas vigentes, y estándares con la columna Verificación en yes/no. Detecta por estructura, propone un plan, aplica con confirmación conservando ids y redacción del usuario, actualiza las referencias internas afectadas y reporta el mapeo viejo → nuevo. Activar cuando el usuario pida migrar, normalizar o actualizar el contenido del proyecto tras actualizar el plugin, mencione «plugin-migrate», o cuando otro skill del catálogo detecte contenido con estructura de una versión anterior — los demás skills no migran nada: derivan aquí.
license: MIT
---

# Skill: Normalizar contenido de versiones anteriores del plugin

Este skill es el **único dueño de las migraciones** del contenido que una versión anterior de SDD Devkit dejó en un proyecto: estructura de carpetas, formato de plantillas y convenciones que cambiaron entre versiones. El resto del catálogo trabaja **solo sobre la estructura vigente**; cuando un skill encuentra contenido con estructura de una versión anterior, no lo migra — se detiene en ese hallazgo y deriva aquí.

> **Alcance: estructura, no contenido.** Este skill mueve, renombra y reformatea; **nunca** reescribe la redacción del usuario, renumera identificadores, rellena lagunas ni inventa contenido nuevo. Crear o completar artefactos y documentación es de cada skill dueño (`work-define`, `design-define`, `arch-manage`…). Lo que no se pueda normalizar sin inventar, se reporta y queda como está.

El catálogo de migraciones conocidas —qué se detecta y cómo se normaliza, familia por familia— está en [`references/migrations.md`](references/migrations.md): **leerlo completo antes de escanear**.

## Mapa de referencias

| Necesitas… | Archivo |
| ---------- | ------- |
| Catálogo de migraciones conocidas: detección estructural y normalización por familia, con sus reglas específicas | [`references/migrations.md`](references/migrations.md) |

### Referencias compartidas del plugin

Reglas transversales del catálogo; viven en la raíz del plugin, no en este skill.

- [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md): **Idioma** — resolución obligatoria del idioma de artefactos y mensajes. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md): **Artefactos** — layout vigente del harness, identificadores, archivado. *Es la definición de «estructura vigente» contra la que se detecta.*
- [`${PLUGIN_ROOT}/references/asking.md`](../../references/asking.md): **Preguntas estructuradas** — mecanismo y ritmo para proponer el plan y pedir confirmación.

## Rutas de las referencias compartidas

`${PLUGIN_ROOT}` es la **raíz del plugin instalado** (la carpeta que contiene `skills/`, `agents/` y `references/`), y toda referencia compartida de este skill se escribe como `${PLUGIN_ROOT}/references/<archivo>.md`. Para resolverla: la raíz es la **carpeta desde la que se cargó este archivo**, dos niveles arriba (`<raíz>/skills/<nombre>/SKILL.md`) — el cliente anuncia esa ubicación al invocar el skill (p. ej. «Base directory for this skill: …»). Si esa ubicación no está disponible, localizar la instalación buscando el manifiesto del plugin: `PLUGIN_ROOT="$(dirname "$(grep -rl '\"name\": *\"sdd-devkit\"' "$HOME/.claude/plugins" --include=plugin.json 2>/dev/null | head -1)")"`. En ambos casos, **verificar antes de usarla** que `$PLUGIN_ROOT/references/language.md` existe. El destino de cada enlace markdown (`../../references/…`) existe solo para navegar el repositorio en GitHub o en un editor: **no** resolverlo desde el directorio de trabajo. **Nunca buscar `references/` en el proyecto**: un `<proyecto>/references/language.md` que no existe no es un archivo que falte, es una ruta mal resuelta — corregir la raíz y volver a leer, sin preguntar al usuario ni saltarse la lectura.

## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos, documentos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

## Modos de invocación

| Modo | Quién invoca | Alcance |
| ---- | ------------ | ------- |
| **Directo** | El usuario («migra el proyecto», «normaliza esto al formato nuevo del plugin») | Escaneo completo: todas las detecciones del catálogo sobre el proyecto |
| **Derivado** | Otro skill que detectó contenido de una versión anterior y sugirió o delegó la normalización | Acotado al hallazgo que lo motivó; al cerrar, ofrecer el escaneo completo por si hay más contenido en el mismo estado |

## Flujo

1. **Escanear.** Recorrer las detecciones de [`references/migrations.md`](references/migrations.md) sobre el proyecto (o sobre el alcance derivado). La detección es **estructural** — los artefactos no llevan marca de versión del plugin: se compara lo que hay contra el layout y las plantillas vigentes. En multi-repo, el escaneo cubre el repositorio de especificaciones y cada submódulo, cada copia contra la plantilla que le corresponde.
2. **Proponer el plan.** Presentar los hallazgos con la herramienta de preguntas estructuradas, en **una sola tanda**: qué se encontró, qué se haría y qué rutas cambian. Nada se escribe sin aprobación; el usuario puede aprobar unas familias y declinar otras.
3. **Aplicar lo aprobado**, familia por familia, con las [reglas invariantes](#reglas-invariantes) de abajo. Mostrar el diff (o el antes/después cuando es corto) de cada archivo migrado.
4. **Actualizar las referencias internas.** Toda ruta movida deja citas atrás: buscar en el repositorio las referencias a las rutas antiguas y reescribirlas según el mapeo aplicado. Lo que no se pueda reescribir automáticamente (consumidores fuera del repo, trackers externos) va al reporte como mapeo viejo → nuevo.
5. **Cierre.** Resumen: qué se normalizó, qué declinó el usuario (anotando la consecuencia: el resto del catálogo puede no leerlo bien), el mapeo de rutas, y los pendientes que exigen a un skill dueño (lagunas de contenido que este skill no rellena). Verificación de idempotencia: re-ejecutar la detección sobre lo migrado no debe arrojar hallazgos.

## Reglas invariantes

- **Los identificadores se conservan tal cual.** Nunca renumerar ni cambiar el formato de un id ya emitido: un `MD-01` heredado de 2 dígitos sigue siendo `MD-01` (su archivo, `MD-01-{slug}.md`); un `AC-XXX`, `CR-XXX` o `ADR-XXX` existente no se toca. Los ids son contratos de enlace de los consumidores.
- **Imponer la estructura sin perder contenido.** Migrar es reubicar el contenido del usuario en la estructura de la plantilla vigente — no resumirlo, reformularlo ni traducirlo. Contenido sin sección equivalente: conservarlo al final del archivo bajo un encabezado propio y mencionarlo en el diff.
- **Confirmar antes de escribir.** Todo cambio se muestra (diff o antes/después) y se aprueba; las confirmaciones se agrupan en una sola tanda, no una pregunta por archivo.
- **No completar contenido.** Una sección que la plantilla exige y el original no trae queda con el marcador de la plantilla, no se redacta aquí — la rellena el skill dueño (p. ej. el stack de `AGENTS.md` lo escribe `arch-init` en su cierre).
- **Preservar el historial.** En un repo git, mover con `git mv`; no hacer commit — el primer commit queda para `git-commit` a pedido del usuario.

## Anti-patrones

- Migrar sin mostrar el plan y obtener confirmación, o preguntar archivo por archivo en vez de agrupar en una tanda.
- Reescribir, resumir o traducir la redacción del usuario al reubicarla — migrar es mover, no reeditar.
- Renumerar o re-formatear identificadores heredados «para que queden como los nuevos».
- Rellenar durante la migración contenido que falta (stack, criterios, descripciones) — eso es de cada skill dueño.
- Migrar desde otro skill del catálogo: los demás skills detectan y derivan aquí; la lógica de migración vive solo en este skill.
- Dejar referencias internas apuntando a rutas movidas sin reescribirlas, o mover rutas sin reportar el mapeo viejo → nuevo.
- Volver a proponer una migración que el usuario ya declinó en esta misma invocación.

## Mensaje al usuario

Solo resultados y decisiones pendientes: qué se detectó, qué se migró, el mapeo de rutas y lo que quedó fuera (con su consecuencia). No narrar el escaneo ni la maquinaria interna.
