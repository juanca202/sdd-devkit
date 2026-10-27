# Integración con Azure DevOps — `work-plan`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/azure-devops.md`](../../../references/project-managers/azure-devops.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, construcción de la URL, campo `Work Item (ADO)`, uso del `id` de ADO como número
> local, límite de 255 caracteres del título, contrato de reconstrucción íntegra y anti-patrones
> comunes. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `work-plan`**. Se activa desde «Resolución de la integración con el
gestor de proyectos» en `SKILL.md`, y aplica de forma transversal a los tres tipos de plan (todos crean work
items); cuando dice «tarea» se refiere al artefacto del tipo de plan en curso (p. ej. un `TK-XXX` de
historia de usuario, o un incidente `BUG-XXX`).

## Qué se crea en ADO

Antes de generar el archivo local, crear el work item vía MCP:

| Campo | Valor |
|-------|-------|
| **Título** | El nombre descriptivo de la tarea (el mismo que iría en el nombre de archivo). |
| **Tipo de work item — `TK-`** | `Task` (o el tipo equivalente configurado en el proyecto). |
| **Tipo de work item — `BUG-`** | **`Bug`** — el único artefacto que se crea con ese tipo. El reporte del defecto lleva en Descripción sus secciones Comportamiento esperado / observado, Pasos para reproducir —también en `Microsoft.VSTS.TCM.ReproSteps` si el proyecto lo expone—, Evidencia e Impacto, y `Microsoft.VSTS.Common.Severity` si existe. **En modo pruebas** —`implementation.scope: tests`, plantilla `incident-tests-template.md`— las secciones son las de esa plantilla: Precondiciones, Datos de prueba, Pasos de ejecución con lo observado y los comentarios, Resultado esperado / observado final, Hallazgos, Evidencias e Impacto, con la tabla de pasos también en `ReproSteps`. Cada archivo de `assets/` listado en Evidencias se **sube como adjunto** del `Bug` si el MCP lo permite y, si no, se avisa al usuario de qué archivos adjuntar a mano; el `Bug` se vincula con `Tested By`/`Related` al work item del `TC-XXX` cuando ese TC existe en ADO, y con `Related` a la `User Story` afectada, best-effort. Si el bug **ya existe** en ADO (lo pasa `work-research` con su `ado_id`), **no se crea un segundo `Bug`**: se reutiliza su `id` como número local y se actualiza su Descripción con el documento. |
| **Tipo de work item — `WI-`** | **`Task`, para todos los tipos** (`bug-fix` y `spike` incluidos): un `bug-fix` es trabajo de corrección, y si cita `Origen: BUG-XXX` se vincula al `Bug` de ese incidente con la relación `Related` (o `Child`, si el proceso lo admite), nunca se crea como `Bug`. Un `spike` lleva en Descripción sus secciones propias (Pregunta de investigación, Hipótesis, Preguntas a responder, Fuera de alcance, Enfoque del experimento, Entregable) y `Timebox`; si el proceso del proyecto expone un tipo `Spike`, puede usarse en su lugar, confirmándolo con el usuario. Un WI que cita `Origen: WI-XXX (spike)` se vincula al work item del spike con `Related`. Ante duda, confirmar con el usuario. |
| **Criterios de aceptación** | Solo si el artefacto tiene esa sección (un `WI-XXX` puede tenerla, un `BUG-XXX` opcionalmente, un `TK-XXX` no). Campo dedicado `Microsoft.VSTS.Common.AcceptanceCriteria` si existe; si no, dentro de Descripción. |
| **Descripción** | El documento completo, serializado con los mismos encabezados que el `.md`. `TK-XXX`: Descripción, Dependencias, Referencias, Plan de implementación (`IT-XX`), Observaciones. `WI-XXX`: Descripción, Contexto, Fuera de alcance, Reglas de negocio, Dependencias, Referencias, Plan de implementación, Observaciones (en un `spike`: Pregunta de investigación, Contexto, Hipótesis, Preguntas a responder, Fuera de alcance, Dependencias, Referencias, Enfoque del experimento, Entregable, Observaciones). |
| **Iteración / Area Path** | Omitir: no son configurables (ver la base común). ADO aplica los valores por defecto del proyecto. |
| **Padre** | Si aplica (p. ej. una US vinculada en ADO), vincular al work item padre. Best-effort. |

