# Integración con Jira — `work-plan`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../references/project-managers/jira.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, clave del issue y número local, construcción de la URL, campo `work_item`, límite de
> 255 caracteres del resumen, contrato de reconstrucción íntegra y anti-patrones comunes. **Leerla antes
> que este archivo.**

Este archivo contiene **solo el delta de `work-plan`**. Se activa desde «Resolución de la integración con el
gestor de proyectos» en `SKILL.md`, y aplica de forma transversal a los tres tipos de plan (todos crean
issues); cuando dice «tarea» se refiere al artefacto del tipo de plan en curso (p. ej. un `TK-XXX` de
historia de usuario, o un incidente `BUG-XXX`).

## Qué se crea en Jira

Antes de generar el archivo local, crear el issue vía MCP en el `project` configurado:

| Campo | Valor |
|-------|-------|
| **Resumen (`summary`)** | El nombre descriptivo de la tarea (el mismo que iría en el nombre de archivo). |
| **Tipo de issue — `TK-`** | **`Sub-task`** con `parent` = el issue de la historia (el `work_item` de la US). Una subtarea **no existe sin padre**: si la US no tiene `work_item`, crear un `Task` y decirlo (o, si el usuario lo prefiere, subir antes la historia con `/work-define sync US-XXX push`). |
| **Tipo de issue — `BUG-`** | **`Bug`** — el único artefacto que se crea con ese tipo. El reporte del defecto lleva en Descripción sus secciones Comportamiento esperado / observado, Pasos para reproducir, Evidencia e Impacto; el ambiente va además en el campo `environment` si el proyecto lo muestra, y la severidad en el campo «Severity» si el proyecto lo tiene (la `priority` de Jira **no** es la severidad: no se escribe). **En modo pruebas** —`implementation.scope: tests`, plantilla `incident-tests-template.md`— las secciones son las de esa plantilla: Precondiciones, Datos de prueba, Pasos de ejecución con lo observado y los comentarios, Resultado esperado / observado final, Hallazgos, Evidencias e Impacto. Cada archivo de `assets/` listado en Evidencias se **sube como adjunto** del `Bug` si el MCP lo permite y, si no, se avisa al usuario de qué archivos adjuntar a mano; el `Bug` se relaciona con el `TC-XXX` según la herramienta de pruebas —si el caso es un issue, con un vínculo; si es de Zephyr, citando su clave en la sección Caso de prueba de la Descripción— y con `relates to` a la `Story` afectada, best-effort. Si el bug **ya existe** en Jira (lo pasa `work-research` con su clave), **no se crea un segundo `Bug`**: se reutiliza el número de su clave como número local y se actualiza su Descripción con el documento. |
| **Tipo de issue — `WI-`** | **`Task`, para todos los tipos** (`bug-fix` y `spike` incluidos): un `bug-fix` es trabajo de corrección, y si cita `origin` → `BUG-XXX` se vincula al `Bug` de ese incidente con `relates to`, nunca se crea como `Bug`. Un `spike` lleva en Descripción sus secciones propias (Pregunta de investigación, Hipótesis, Preguntas a responder, Fuera de alcance, Enfoque del experimento, Entregable) y el `timebox` del frontmatter; si el proyecto tiene un tipo `Spike`, puede usarse en su lugar, confirmándolo con el usuario. Un WI que cita `origin` → `WI-XXX` (spike) se vincula al issue del spike con `relates to`. Ante duda, confirmar con el usuario. |
| **Criterios de aceptación** | Solo si el artefacto tiene esa sección (un `WI-XXX` puede tenerla, un `BUG-XXX` opcionalmente, un `TK-XXX` no). Campo de criterios del proyecto si existe; si no —lo habitual—, dentro de Descripción con su encabezado. |
| **Descripción** | El documento completo, serializado con los mismos encabezados que el `.md`. `TK-XXX`: Descripción, Dependencias, Referencias, Plan de implementación (`IT-XX`), Observaciones. `WI-XXX`: Descripción, Contexto, Fuera de alcance, Reglas de negocio, Dependencias, Referencias, Plan de implementación, Observaciones (en un `spike`: Pregunta de investigación, Contexto, Hipótesis, Preguntas a responder, Fuera de alcance, Dependencias, Referencias, Enfoque del experimento, Entregable, Observaciones). |
| **Sprint / componentes / versión / asignado** | Omitir: no son configurables (ver la base común). Jira aplica los valores por defecto del proyecto. |
| **Padre** | `TK`: la historia (obligatorio para la `Sub-task`, ver arriba). `WI`/`BUG`: sin `parent`; la relación con una historia o un incidente es un vínculo `relates to`, best-effort. |

