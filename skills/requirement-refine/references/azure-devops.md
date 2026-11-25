# Integración con Azure DevOps — `requirement-refine`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/azure-devops.md`](../../../references/project-managers/azure-devops.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, construcción de la URL, campo `work_item`, uso del `id` de ADO como número local y
> normalización del HTML de `System.Description`. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `requirement-refine`**: cómo se **descarga un `Epic`** de ADO como
`RQ-XXX`. Se activa con el modificador `sync` (`/requirement-refine sync #<id>`) o desde el handoff de
`/work-define sync` (`origen=work-define-sync`, con el `#id` de la épica). Un `#id` o una URL sin `sync` no
descarga nada: se pregunta qué se espera. El
flujo es el de [Crear un RQ](flow.md#flujo-crear-un-rq-requerimiento-externo); aquí solo está lo que cambia
cuando el documento fuente es un work item.

> **Rol de esta integración: solo bajada.** `requirement-refine` **nunca crea ni modifica** work items en
> ADO: su `sync` no tiene `push` y no toca el estado, el padre ni los hijos de la épica.

> **Degradación sin MCP.** No se puede leer la épica: avisar con el mensaje de la base común y pedir su
> título, descripción y criterios pegados. Con el contenido pegado el flujo continúa igual y el número del RQ
> es el `#id` indicado.

## Paso 1 — Leer el work item y verificar el tipo

Obtener el work item por `id` y leer `System.WorkItemType`. Solo un **`Epic`** se descarga como RQ desde
este delta. Un `Feature` no es un requerimiento (es agrupación funcional: `work-define` lo cita en el
Contexto de la historia); una `User Story`/`PBI`, `Task`, `Bug` o `Test Case` se remite al `sync` de su
skill. Si el proceso del proyecto no tiene un tipo llamado `Epic`, **no adivinar** cuál hace sus veces:
mostrarlo y preguntar (ver la base común).

## Paso 2 — ¿Crear o actualizar?

Buscar en `<changesPath>/requirements/` **y** `<archivedPath>/requirements/` una carpeta `RQ-<id>-*`, o un
documento (`RQ-*`, `PRD-*` o `SRS-*`) cuyo frontmatter tenga `work_item.id: <id>`:

- **No existe** → crear el RQ (Paso 3).
- **Existe un RQ activo** → no se crea otro. Si `System.Rev` de la épica es mayor que la última versión del
  «Historial del documento fuente», aplicar el flujo **Actualizar un RQ** con una instantánea nueva; si no,
  devolver el RQ tal cual.
- **Existe un PRD/SRS** → no crear el RQ (regla de solapamiento de «Validación antes de crear»): devolver
  ese documento como requerimiento de la épica.
- **Está archivado** → no escribir en él; devolver su ruta e informar que el requerimiento está cerrado.

## Paso 3 — Mapeo de la épica a la plantilla de RQ

| Campo de ADO | Destino en `rq-template.md` | Regla |
|--------------|-----------------------------|-------|
| El work item completo | **Documento fuente**: `references/EPIC-<id>-rev<N>.md` | Un work item no es un archivo, así que se guarda una **instantánea fiel**: título, descripción (HTML normalizado a markdown, sin resumir), criterios de aceptación, estado, etiquetas, área, iteración, `System.Rev`, `System.ChangedDate` y URL. No se edita después; una revisión nueva es un archivo nuevo. |
| `System.Rev` + `System.ChangedDate` | `source_document.name` («Epic #<id> rev <N> (<fecha>)») y fila del **Historial del documento fuente** | Es la versión del documento. |
| `id` | Número del RQ (`RQ-<id>-[slug]`) y `work_item: { system: ADO, id: <id>, url: <url> }` | Sin padding de ceros. URL la del MCP o construida desde `host`/`project`. |
| `System.Title` | Título (`# RQ-<id>: …`) y slug de la carpeta | Slug kebab-case ≤ 5 palabras. |
| `System.Description` | **Resumen**, `BR-XX` y `AC-XXX` | Extraer solo lo que el texto dice; fuente = «Epic #<id> — Descripción, <sección o párrafo>». |
| `Microsoft.VSTS.Common.AcceptanceCriteria` (si el proceso lo expone en `Epic`) | `AC-XXX` | Un criterio por ítem; fuente = «Epic #<id> — Criterios de aceptación, ítem <n>». Si ya traen identificador, se cita en la fuente; el `AC-XXX` local se asigna igual. |
| `System.State` | — | Solo orienta. `Ready` se concede con el DoR del RQ, nunca por el estado de ADO. |
| `System.Tags`, `System.AreaPath`, `System.IterationPath` | **Observaciones** (una línea «Gestión: …») | Registrar, no interpretar. |
| Relaciones `Child` (Features, historias) | **Observaciones** | Citar cuántos hijos tiene y sus `#id`. **No son documento fuente** ni generan criterios: las historias se sincronizan con `/work-define sync`. |
| Adjuntos y comentarios | **Referencias** / **Observaciones** | Citar como fuentes; no copiar su contenido. Un adjunto que el usuario aporte como archivo sí se guarda en `references/`. |
| `definition_owner` | Frontmatter | **No existe en ADO** (`CreatedBy`/`AssignedTo` son quién registró o atiende el work item, no el dueño de la definición). Se pregunta junto con la confirmación de criterios; sin respuesta, el RQ queda `Draft` con la laguna en Observaciones. |

### Numeración

El RQ que nace de una épica **lleva el `id` de ADO como número**, sin padding de ceros (`RQ-4500-pagos-digitales`),
igual que todo lo que baja del tracker («El ID de ADO manda» en la base común). Antes de crear la carpeta,
comprobar que ese número no esté ya en uso en `requirements/` (activo y archivo) **con ningún prefijo**: los
tres comparten numeración. Si lo ocupa un documento que no es de esta épica (un `PRD-`/`SRS-`/`RQ-` local
que casualmente tiene ese número), **parar y preguntar**; no renumerar ninguno de los dos por cuenta propia.

Los documentos redactados localmente siguen con el secuencial único de siempre, que se calcula sobre el
mayor número existente: después de un `RQ-4500`, el siguiente local será `4501`.

## Paso 4 — Confirmación y estado

Igual que el paso 6 de «Crear un RQ»: una sola pregunta con la tabla de `AC-XXX`, la Cobertura de la fuente
y el dueño de la definición. Confirmado y sin `Pendiente` → `Ready`; si no, `Draft`. Una épica sin
descripción ni criterios da un RQ `Draft` con «Sin criterios en el work item» en Observaciones — **no se
rellena** con el contenido de sus historias hijas.

**Llegando desde `work-define sync`** (`origen=work-define-sync`): el tipo es RQ sin pregunta de Paso 0 y
**este skill no pregunta nada**. Crea el RQ en `Draft` y devuelve a `work-define` la ruta del `README.md`,
el `RQ-<id>` y lo que queda por confirmar (tabla de `AC-XXX`, Cobertura de la fuente, dueño de la
definición); `work-define` lo presenta en la tanda única de su `sync` y devuelve las respuestas, con las que
este skill completa el RQ y fija el `status`. El cierre **no** ofrece `/test-define`: cierra `work-define`.
Un RQ que queda en `Draft` no bloquea la sincronización de la historia.

## Anti-patrones (propios de este delta)

- Escribir en ADO, o enlazar/desenlazar la épica de sus historias.
- Crear un segundo RQ para una épica que ya tiene carpeta `RQ-<id>-*` o un documento con su `work_item.id`.
- Numerar con el secuencial local un RQ descargado de ADO, o rellenar el `id` con ceros.
- Derivar `AC-XXX` de las historias hijas o de comentarios, o conceder `Ready` porque la épica está activa.
- Enlazar a la épica como documento fuente sin guardar la instantánea en `references/`.
- Descargar un `Feature` como RQ.
