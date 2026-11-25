# Integración con Jira — `requirement-refine`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../references/project-managers/jira.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, clave del issue y número local, construcción de la URL, campo `work_item` y
> normalización de la Descripción. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `requirement-refine`**: cómo se **descarga un `Epic`** de Jira como
`RQ-XXX`. Se activa con el modificador `sync` (`/requirement-refine sync <clave>`) o desde el handoff de
`/work-define sync` (`origen=work-define-sync`, con la clave de la épica). Una clave o una URL sin `sync`
no descarga nada: se pregunta qué se espera. El flujo es el de
[Crear un RQ](flow.md#flujo-crear-un-rq-requerimiento-externo); aquí solo está lo que cambia cuando el
documento fuente es un issue.

> **Rol de esta integración: solo bajada.** `requirement-refine` **nunca crea ni modifica** issues en
> Jira: su `sync` no tiene `push` y no toca el estado, el padre ni los hijos de la épica.

> **Degradación sin MCP.** No se puede leer la épica: avisar con el mensaje de la base común y pedir su
> resumen, descripción y criterios pegados. Con el contenido pegado el flujo continúa igual y el número
> del RQ es el de la clave indicada.

## Paso 1 — Leer el issue y verificar el tipo

Obtener el issue por su clave y leer `issuetype`. Solo un issue de **nivel épica** (`hierarchyLevel: 1`,
normalmente `Epic`) se descarga como RQ desde este delta. Una `Story`, `Task`, `Sub-task`, `Bug` o issue
de prueba se remite al `sync` de su skill; un nivel superior (iniciativa) o un tipo propio del proyecto
no se asume requerimiento: mostrarlo y preguntar (ver la base común).

## Paso 2 — ¿Crear o actualizar?

Buscar en `<changesPath>/requirements/` **y** `<archivedPath>/requirements/` una carpeta `RQ-<n>-*`, o un
documento (`RQ-*`, `PRD-*` o `SRS-*`) cuyo frontmatter tenga `work_item.id: <clave>`:

- **No existe** → crear el RQ (Paso 3).
- **Existe un RQ activo** → no se crea otro. Si el campo `updated` de la épica es posterior a la última
  versión del «Historial del documento fuente», aplicar el flujo **Actualizar un RQ** con una instantánea
  nueva; si no, devolver el RQ tal cual.
- **Existe un PRD/SRS** → no crear el RQ (regla de solapamiento de «Validación antes de crear»): devolver
  ese documento como requerimiento de la épica.
- **Está archivado** → no escribir en él; devolver su ruta e informar que el requerimiento está cerrado.

## Paso 3 — Mapeo de la épica a la plantilla de RQ

| Campo de Jira | Destino en `rq-template.md` | Regla |
|---------------|-----------------------------|-------|
| El issue completo | **Documento fuente**: `references/EPIC-<clave>-<AAAAMMDD-HHmm>.md` | Un issue no es un archivo, así que se guarda una **instantánea fiel**: resumen, descripción (normalizada a markdown, sin resumir), criterios de aceptación, estado, etiquetas, componentes, versión, `updated` y URL. No se edita después; una actualización posterior es un archivo nuevo. |
| `updated` | `source_document.name` («Epic <clave> (actualizada <fecha>)») y fila del **Historial del documento fuente** | Jira no numera revisiones: la versión del documento es la fecha y hora de `updated`. |
| Clave | Número del RQ (`RQ-<n>-[slug]`) y `work_item: { system: Jira, id: <clave>, url: <url> }` | Número sin padding y sin prefijo de proyecto. |
| `summary` | Título (`# RQ-<n>: …`) y slug de la carpeta | Slug kebab-case ≤ 5 palabras. |
| `description` | **Resumen**, `BR-XX` y `AC-XXX` | Extraer solo lo que el texto dice; fuente = «Epic <clave> — Descripción, <sección o párrafo>». |
| Campo «Acceptance Criteria» del proyecto, si la épica lo tiene | `AC-XXX` | Un criterio por ítem; fuente = «Epic <clave> — Criterios de aceptación, ítem <n>». Si ya traen identificador, se cita en la fuente; el `AC-XXX` local se asigna igual. |
| `status` | — | Solo orienta. `Ready` se concede con el DoR del RQ, nunca por el estado de Jira. |
| `labels`, `components`, `fixVersions` | **Observaciones** (una línea «Gestión: …») | Registrar, no interpretar. |
| Hijos (`parent = <clave>`: historias, tareas) | **Observaciones** | Citar cuántos tiene y sus claves. **No son documento fuente** ni generan criterios: las historias se sincronizan con `/work-define sync`. |
| Adjuntos y comentarios | **Referencias** / **Observaciones** | Citar como fuentes; no copiar su contenido. Un adjunto que el usuario aporte como archivo sí se guarda en `references/`. |
| `definition_owner` | Frontmatter | **No existe en Jira** (`reporter`/`assignee` son quién registró o atiende el issue, no el dueño de la definición). Se pregunta junto con la confirmación de criterios; sin respuesta, el RQ queda `Draft` con la laguna en Observaciones. |

### Numeración

El RQ que nace de una épica **lleva el número de su clave**, sin padding de ceros y sin el prefijo del
proyecto (`PAG-4500` → `RQ-4500-pagos-digitales`), igual que todo lo que baja del tracker («La clave de
Jira manda» en la base común). Antes de crear la carpeta, comprobar que ese número no esté ya en uso en
`requirements/` (activo y archivo) **con ningún prefijo**: los tres comparten numeración. Si lo ocupa un
documento que no es de esta épica (uno local con ese número, o una épica de **otro proyecto** con el mismo
número), **parar y preguntar**; no renumerar ninguno de los dos por cuenta propia.

Los documentos redactados localmente siguen con el secuencial único de siempre, que se calcula sobre el
mayor número existente: después de un `RQ-4500`, el siguiente local será `4501`.

## Paso 4 — Confirmación y estado

Igual que el paso 6 de «Crear un RQ»: una sola pregunta con la tabla de `AC-XXX`, la Cobertura de la fuente
y el dueño de la definición. Confirmado y sin `Pendiente` → `Ready`; si no, `Draft`. Una épica sin
descripción ni criterios da un RQ `Draft` con «Sin criterios en el issue» en Observaciones — **no se
rellena** con el contenido de sus historias hijas.

**Llegando desde `work-define sync`** (`origen=work-define-sync`): el tipo es RQ sin pregunta de Paso 0 y
**este skill no pregunta nada**. Crea el RQ en `Draft` y devuelve a `work-define` la ruta del `README.md`,
el `RQ-<n>` y lo que queda por confirmar (tabla de `AC-XXX`, Cobertura de la fuente, dueño de la
definición); `work-define` lo presenta en la tanda única de su `sync` y devuelve las respuestas, con las que
este skill completa el RQ y fija el `status`. El cierre **no** ofrece `/test-define`: cierra `work-define`.
Un RQ que queda en `Draft` no bloquea la sincronización de la historia.

## Anti-patrones (propios de este delta)

- Escribir en Jira, o enlazar/desenlazar la épica de sus historias.
- Crear un segundo RQ para una épica que ya tiene carpeta `RQ-<n>-*` o un documento con su `work_item.id`.
- Numerar con el secuencial local un RQ descargado de Jira, rellenar el número con ceros, o meter el prefijo del proyecto en el nombre de la carpeta.
- Derivar `AC-XXX` de las historias hijas o de comentarios, o conceder `Ready` porque la épica está en curso.
- Enlazar a la épica como documento fuente sin guardar la instantánea en `references/`.
- Descargar como RQ una historia, una tarea o una iniciativa.
