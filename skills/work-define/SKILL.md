---
name: work-define
description: >-
  Crear o actualizar Historias de Usuario (US-XXX). Activar cuando el usuario pida una historia de usuario nueva, describa una funcionalidad o necesidad de negocio concreta que deba documentarse como historia, quiera crear varias historias relacionadas a la vez, o pida actualizar, estandarizar o alinear historias existentes a las convenciones del proyecto. Activar también para descomponer en historias un SRS-XXX terminado por /requirement-refine («arma las historias del SRS-003»): agrupa FR-XXX/NFR-XXX en historias y hereda repos, wireframes y criterios; y, con integración de gestor de proyectos activa, para sincronizar una historia que ya existe en el tracker con el modificador explícito `sync #id` («sincroniza la historia #4821 de Azure», «trae la US 4821 de ADO») — crea la US local si no existe o la actualiza si ya existe; un `#id` o URL sin modificador NO sincroniza nada: se pregunta; y para archivar historias («archiva la US-042», «archiva las historias ya implementadas») con el modificador `archive`, que muestra el estado real y pide confirmación; la entrada por defecto sigue siendo la necesidad descrita directamente. NO activar para redactar, refinar o decidir el contenido de un SRS o de sus requisitos funcionales/no funcionales (eso corresponde a /requirement-refine), ni para registrar bugs, incidentes o work items de mantenimiento, ni para implementar o planificar tareas TK-XXX. El ID de una US archivada sigue ocupado; una US archivada no se actualiza sin desarchivarla.
license: MIT
---

# Skill: Historia de usuario

Guía para **crear o actualizar** historias de usuario en el repo del producto.

> **Alcance de una US:** El `README.md` es un documento **funcional**. Registra el valor para el usuario, los **criterios de aceptación** (lista plana con ids `AC-XXX`, categoría entre paréntesis y enunciado RFC 2119) y el estado de avance. El detalle de implementación (DTOs, endpoints, esquemas) va en `docs/architecture/` — creado y mantenido por el skill **`design-define`**, nunca directamente desde aquí — o en tareas `TK-XXX`, nunca en la narrativa de la historia. Los documentos técnicos **no son parte de la descripción funcional**; se enlazan desde la sección Referencias de la US y pueden citarse para justificar criterios de INVEST o condiciones del DoR.

La plantilla canónica está en `assets/user-story-template.md` (léela antes de escribir cualquier US).

## Mapa de referencias

Carga el archivo correspondiente cuando vayas a ejecutar la tarea; el detalle íntegro vive en `references/`.

| Necesitas… | Archivo |
| ---------- | ------- |
| Flujo paso a paso de **crear** y **actualizar**, cómo preguntar al usuario, validación antes de crear, checklist completo, ejemplos, anti-patrones y handoffs del ciclo | [`references/flow.md`](references/flow.md) |
| Cómo **descomponer un `SRS-XXX`** de `/requirement-refine` en una o más historias (mapeo `FR-XXX`/`NFR-XXX` → `AC-XXX`, herencia de repos/wireframes `WF-XXX` de la capability, escritura de vuelta en el SRS) — entrada alternativa, no la habitual | [`references/flow.md`](references/flow.md#flujo-descomponer-un-srs-xxx-en-historias) |
| Cómo ordenar y encadenar IDs al proponer **varias historias en una misma invocación** (SRS descompuesto, migración descompuesta, o varias funcionalidades relacionadas pedidas juntas) | [`references/flow.md`](references/flow.md#flujo-proponer-varias-historias-en-una-misma-invocación) |
| Detalle de **RFC 2119** (tabla de modalidades), **ISO 25010** (categorías de criterios de aceptación no funcionales), rúbrica **INVEST** y **DoR** ampliado | [`references/quality-criteria.md`](references/quality-criteria.md) |
| **Sincronizar** una historia desde el gestor de proyectos (`sync #id`): la crea localmente si no existe o la actualiza si ya existe — solo con integración activa | [`references/flow.md`](references/flow.md#flujo-sincronizar-una-historia-desde-el-gestor-de-proyectos-sync) y, por proveedor, [`references/azure-devops.md`](references/azure-devops.md) |
| Estructura del `README.md` de una US | [`assets/user-story-template.md`](assets/user-story-template.md) |


### Referencias compartidas del plugin

Reglas transversales del catálogo; viven en la raíz del plugin, no en este skill.

- [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md): **Idioma** — resolución obligatoria del idioma de artefactos, documentos y mensajes. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md): **Artefactos** — rutas del harness, identificadores, archivado. *Al resolver una ruta o calcular un ID.*
- [`${PLUGIN_ROOT}/references/planning.md`](../../references/planning.md): **Política de planificación** — si se pregunta, se invoca automáticamente o nunca se sugiere `test-define` al dejar la US en Ready. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/project-management.md`](../../references/project-management.md): **Gestor de proyectos** — si la integración está activa, proveedor y datos de conexión. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/project-managers/azure-devops.md`](../../references/project-managers/azure-devops.md): **Azure DevOps** — MCP, URL, campo `Work Item (ADO)`, normalización del HTML. *Solo si el `provider` resuelto es `azure-devops` y se usa `sync`.*

---

## Rutas de las referencias compartidas

`${PLUGIN_ROOT}` es la **raíz del plugin instalado** (la carpeta que contiene `skills/`, `agents/` y `references/`), y toda referencia compartida de este skill se escribe como `${PLUGIN_ROOT}/references/<archivo>.md`. Para resolverla: la raíz es la **carpeta desde la que se cargó este archivo**, dos niveles arriba (`<raíz>/skills/<nombre>/SKILL.md`) — el cliente anuncia esa ubicación al invocar el skill (p. ej. «Base directory for this skill: …»). Si esa ubicación no está disponible, localizar la instalación buscando el manifiesto del plugin: `PLUGIN_ROOT="$(dirname "$(grep -rl '\"name\": *\"sdd-devkit\"' "$HOME/.claude/plugins" --include=plugin.json 2>/dev/null | head -1)")"`. En ambos casos, **verificar antes de usarla** que `$PLUGIN_ROOT/references/language.md` existe. El destino de cada enlace markdown (`../../references/…`) existe solo para navegar el repositorio en GitHub o en un editor: **no** resolverlo desde el directorio de trabajo. **Nunca buscar `references/` en el proyecto**: un `<proyecto>/references/language.md` que no existe no es un archivo que falte, es una ruta mal resuelta — corregir la raíz y volver a leer, sin preguntar al usuario ni saltarse la lectura.

## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos, documentos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

---

## Política de planificación

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/planning.md`](../../references/planning.md).

Las reglas de `planning.md` son obligatorias y determinan, vía `specification.testCases.createMode`, si al dejar la US en `Ready` se pregunta si definir los casos de prueba (`ask`, comportamiento por defecto), se invoca `/test-define` automáticamente sin preguntar (`always`), o nunca se sugiere ni se invoca (`never`). La otra clave del objeto, `createDetailsMode`, **no la consume este skill**: la lee `test-define`. Ver [Flujo (resumen)](#flujo-resumen).

No continúes hasta haber leído y aplicado `planning.md`.

---

## Resolución de la integración con el gestor de proyectos

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/project-management.md`](../../references/project-management.md).

Las reglas de `project-management.md` son obligatorias y tienen prioridad para determinar si hay integración con un gestor de proyectos, con qué proveedor y con qué datos de conexión.

No continúes hasta haber leído y aplicado `project-management.md`.

**Delta de este skill:** la integración **solo lee** — `work-define` nunca crea ni modifica work items — y solo aplica al modificador `sync` (ver [Modificadores de invocación](#modificadores-de-invocación)). Los flujos de crear, actualizar y descomponer un SRS no cambian con la integración activa: una US redactada aquí sigue teniendo secuencial local y su campo `Work Item` se rellena a mano si el usuario lo aporta.

- **Desactivada** → `sync` no está disponible: si el usuario lo pide, parar e informar que el repo no está vinculado a un gestor de proyectos (`projectManagement` en `.sdd-devkit/settings.json`); no leer ninguna referencia de proveedor.
- **Activada** → además de la referencia compartida del proveedor, cargar `references/<proveedor>.md` de este skill (p. ej. [`references/azure-devops.md`](references/azure-devops.md)) y seguir **únicamente** sus pasos para leer y mapear el work item. Si este skill no tiene referencia para ese proveedor, informar al usuario y ofrecer que pegue el contenido.

Todo el detalle propio de cada proveedor (herramienta MCP, campos, tipos de work item) vive exclusivamente en esos archivos.

---

## Modificadores de invocación

Las **claves** son en inglés (estándar); el usuario puede nombrarlas en español («importa», «trae de Azure», «sincroniza con ADO», «archiva») y se mapean. **Sin modificador, el skill redacta**: crear, actualizar o descomponer un SRS, como siempre.

| Modificador | Efecto |
|-------------|--------|
| `sync <#id \| URL \| US-XXX> [<#id> …]` | **Sincronizar** desde el gestor de proyectos. Si la historia **no existe** localmente, la crea: `US-<id>-[slug]/README.md` bajo `changesPath/user-stories/` con el `id` del tracker como número, el campo `Work Item (<Sistema>)` y los criterios con identificador. Si **ya existe**, la actualiza: diff por sección, se aplica solo lo confirmado, `AC-XXX` inmutables. Varias a la vez → una sola tanda de confirmación. Dirección única tracker → repo. Ver [flujo](references/flow.md#flujo-sincronizar-una-historia-desde-el-gestor-de-proyectos-sync). |

| `archive [<US-XXX> …]` | **Archivar** historias: las indicadas (estén como estén) o, sin ID, todas las ya completas. Ver [Modificador `archive`](#modificador-archive-archivar-historias-de-usuario-us-xxx). |

> **Un `#id` o una URL de work item sin modificador nunca dispara una sincronización ni sirve de número para una US nueva.** Si la entrada trae algo que parece un identificador del tracker, o palabras como «importa», «trae», «sincroniza», «la historia de Azure/ADO», **preguntar** (herramienta estructurada) antes de hacer nada: Opciones: [Sincronizar #<id> desde <Sistema>] / [Crear una historia nueva (el número es solo contexto)]. Con integración desactivada, la pregunta se reduce a confirmar que se crea una historia nueva.

---

## Modificador `archive` (archivar historias de usuario `US-XXX`)

**Archiva este skill, no los de cierre.** `work-integrate` y `pr-create` no archivan: siempre hay una revisión humana antes, y el usuario lo pide aquí cuando decide. Procedimiento, destinos, reglas de confirmación y contrato para el resto del catálogo: [`${PLUGIN_ROOT}/references/archive.md`](../../references/archive.md) — leerlo antes de mover nada.

| Invocación | Alcance |
|------------|---------|
| `/work-define archive US-XXX` · `/work-define US-XXX archive` (uno o varios IDs; el orden es indiferente) | Los artefactos indicados, **estén como estén**. |
| `/work-define archive` (sin ID) | **Todos** los `US-XXX` de `<changesPath>/user-stories/` que ya estén **completos**; los incompletos se listan aparte con su estado y no se mueven. |

Reglas que este skill aplica al archivar:

- **El estado no restringe, pero se informa.** Antes de preguntar, componer el parte de estado: `Estado` del `README.md`; `progress.md` (estado del trabajo y de cada `TK-XXX`); `criteria-coverage.md` (veredicto); `TK-XXX` o `TC-XXX` en `Draft`; y, si la rama base es conocida, si `feature/US-XXX-*` ya está integrada. Con algo incompleto, la pregunta lo dice explícitamente y el usuario decide.
- **Siempre se confirma** (herramienta estructurada, una sola tanda para todo el lote), mostrando origen → destino de cada carpeta y las investigaciones sueltas que quedarían huérfanas. Sin canal de respuesta, no se archiva.
- **Destino:** `<archivedPath>/user-stories/<ID>-<slug>/`, con `<archivedPath>` = `specification.archivedPath` de `.sdd-devkit/settings.json` (por defecto `docs/specs/archived/`) y la subcarpeta espejo de `<changesPath>`. `git mv`, guard de destino, reparación de enlaces y cierre con `/git-commit`, tal como describe la referencia.
- Un artefacto ya bajo `<archivedPath>` se informa y no se toca; un ID suelto **sin** `archive` nunca archiva.

---

## Ubicación de archivos

Layout completo del harness, identificadores y contrato de archivado: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md).

Lo propio de este skill:

| Artefacto | Ruta |
| --------- | ---- |
| Historia de usuario (**salida**) | `<changesPath>/user-stories/US-XXX-[nombre-corto]/README.md` |
| Archivos de apoyo | `<changesPath>/user-stories/US-XXX-[nombre-corto]/assets/` |
| Wireframes de pantalla (si la US toca UI y no hereda wireframes) | `docs/architecture/[capability]/wireframes/WF-XXX-[pantalla-slug].md` + `WF-XXX-[pantalla-slug].svg` — **por capability**, no en `assets/` de la US; mismo principio que `models/`/`diagrams/`; con fila en el índice «Wireframes» del `README.md` de la capability; plantilla [`${PLUGIN_ROOT}/skills/design-define/assets/wireframe-template.md`](../design-define/assets/wireframe-template.md). Única escritura de este skill en `docs/architecture/` |
| Documentación técnica (solo lectura) | `docs/architecture/[capability]/` — `README.md`, `models/`, `flows/`, `diagrams/`; propiedad de `design-define`; este skill la referencia, nunca la crea ni la edita |
| Glosario (opcional) | `docs/glossary.md` |

> **Las US archivadas siguen contando.** El siguiente `US-XXX` libre se calcula sobre la ruta activa **y** sobre `<archivedPath>/user-stories/`, y el flujo *Actualizar* busca ahí la historia cuando no está en la activa.

### Convenciones del nombre de carpeta

> Reglas comunes de slug e identificadores: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md). Lo específico de las US:

- Formato: `US-XXX-[nombre-corto]` con `US-XXX` en mayúsculas y número de 3 dígitos.
- Nombre corto: minúsculas, kebab-case, sin artículos ni palabras vacías.
- Si esta historia se vincula manualmente a un work item de un sistema de seguimiento externo (ver `Work Item (<sistema>)` en la plantilla), el nombre completo `US-XXX-[nombre-corto]` debe respetar el límite de longitud de título que imponga ese sistema; si el nombre corto propuesto lo supera, acortarlo antes de crear la carpeta.
- Ejemplos: `US-001-seleccion-item-sdp-desde-receta`, `US-004-resumen-costos-receta`.
- Archivos de apoyo en `assets/`; enlazarlos desde Referencias con rutas relativas, p. ej. `![Descripción](assets/nombre.png)`. Los wireframes **no** van en `assets/`: se enlazan por su ruta en la capability (`docs/architecture/[capability]/wireframes/WF-XXX-[pantalla-slug].md`).

---

## Información requerida antes de redactar

Antes de crear o editar cualquier US, el agente debe tener clara la siguiente información. **No inventar nada** — si algún dato no es explícito, preguntar al usuario.


| Dato                                            | Cómo obtenerlo                                                                           | Si no está disponible                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Actor y valor de negocio**                    | Del contexto o descripción del usuario                                                   | Preguntar al usuario                                                                  |
| **Criterios de aceptación (AC-XXX)**            | Del contexto o descripción del usuario                                                   | Preguntar; sin al menos un `AC-XXX` INVEST no es valorable y la historia solo puede crearse en Draft |
| **Referencias de diseño** (solo US de UI)       | Figma, prototipos u otros enlaces aportados por el usuario                               | Sin ellas la historia no puede declararse Ready                                       |
| **Dependencias con otras US o sistemas**        | Indicadas por el usuario o inferibles del contexto                                       | Preguntar; afectan las dimensiones I y E de INVEST                                    |
| **ID de la US**                                 | Proporcionado por el usuario                                                             | Inferir el siguiente libre revisando carpetas `US-`* en `<changesPath>/user-stories/` **y en `<archivedPath>/user-stories/`** (archivar no libera el ID) |
| **Repositorios afectados**                      | Proporcionados por el usuario o inferibles del repo, o heredados de un `SRS-XXX` de origen | Sin ellos la historia no puede declararse Ready                                       |
| **Work item del gestor de proyectos** (solo `sync`) | El `#id` o URL que da el usuario; título, descripción, criterios y estado se leen del tracker (ver `references/<proveedor>.md`) y **no se repreguntan** | Sin MCP: pedir el contenido pegado; el número de la US es el `#id` indicado |
| **`SRS-XXX` de origen** (opcional)               | Solo si el usuario pide descomponer un SRS de `/requirement-refine`; en ese caso, actor/valor/AC-XXX/repos/referencias de UI se heredan de él en vez de preguntarse desde cero | No aplica — la mayoría de las US no parten de un SRS; caso por defecto sigue siendo la necesidad descrita directamente |


> El único dato estrictamente obligatorio para crear la historia es tener identificado el actor y el valor de negocio. Si INVEST no es completamente valorable con la información disponible, la historia se crea con `Estado: Draft` y las lagunas documentadas en Observaciones. El estado **Ready** requiere todos los datos sin excepción.

---

## Flujo (resumen)

El procedimiento completo —cómo preguntar al usuario, validación antes de crear, los pasos de **Crear** y **Actualizar**, el checklist y los ejemplos/anti-patrones— está en [`references/flow.md`](references/flow.md). Síntesis:

- **Descomponer un `SRS-XXX` (entrada alternativa):** solo cuando el usuario pide explícitamente descomponer un SRS de `/requirement-refine` — leer su `README.md` completo, agrupar `FR-XXX`/`NFR-XXX` en historias candidatas (por pantalla/actor, no 1:1 obligatorio), heredar de él criterios de verificación, repositorios y wireframes en vez de repreguntarlos, enlazar el SRS de origen en la línea `Requerimiento:` de la cabecera de cada US, y al terminar actualizar la tabla **Historias de usuario derivadas** del SRS. Ver [`references/flow.md`](references/flow.md#flujo-descomponer-un-srs-xxx-en-historias).
- **Varias historias en una misma invocación:** si el agrupamiento de un SRS o la migración investigada produjeron varias US, o el usuario pide crear de una vez varias historias relacionadas, primero detectar dependencias entre ellas y ordenarlas — la infraestructura y las que no dependen de ninguna otra de la tanda van primero — y confirmar ese orden con el usuario antes de fijar IDs; con una sola historia, saltar directo a Crear. Ver [`references/flow.md`](references/flow.md#flujo-proponer-varias-historias-en-una-misma-invocación).
- **Sincronizar (`sync`, solo con gestor de proyectos activo):** leer el work item, verificar que es una historia, mapear sus campos a la plantilla, codificar los criterios si no traen identificador, y crear `US-<id>-[slug]/` si no existe o mostrar el diff y aplicar lo confirmado si ya existe, sin escribir nada en el tracker — ver [Modificadores de invocación](#modificadores-de-invocación).
- **Crear:** fijar ID y carpeta `US-XXX-[nombre-corto]/` → redactar el `README.md` con la plantilla (Descripción RFC 2119, Referencias, Criterios `AC-XXX` con categoría y enunciado RFC 2119, campo **Repositorios:** de la cabecera, Complejidad Fibonacci, INVEST, DoR con sus indicadores 🟢/🟡/🔴 en la cabecera, Observaciones) → si la US toca UI y no hereda wireframes (del SRS, de un diseño aportado o de la capability), inferir la **capability** (preguntar solo si es ambigua), generar los **wireframes `WF-XXX` de todas las pantallas de una vez** en `docs/architecture/[capability]/wireframes/` con su fila en el índice de la capability, presentar el lote y preguntar **una sola vez** si hay cambios, enlazándolos desde Referencias → si el requerimiento define modelos, APIs o flujos, **delegar la documentación técnica a `/design-define` mediante subagente** y agregar las referencias devueltas a la sección Referencias → glosario si aplica → cierre.
- **Actualizar:** identificar y leer el `README.md` → aplicar cambios conservando **siempre** los ids `AC-XXX` existentes (son inmutables: los nuevos toman el siguiente libre) → revalidar (checklists e indicadores de cabecera) → confirmar. Ante conflicto `TK-XXX` ↔ US, **la US prevalece**.
- **Cierre:** si queda **Draft**, cerrar lagunas con preguntas estructuradas (una por laguna, máx. tres por bloque); si queda **Ready**, resolver la definición de casos de prueba según `specification.testCases.createMode` (`ask` pregunta, `always` invoca `/test-define` directo, `never` no la ofrece — ver [Política de planificación](#política-de-planificación)) y sugerir crear las `TK-XXX` con `/work-plan` (nunca crear TCs ni tareas directamente desde este skill). Si algún repositorio del campo **Repositorios:** de la cabecera no tiene el harness (`AGENTS.md`/`.sdd-devkit/settings.json`), agregar `/arch-init` como opción adicional en la misma pregunta.

Las modalidades **RFC 2119**, las **categorías de AC-XXX** (funcionales e ISO 25010) y las rúbricas **INVEST** y **DoR** detalladas están en [`references/quality-criteria.md`](references/quality-criteria.md).

---

## Criterios para `Estado: Ready` (resumen)

Promover a **Ready** solo si se cumplen todos; el detalle de cada criterio está en [`references/quality-criteria.md`](references/quality-criteria.md#definition-of-ready-dor).

- Sección **Criterios de aceptación** completa: al menos un `AC-XXX` con categoría entre paréntesis y enunciado RFC 2119 en MAYÚSCULAS.
- **DoR** completado según la plantilla (Dependencias listas, Inputs/outputs claros, Repositorios definidos, sin decisiones técnicas pendientes, Referencias de UI cuando aplique, sin aclaraciones pendientes).
- **INVEST** sin dimensiones en `No cumple`.
- **Repositorios afectados** identificados.
- **Observaciones** sin aclaraciones ni pendientes abiertos.

Si falta cualquiera, mantener `Estado: Draft` con las lagunas documentadas en Observaciones.
