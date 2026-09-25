# Integración con Azure DevOps — `work-define`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/azure-devops.md`](../../../references/project-managers/azure-devops.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, construcción de la URL, campo `Work Item (ADO)`, uso del `id` de ADO como número
> local, normalización del HTML de `System.Description` y anti-patrones comunes. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `work-define`**. Se activa desde el modificador `sync` de `SKILL.md`
(flujo [Sincronizar](flow.md#flujo-sincronizar-una-historia-desde-el-gestor-de-proyectos-sync) en `flow.md`), que crea la US local
si no existe y la actualiza si ya existe.

> **Rol de esta integración: leer, nunca escribir.** `work-define` **no crea ni modifica work items** en
> ADO. La dirección es única —ADO → repositorio—: el work item es el origen y el `README.md` local es la
> especificación que el resto del catálogo consume. Los skills que sí escriben en ADO (`work-plan`,
> `test-define`) siguen su propio delta sin cambios.

> **Degradación sin MCP.** Igual que `work-research`: no se crea nada con secuencial local en silencio.
> ```
> ⚠️ El repo está vinculado a Azure DevOps pero el MCP no está conectado.
> No puedo leer el work item #<id> automáticamente.
> Pégame su título, descripción y criterios de aceptación, o conecta el MCP de ADO desde el menú de herramientas.
> ```
> Con el contenido pegado, el flujo continúa igual y el número de la US es el `<id>` que el usuario indicó.

## Paso 1 — Leer el work item y verificar el tipo

Obtener el work item por `id` (de `#4821`, `4821` o la URL `<host>/<project>/_workitems/edit/4821`) y
leer `System.WorkItemType`:

| `System.WorkItemType` | Acción |
|-----------------------|--------|
| `User Story` · `Product Backlog Item` · `Requirement` (CMMI) | **Sincronizar** como `US-<id>` (crear o actualizar). |
| `Feature` · `Epic` | **No** es una historia: parar y ofrecer listar sus hijos (`Child`) de tipo historia para sincronizarlos uno a uno o en lote. |
| `Task` | Es un `TK-XXX`/`WI-XXX`: remitir a `work-plan`. |
| `Bug` | Remitir al flujo «Analizar issue» de `work-research`. |
| `Test Case` | Es un `TC-XXX`: remitir a `test-define` / `work-research`. |
| Otro | Preguntar al usuario qué espera antes de hacer nada. |

El proceso del proyecto (Agile, Scrum, CMMI, Basic) cambia los nombres: si el tipo devuelto no está en
la tabla, **no adivinar** (ver la base común).

## Paso 2 — Mapeo de campos a la plantilla de US

| Campo de ADO | Sección de `user-story-template.md` | Regla |
|--------------|-------------------------------------|-------|
| `id` | Número de la US (`US-<id>-[slug]`) y `Work Item (ADO): [#<id>](<url>)` | Sin padding de ceros. URL la del MCP o construida desde `host`/`project`. |
| `System.Title` | Título (`# US-<id>: …`) y slug de la carpeta | Slug kebab-case ≤ 5 palabras; el título completo queda en el encabezado. |
| `System.Description` | **Descripción** (COMO / QUIERO / PARA) y **Contexto** | Normalizar el HTML a markdown. Si el texto ya trae la forma COMO/QUIERO/PARA (o *As a / I want / So that*), mapearla campo a campo; si no, redactar las tres líneas **a partir del texto, sin añadir nada que no diga**, y llevar el texto original íntegro a **Contexto**. |
| `Microsoft.VSTS.Common.AcceptanceCriteria` | **Criterios de aceptación** | Un criterio por ítem. Ver «Identificadores de los criterios» abajo. Si el campo no existe en el proceso y los criterios vienen dentro de la descripción (encabezado «Criterios de aceptación» / «Acceptance Criteria»), extraerlos de ahí. |
| `System.State` | `Estado` | Solo orienta: `New` / `Proposed` / `To Do` → `Draft`. `Active` / `Approved` / `Committed` / `Ready` → candidata a `Ready`, **que se concede únicamente si pasa los criterios de Ready del skill**; si no los pasa, `Draft` con las lagunas en Observaciones y el estado de ADO anotado. `Resolved` / `Closed` / `Done` → avisar: la historia ya está cerrada en ADO; sincronizar solo si el usuario lo confirma (típico en `implementation.scope: tests`, donde se documenta para probar lo que ya existe). |
| `System.Tags`, `System.AreaPath`, `System.IterationPath` | **Contexto** (una línea «Gestión: …») | Registrar, no interpretar. |
| Relaciones `Parent` (Feature/Epic) | **Contexto** | Citar «Feature #<id>: título» como agrupación funcional. No crea artefactos. |
| Relaciones `Related` / `Predecessor` a otras historias | **Dependencias** (tabla INVEST/DoR) y Observaciones | Si la otra historia ya existe localmente (`Work Item (ADO): #<id>` en su cabecera), enlazarla; si no, citar el `#<id>` de ADO. |
| Adjuntos y comentarios | **Observaciones** | Citar como fuentes («ver comentario del <fecha> en ADO»); **no** copiar su contenido a la especificación. Si un comentario cambia un criterio, es una laguna que el usuario debe confirmar. |
| `Microsoft.VSTS.Scheduling.StoryPoints` / `Effort` | **Complejidad** | Solo si la escala coincide con la Fibonacci de la plantilla; si no, anotar el valor de ADO en Observaciones y dejar la complejidad sin fijar. |
| `Repositorios` | Cabecera | **No existe en ADO.** Es el único dato que se pregunta al usuario, salvo que sea inferible del repo (repo único) o ya esté en la US local (al actualizar). |

### Identificadores de los criterios

`test-define` y `coverage-verify` exigen que cada criterio tenga **un identificador codificado y único**.

- Si los criterios de ADO **ya traen** identificador (`AC-001`, `CA-1`, `1.1`, `R-3`…), usarlo **verbatim** —
  la misma regla que aplica `test-define`— y anotar en Observaciones que la numeración proviene de ADO.
- Si vienen como viñetas, párrafos o lista numerada implícita, asignar `AC-001`, `AC-002`… **en el orden en
  que aparecen** y anotar en Observaciones «Identificadores `AC-XXX` asignados localmente; el work item no
  los codifica». La renumeración **no se escribe de vuelta** en ADO.
- Añadir la **categoría entre paréntesis** y ajustar el enunciado al vocabulario RFC 2119 **solo cuando no
  cambie el sentido**; si un criterio es ambiguo, no verificable o contradictorio con la descripción, se
  conserva tal cual, se marca como laguna en Observaciones y la US queda en `Draft`. **Nunca inventar,
  dividir ni fusionar criterios** por cuenta propia.

## Paso 3 — ¿Crear o actualizar?

Buscar en `changesPath/user-stories/` **y** `archivedPath/user-stories/`:

- una carpeta `US-<id>-*`, o
- una US cuya cabecera tenga `Work Item (ADO): [#<id>]`.

Si no existe → crear. Si existe → actualizar (abajo). Si está archivada, parar y avisar (trabajo cerrado;
desarchivar lo decide el usuario).

## Actualizar — qué compara y qué escribe

Leer el work item y la US local, y presentar **un diff por sección**: título, Descripción, Criterios de
aceptación (por identificador), Contexto de gestión. Aplicar **solo lo que el usuario confirme**, con las
reglas del flujo «Actualizar una historia»: los `AC-XXX` existentes son inmutables (un criterio nuevo en
ADO toma el siguiente libre; uno eliminado en ADO se marca `Obsolete`, no se borra); si cambia el
enunciado de un criterio que ya tiene `Casos de prueba:`, avisar de la desalineación y sugerir
`test-define`. `Estado`, INVEST y DoR se recalculan como en cualquier actualización. Tampoco se
**escribe en ADO**.

## Ejemplo

- *Contexto:* `project-management.md` resolvió `project: Pagos`; MCP de ADO disponible; `implementation.scope: tests`.
- *Entrada:* «/work-define sync #4821».
- *Comportamiento:* lee #4821 (`User Story`, `Active`), mapea título y descripción, extrae cinco criterios
  de `AcceptanceCriteria` sin código y les asigna `AC-001…AC-005`, pregunta el repositorio afectado, crea
  `<changesPath>/user-stories/US-4821-pago-con-tarjeta/README.md` con `Work Item (ADO): [#4821](…)`,
  INVEST/DoR calculados y `Estado: Ready` (pasa los criterios). Cierra: «Sincronizada US-4821 desde ADO
  (#4821): creada → <changesPath>/user-stories/US-4821-pago-con-tarjeta/» y ofrece `/test-define` según
  `createMode`.

## Test Cases ya existentes en ADO

Si el work item sincronizado tiene relaciones «Tested By» (o una Test Suite con su título), **no** se sincronizan desde aquí: al cerrar, además del handoff habitual, ofrecer `/test-define sync #<id>` para traerlos bajo la US recién creada. `test-define` sin ese modificador generaría TCs nuevos desde los criterios, que no es lo mismo.

## Anti-patrones (propios de este delta)

- Crear o modificar el work item en ADO desde `work-define` (estado, criterios renumerados, título).
- Sincronizar un `Feature`/`Epic` como si fuera una historia, o una `Task`/`Bug` como US.
- Crear una segunda US local para un `#id` que ya tiene carpeta o `Work Item (ADO)` registrado.
- Conceder `Ready` solo porque en ADO está `Active`, sin pasar los criterios de Ready del skill.
- Completar criterios, dependencias o repositorios con lo que «probablemente» quiso decir el work item.
- Copiar comentarios o adjuntos como si fueran especificación.