Tras la llamada, extraer la clave (`PAG-2031`) y usar su número como número de la tarea local, con el
prefijo del tipo de plan en curso: `TK-2031-[nombre-descriptivo].md`, `WI-2031-[nombre-descriptivo]/` o
`BUG-2031-[nombre-descriptivo]/`, y la clave completa en `work_item.id`.

## Alcance del check de ID disponible

- **`WI-`**: el escaneo cubre `<changesPath>/work-items/` **y** `<archivedPath>/work-items/`. Un WI
  archivado conserva su número, y saltárselo produciría dos carpetas locales para un mismo issue.
  (`<archivedPath>/` resuelto desde `specification.archivedPath` — ver
  [`${PLUGIN_ROOT}/references/archive.md`](../../../references/archive.md#contrato-para-el-resto-del-catálogo).)
- **`BUG-`**: igual que `WI-`, sobre `<changesPath>/incidents/` **y** `<archivedPath>/incidents/`.
- **`TK-`**: **no** se escanea el archivo. El `TK-` es por historia, y si la US padre estuviera
  archivada el flujo ya habría parado antes de llegar aquí (Regla 1) — lo que se comprueba es la carpeta
  de la US **realmente resuelta**.

## Lectura (`sync`)

Solo con el modificador explícito `sync` de `SKILL.md`. **Por defecto, bajada Jira → repo**: aquí no se
crea ni se modifica nada en Jira; la subida existe solo con `push` (ver [Subida](#subida-push)).
Degradación sin MCP: la de la base común (pedir el contenido pegado; el número local es el de la clave).

### Paso 1 — Leer el issue y resolver qué documento es

Obtener el issue por su clave y leer `issuetype` (nombre y `hierarchyLevel`):

| Tipo de issue | Documento local | Cómo se decide |
|---------------|-----------------|----------------|
| `Bug` | **`BUG-<n>-[slug]/`** en `<changesPath>/incidents/` | Siempre. Nunca un `WI`. |
| `Sub-task` (`hierarchyLevel: -1`) | `TK-<n>-[slug].md` o `WI-<n>-[slug]/` | Leer `parent`: si es una historia que existe localmente (`US-<n>-*` o `work_item.id: <clave>`, en ruta activa o archivo) → `TK` dentro de esa US; si es una historia que **no** existe localmente → preguntar (`/work-define sync <clave-padre>` primero, o crear como WI); si el padre no es una historia → `WI`. |
| `Task` | `WI-<n>-[slug]/` | Trabajo sin historia padre (una `Task` puede colgar de una épica, no de una historia). Si el equipo usa `Task` como tarea de una historia enlazada por vínculo, preguntar antes de crearla como `TK`. |
| `Story` | — | Remitir a `/work-define sync <clave>`. |
| `Epic` | — | Remitir a `/requirement-refine sync <clave>`. |
| Caso de prueba de la herramienta de pruebas (con Zephyr, una clave `PAG-T123`) | — | Remitir a `/test-define sync <clave>`. |
| Otros | — | Preguntar al usuario qué espera. |

Los nombres de tipo son configurables: si el tipo no está en la tabla, **no adivinar** (ver la base
común). Un `Bug` en categoría `Done` se avisa antes de crear: se sincroniza solo si el usuario confirma, y
su `Resolución` arranca en `Fixed (<referencia>)` o `Discarded — cerrado en Jira` según el campo
`resolution` (`Fixed`/`Done` → `Fixed`; `Won't Do`, `Duplicate`, `Cannot Reproduce` → `Discarded`).

### Paso 2 — Mapeo de campos

**`Bug` → `incident-template.md`** (en `implementation.scope: tests`, `incident-tests-template.md`, con la
tabla de pasos reconstruida desde la descripción y `Caso de prueba` desde la clave del caso que el `Bug` cite o tenga enlazado):

| Campo de Jira | Sección del incidente | Regla |
|---------------|-----------------------|-------|
| Clave, `summary` | `# BUG-<n>: …`, slug, `work_item: { system: Jira, id: <clave>, url: <url> }` | Sin padding; slug kebab-case ≤ 5 palabras. |
| `description` | **Descripción**, **Comportamiento esperado / observado** y **Pasos para reproducir** (precondiciones + pasos numerados) | Jira no tiene campo de pasos: se extraen de la descripción por sus encabezados o su lista numerada, **uno a uno**, sin resumir ni reordenar. Normalizar a markdown; no inventar lo que no diga. |
| `environment` | `Ambiente` en Pasos para reproducir | Citar el ambiente por nombre; si trae una URL, conservar solo el nombre. |
| Campo «Severity» del proyecto, si existe | `Severidad` en **Impacto** | Mapear la escala del proyecto a `Crítico` / `Alto` / `Medio` / `Bajo`. Si el campo no existe, preguntar: **no** deducirla de `priority`. |
| `priority` | **Impacto** → `Alcance` (una línea «Prioridad Jira: <valor>») | Registrar, no interpretar. |
| Adjuntos (`attachment`) | **Evidencia** (`EV-XX`) | Descargar a `assets/EV-XX-<nombre>` si el MCP lo permite y enlazar; si no, fila «No adjuntado — en Jira» con su nombre. Revisar que no contengan credenciales antes de guardarlos. |
| `status` / `resolution` | `status` / `Resolución` | Categoría `To Do` o `In Progress` → `Resolución: Open`; `status` según el checklist de Ready de `incidents.md` (el estado de Jira solo orienta). `Done` → ver Paso 1. |
| `parent` o vínculo a una historia | `Historia de usuario` en el frontmatter | Enlazar la `US-<n>` local si existe; si no, citar la clave. |
| Caso de prueba citado en la descripción (clave de Zephyr) o issue de prueba enlazado | `Caso de prueba` en el frontmatter | Enlazar el `TC-<n>` local si existe (por su `work_item.id`); si no, citar la clave y ofrecer `/test-define sync`. |
| `reporter`, `created` | `Reportado por`, `Fecha` | Tal cual. |
| `labels`, `components`, `fixVersions`, `versions` (versión afectada), sprint | **Contexto** («Gestión: …») | Registrar, no interpretar. |
| Comentarios | **Observaciones** | Citar como fuente; no copiar como especificación. |

**`Sub-task` / `Task` → `task-template.md` o `work-item-template.md`:**

| Campo de Jira | Sección | Regla |
|---------------|---------|-------|
| Clave, `summary` | `# TK-<n>: …` / `# WI-<n>: …`, slug, `work_item` | Como arriba. |
| `description` | **Descripción**, y las secciones que el texto traiga con sus mismos encabezados (Contexto, Dependencias, Referencias, Plan de implementación, Criterios de aceptación, Observaciones) | Si la descripción fue serializada por este mismo skill, los encabezados coinciden y se mapean 1:1; si es texto libre, va íntegro a Descripción y lo demás queda como laguna. Un plan en viñetas se codifica `IT-01…` en orden. |
| Campo de criterios del proyecto, o encabezado «Criterios de aceptación» de la descripción | **Criterios de aceptación** (solo WI) | Codificación como en `work-define sync`: verbatim si traen identificador; `AC-001…` en orden si no, anotándolo en Observaciones. Nunca inventar, dividir ni fusionar. |
| `labels` / resumen | `Tipo` del WI | Inferir (`bug-fix`, `refactor`, `dependency-update`…) y **confirmar**; si no se puede inferir, preguntar. Un issue que es un spike (tipo `Spike`, o lo dicen el resumen o las etiquetas) se sincroniza con `work-item-spike-template.md`; sus `Q-XX` y timebox, si no vienen, son lagunas. |
| `status` | `status` | Solo orienta; `Ready` únicamente si pasa el checklist del tipo de plan. Categoría `Done` → avisar: trabajo ya cerrado en Jira. |
| `repository` | Frontmatter | **No existe en Jira**: preguntar, salvo que sea inferible (repo único) o ya esté en el documento local. |
| `parent` / vínculos | US padre (TK) o `origin` (WI vinculado a un `Bug` → `origin` → `BUG-<n>` si ese incidente existe localmente; si no, citar la clave) | Best-effort. |

### Paso 3 — ¿Crear o actualizar?

Buscar `<PREFIJO>-<n>-*` y frontmatters con `work_item.id: <clave>` en la ruta activa **y** en
`<archivedPath>` (`incidents/`, `work-items/`, o la US padre para una TK). Archivado → parar y avisar. Al
actualizar: diff por sección en una sola tanda, aplicar solo lo confirmado, identificadores inmutables; un
`Bug` cerrado en Jira propone actualizar `Resolución`, nunca borrar evidencia.

### Subida (`push`)

Solo con `sync … push` explícito. Leer el issue y el documento local, presentar el **diff inverso** y
escribir **solo lo confirmado** con el mapeo de [Qué se crea en Jira](#qué-se-crea-en-jira): misma
serialización de Descripción por encabezados, campo de criterios y «Severity» si existen, `environment`,
y adjuntos de `assets/` en un `Bug` (best-effort; avisar los que no se pudieron subir). Sin `work_item` en
el frontmatter: ofrecer crear el issue (`Sub-task` bajo la historia para una TK, `Task` para un WI, `Bug`
para un incidente), vincular lo que corresponda y añadir `work_item` **sin renumerar** el documento. No se
ejecutan transiciones, no se escribe `resolution`, sprint, componentes ni versión, y no se cambia el tipo
salvo petición expresa; la `Resolución` de un incidente **no** se traduce a estado de Jira. Cerrar con
«Subido <ID> a Jira (<clave>): <secciones>».

### Anti-patrones de lectura y subida

- Sincronizar un `Bug` como `WI-XXX`, o una `Story` como WI.
- Crear la carpeta de la US padre desde `work-plan` para colgar una `TK`.
- Crear una `Sub-task` sin padre, o colgarla de una épica o de otra subtarea.
- Escribir en Jira desde `sync` sin `push`; con `push`, ejecutar transiciones, cambiar tipo o padre, o crear un segundo issue para un documento que ya tiene `work_item`.
- Crear un segundo documento local para una clave que ya tiene carpeta o `work_item` registrado.
- Tomar la `priority` de Jira como severidad del incidente.
- Conceder `Ready` solo porque en Jira está en curso.
- Descargar adjuntos sin revisar que no contengan tokens, cookies o credenciales.

## Ejemplo — Repo vinculado a Jira con MCP disponible

- *Contexto:* `project-management.md` resolvió `provider: jira`, `project: PAG`. MCP de Jira disponible.
  `US-1500` tiene `work_item` (`system: Jira`, `id: PAG-1500`).
- *Entrada:* «TK para el endpoint de autenticación en US-1500.»
- *Comportamiento:* El agente detecta Jira (en `SKILL.md`), lee la base común y este archivo, verifica que
  el MCP está disponible y crea el issue (`Sub-task` con `parent: PAG-1500`, resumen «Endpoint de
  autenticación», Descripción con el documento completo del TK serializado por secciones). Jira devuelve
  `PAG-2031`. Genera el archivo local `TK-2031-endpoint-autenticacion.md` con
  `work_item: { system: Jira, id: PAG-2031, url: https://…/browse/PAG-2031 }` en el frontmatter. El flujo
  del tipo de plan (stub o TK completa) continúa según la intención del usuario.