Tras la llamada, extraer el `id` numérico y usarlo como número de la tarea local, con el prefijo del
tipo de plan en curso: `TK-<ado_id>-[nombre-descriptivo].md`, `WI-<ado_id>-[nombre-descriptivo]/` o
`BUG-<ado_id>-[nombre-descriptivo]/`.

## Alcance del check de ID disponible

- **`WI-`**: el escaneo cubre `<changesPath>/work-items/` **y** `<archivedPath>/work-items/`. Un WI
  archivado conserva su ID de ADO, y saltárselo produciría dos carpetas locales para un mismo work item
  del tracker. (`<archivedPath>/` resuelto desde `specification.archivedPath` — ver
  [`${PLUGIN_ROOT}/references/archive.md`](../../../references/archive.md#contrato-para-el-resto-del-catálogo).)
- **`BUG-`**: igual que `WI-`, sobre `<changesPath>/incidents/` **y** `<archivedPath>/incidents/`.
- **`TK-`**: **no** se escanea el archivo. El `TK-` es por historia, y si la US padre estuviera
  archivada el flujo ya habría parado antes de llegar aquí (Regla 1) — lo que se comprueba es la carpeta
  de la US **realmente resuelta**.

## Lectura (`sync`)

Solo con el modificador explícito `sync` de `SKILL.md`. **Por defecto, bajada ADO → repo**: aquí no se
crea ni se modifica nada en ADO; la subida existe solo con `push` (ver [Subida](#subida-push)).
Degradación sin MCP: la de la base común (pedir el contenido pegado; el número local es el `id` indicado).

### Paso 1 — Leer el work item y resolver qué documento es

Obtener el work item por `id` y leer `System.WorkItemType`:

| `System.WorkItemType` | Documento local | Cómo se decide |
|-----------------------|-----------------|----------------|
| `Bug` | **`BUG-<id>-[slug]/`** en `<changesPath>/incidents/` | Siempre. Nunca un `WI`. |
| `Task` | `TK-<id>-[slug].md` o `WI-<id>-[slug]/` | Leer la relación `Parent`: si apunta a una `User Story`/`PBI` que existe localmente (`US-<id>-*` o `Work Item (ADO): [#<id>]`, en ruta activa o archivo) → `TK` dentro de esa US; si apunta a una historia que **no** existe localmente → preguntar (`/work-define sync #<padre>` primero, o crear como WI); sin padre historia → `WI`. |
| `User Story` · `Product Backlog Item` · `Requirement` · `Feature` · `Epic` | — | Remitir a `/work-define sync #<id>`. |
| `Test Case` | — | Remitir a `/test-define sync #<id>`. |
| `Issue` · `Impediment` · otros | — | Preguntar al usuario qué espera. |

El proceso del proyecto (Agile, Scrum, CMMI, Basic) cambia los nombres: si el tipo no está en la tabla,
**no adivinar** (ver la base común). Un `Bug` con `System.State` `Resolved`/`Closed`/`Done` se avisa antes
de crear: se sincroniza solo si el usuario confirma, y su `Resolución` arranca en `Fixed (<referencia>)` o
`Discarded — cerrado en ADO` según lo que diga el campo `Microsoft.VSTS.Common.ResolvedReason`.

### Paso 2 — Mapeo de campos

**`Bug` → `incident-template.md`** (en `implementation.scope: tests`, `incident-tests-template.md`, con la
tabla de pasos reconstruida desde `ReproSteps` y `Caso de prueba` desde la relación `Tested By`):

| Campo de ADO | Sección del incidente | Regla |
|--------------|-----------------------|-------|
| `id`, `System.Title` | `# BUG-<id>: …`, slug, `Work Item (ADO): [#<id>](<url>)` | Sin padding; slug kebab-case ≤ 5 palabras. |
| `System.Description` | **Descripción** y, si trae «esperado / observado», **Comportamiento esperado / observado** | Normalizar HTML a markdown; no inventar lo que no diga. |
| `Microsoft.VSTS.TCM.ReproSteps` | **Pasos para reproducir** (precondiciones + pasos numerados) | Copiar **uno a uno**, sin resumir ni reordenar. Si el campo no existe y los pasos están en la descripción, extraerlos de ahí. |
| `Microsoft.VSTS.TCM.SystemInfo` | `Ambiente` en Pasos para reproducir | Citar el ambiente por nombre; si trae una URL, conservar solo el nombre. |
| `Microsoft.VSTS.Common.Severity` | `Severidad` en **Impacto** | Mapear la escala del proceso (`1 - Critical` → `Crítico`, `2 - High` → `Alto`, `3 - Medium` → `Medio`, `4 - Low` → `Bajo`). Si el campo no existe, preguntar. |
| `Microsoft.VSTS.Common.Priority` | **Impacto** → `Alcance` (una línea «Prioridad ADO: N») | Registrar, no interpretar. |
| Adjuntos (`AttachedFile`) | **Evidencia** (`EV-XX`) | Descargar a `assets/EV-XX-<nombre>` si el MCP lo permite y enlazar; si no, fila «No adjuntado — en ADO» con su nombre. Revisar que no contengan credenciales antes de guardarlos. |
| `System.State` | `Estado` / `Resolución` | `New`/`Active` → `Resolución: Open`; `Estado` según el checklist de Ready de `incidents.md` (el estado de ADO solo orienta). `Resolved`/`Closed` → ver Paso 1. |
| Relación `Parent` / `Related` a una historia | `Historia de usuario` en la cabecera | Enlazar la `US-<id>` local si existe; si no, citar `#<id>`. |
| Relación `Tested By` / `Tests` | `Caso de prueba` en la cabecera | Enlazar el `TC-<id>` local si existe; si no, citar `#<id>` y ofrecer `/test-define sync`. |
| `System.CreatedBy`, `System.CreatedDate` | `Reportado por`, `Fecha` | Tal cual. |
| `System.Tags`, `System.AreaPath`, `System.IterationPath` | **Contexto** («Gestión: …») | Registrar, no interpretar. |
| Comentarios | **Observaciones** | Citar como fuente; no copiar como especificación. |

**`Task` → `task-template.md` o `work-item-template.md`:**

| Campo de ADO | Sección | Regla |
|--------------|---------|-------|
| `id`, `System.Title` | `# TK-<id>: …` / `# WI-<id>: …`, slug, `Work Item (ADO)` | Como arriba. |
| `System.Description` | **Descripción**, y las secciones que el texto traiga con sus mismos encabezados (Contexto, Dependencias, Referencias, Plan de implementación, Observaciones) | Si la descripción fue serializada por este mismo skill, los encabezados coinciden y se mapean 1:1; si es texto libre, va íntegro a Descripción y lo demás queda como laguna. Un plan en viñetas se codifica `IT-01…` en orden. |
| `Microsoft.VSTS.Common.AcceptanceCriteria` | **Criterios de aceptación** (solo WI) | Codificación como en `work-define sync`: verbatim si traen identificador; `AC-001…` en orden si no, anotándolo en Observaciones. Nunca inventar, dividir ni fusionar. |
| `System.Tags` / título | `Tipo` del WI | Inferir (`bug-fix`, `refactor`, `dependency-update`…) y **confirmar**; si no se puede inferir, preguntar. Una `Task` que es un spike se sincroniza con `work-item-spike-template.md` solo si el título o las tags lo dicen; sus `Q-XX` y timebox, si no vienen, son lagunas. |
| `System.State` | `Estado` | Solo orienta; `Ready` únicamente si pasa el checklist del tipo de plan. `Closed`/`Done` → avisar: trabajo ya cerrado en ADO. |
| `Repositorio` | Cabecera | **No existe en ADO**: preguntar, salvo que sea inferible (repo único) o ya esté en el documento local. |
| Relación `Parent` | US padre (TK) o `Origen` (WI que cita un `Bug` → `Origen: BUG-<id>` si ese incidente existe localmente; si no, citar `#<id>`) | Best-effort. |

### Paso 3 — ¿Crear o actualizar?

Buscar `<PREFIJO>-<id>-*` y cabeceras `Work Item (ADO): [#<id>]` en la ruta activa **y** en
`<archivedPath>` (`incidents/`, `work-items/`, o la US padre para una TK). Archivado → parar y avisar. Al
actualizar: diff por sección en una sola tanda, aplicar solo lo confirmado, identificadores inmutables; un
`Bug` cerrado en ADO propone actualizar `Resolución`, nunca borrar evidencia.

### Subida (`push`)

Solo con `sync … push` explícito. Leer el work item y el documento local, presentar el **diff inverso** y
escribir **solo lo confirmado** con el mapeo de [Qué se crea en ADO](#qué-se-crea-en-ado): mismos campos
dedicados (`AcceptanceCriteria`, `ReproSteps` para los pasos de un incidente, `Severity`), misma
serialización de Descripción por encabezados, adjuntos de `assets/` como `AttachedFile` en un `Bug` (best-effort; avisar
los que no se pudieron subir). Sin `Work Item (ADO)` en la cabecera: ofrecer crear el work item (`Task`
para TK/WI, `Bug` para un incidente), vincular el padre (US para una TK; el `Bug` del `Origen: BUG-XXX`
para un `bug-fix`) y añadir la línea `Work Item (ADO)` **sin renumerar** el documento. No se escriben
`System.State`, `AreaPath`, `IterationPath` ni se cambia el tipo salvo petición expresa; la `Resolución`
de un incidente **no** se traduce a estado de ADO. Cerrar con «Subido <ID> a ADO (#<id>): <secciones>».

### Anti-patrones de lectura y subida

- Sincronizar un `Bug` como `WI-XXX`, o una `User Story` como WI.
- Crear la carpeta de la US padre desde `work-plan` para colgar una `TK`.
- Escribir en ADO desde `sync` sin `push`; con `push`, cambiar estado, tipo o padre, o crear un segundo work item para un documento que ya tiene `Work Item (ADO)`.
- Crear un segundo documento local para un `#id` que ya tiene carpeta o `Work Item (ADO)` registrado.
- Conceder `Ready` solo porque en ADO está `Active`.
- Descargar adjuntos sin revisar que no contengan tokens, cookies o credenciales.

## Ejemplo — Repo vinculado a ADO con MCP disponible

- *Contexto:* `project-management.md` resolvió `project: MyProject`. MCP de ADO disponible.
- *Entrada:* «TK para el endpoint de autenticación en US-003.»
- *Comportamiento:* El agente detecta ADO (en `SKILL.md`), lee la base común y este archivo, verifica que
  el MCP está disponible, crea el work item en ADO (`Task`, título "Endpoint de autenticación",
  Descripción con el documento completo del TK serializado por secciones, US-003 como padre si hay
  vinculación) y extrae `id: 2031`. Genera el archivo local `TK-2031-endpoint-autenticacion.md` con el
  campo `Work Item (ADO): [#2031](https://dev.azure.com/…)`. El flujo del tipo de plan (stub o TK
  completa) continúa según la intención del usuario.
