# Integración con Jira — `work-define`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../references/project-managers/jira.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, clave del issue y número local, construcción de la URL, campo `work_item`,
> normalización de la Descripción y anti-patrones comunes. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `work-define`**. Se activa desde el modificador `sync` de `SKILL.md`
(flujo [Sincronizar](flow.md#flujo-sincronizar-una-historia-desde-el-gestor-de-proyectos-sync) en `flow.md`), que crea la US local
si no existe y la actualiza si ya existe.

> **Rol de esta integración: bajar por defecto, subir solo con `push`.** Al redactar, `work-define` **no
> crea ni modifica issues** en Jira. `sync` trae el issue al repositorio (Jira → repo); `sync … push`
> sube la US local al issue (repo → Jira) únicamente cuando el usuario lo pide — ver «Dirección de la
> sincronización» en la base común y [Subida (`push`)](#subida-push) abajo.

> **Degradación sin MCP.** No se crea nada con secuencial local en silencio.
> ```
> ⚠️ El repo está vinculado a Jira pero el MCP no está conectado.
> No puedo leer el issue <clave> automáticamente.
> Pégame su resumen, descripción y criterios de aceptación, o conecta el MCP de Jira desde el menú de herramientas.
> ```
> Con el contenido pegado, el flujo continúa igual y el número de la US es el de la clave indicada.

## Paso 1 — Leer el issue y verificar el tipo

Obtener el issue por su clave (`PAG-4821`, `#4821`, `4821` dentro del `project` configurado, o la URL
`<host>/browse/PAG-4821`) y leer `issuetype` (nombre y `hierarchyLevel`):

| Tipo de issue | Acción |
|---------------|--------|
| `Story` (o el tipo de nivel estándar que el proyecto use como historia: `Historia`, `User Story`) | **Sincronizar** como `US-<n>` (crear o actualizar). |
| `Epic` (`hierarchyLevel: 1`) | **No** es una historia, es un requerimiento: remitir a `/requirement-refine sync <clave>` (lo descarga como `RQ-<n>`) y ofrecer además listar sus historias hijas (`parent = <clave>`) para sincronizarlas. |
| `Sub-task` · `Task` | Es un `TK-XXX`/`WI-XXX`: remitir a `/work-plan sync <clave>`. |
| `Bug` | Es un incidente `BUG-XXX`: remitir a `/work-plan sync <clave>`; para diagnosticarlo, «Analizar issue» de `work-research`. |
| Caso de prueba de la herramienta de pruebas (con Zephyr, una clave `PAG-T123`, que no es un issue; con `issue-type`, un issue del tipo de prueba) | Es un `TC-XXX`: remitir a `/test-define sync <clave>`. |
| Otro (iniciativa, tipo propio del proyecto) | Preguntar al usuario qué espera antes de hacer nada. |

Los nombres de tipo son configurables y se traducen: si el tipo devuelto no está en la tabla, **no
adivinar** (ver la base común). Un equipo que redacta sus historias como `Task` debe decirlo: sin esa
confirmación, una `Task` no se sincroniza como US.

## Paso 2 — Mapeo de campos a la plantilla de US

| Campo de Jira | Sección de `user-story-template.md` | Regla |
|---------------|-------------------------------------|-------|
| Clave (`PAG-4821`) | Número de la US (`US-4821-[slug]`) y `work_item: { system: Jira, id: PAG-4821, url: <url> }` en el frontmatter | Número sin padding y sin prefijo de proyecto; la clave completa va en `work_item.id`. |
| `summary` | Título (`# US-<n>: …`) y slug de la carpeta | Slug kebab-case ≤ 5 palabras; el título completo queda en el encabezado. |
| `description` | **Descripción** (COMO / QUIERO / PARA) y **Contexto** | Normalizar a markdown. Si el texto ya trae la forma COMO/QUIERO/PARA (o *As a / I want / So that*), mapearla campo a campo; si no, redactar las tres líneas **a partir del texto, sin añadir nada que no diga**, y llevar el texto original íntegro a **Contexto**. |
| Campo «Acceptance Criteria» / «Criterios de aceptación» del proyecto, si existe | **Criterios de aceptación** | Un criterio por ítem. Ver «Identificadores de los criterios» abajo. **Jira no trae este campo de serie:** si el proyecto no lo tiene, extraer los criterios del encabezado «Criterios de aceptación» / «Acceptance Criteria» de la descripción (o de su lista de comprobación, si la hay). |
| `status` (por `statusCategory`) | `status` (frontmatter) | Solo orienta: `To Do` → `Draft`. `In Progress` → candidata a `Ready`, **que se concede únicamente si pasa los criterios de Ready del skill**; si no los pasa, `Draft` con las lagunas en Observaciones y el estado de Jira anotado. `Done` → avisar: la historia ya está cerrada en Jira; sincronizar solo si el usuario lo confirma (típico en `implementation.scope: tests`). |
| `labels`, `components`, `fixVersions`, sprint | **Contexto** (una línea «Gestión: …») | Registrar, no interpretar. |
| `parent` de nivel épica (o «Epic Link»), o vínculo a un `Epic` | `requirement` (frontmatter) y **Referencias** | Es el **requerimiento de origen** de la historia: se enlaza a su `RQ-XXX`, que `/requirement-refine` descarga si aún no existe. Ver [Épica enlazada → requerimiento](#épica-enlazada--requerimiento-rq-xxx). |
| Vínculos (`blocks` / `is blocked by`, `relates to`) a otras historias | **Dependencias** (tablas INVEST/DoR de `story-validation.md`) y Observaciones | Si la otra historia ya existe localmente (`work_item.id: <clave>` en su frontmatter), enlazarla; si no, citar su clave. |
| Adjuntos y comentarios | **Observaciones** | Citar como fuentes («ver comentario del <fecha> en Jira»); **no** copiar su contenido a la especificación. Si un comentario cambia un criterio, es una laguna que el usuario debe confirmar. |
| Campo de estimación («Story Points» / «Story point estimate») | **Complejidad** (`story-validation.md`) | Solo si la escala coincide con la Fibonacci de la plantilla; si no, anotar el valor de Jira en Observaciones y dejar la complejidad sin fijar. |
| `repositories` | Frontmatter | **No existe en Jira** (el panel de desarrollo no es fuente). Es el único dato que se pregunta al usuario, salvo que sea inferible del repo (repo único) o ya esté en la US local (al actualizar). **Con `implementation.scope: tests` no se pregunta nunca:** se pobla con el nombre del propio repositorio de pruebas. |

### Identificadores de los criterios

`test-define` y `coverage-verify` exigen que cada criterio tenga **un identificador codificado y único**.

- Si los criterios de Jira **ya traen** identificador (`AC-001`, `CA-1`, `1.1`, `R-3`…), usarlo **verbatim**
  y anotar en Observaciones que la numeración proviene de Jira.
- Si vienen como viñetas, casillas, párrafos o lista numerada implícita, asignar `AC-001`, `AC-002`… **en
  el orden en que aparecen** y anotar en Observaciones «Identificadores `AC-XXX` asignados localmente; el
  issue no los codifica». La renumeración **no se escribe de vuelta** en Jira.
- Añadir la **categoría entre paréntesis** y ajustar el enunciado al vocabulario RFC 2119 **solo cuando no
  cambie el sentido**; si un criterio es ambiguo, no verificable o contradictorio con la descripción, se
  conserva tal cual, se marca como laguna en Observaciones y la US queda en `Draft`. **Nunca inventar,
  dividir ni fusionar criterios** por cuenta propia.

## Paso 3 — ¿Crear o actualizar?

Buscar en `changesPath/user-stories/` **y** `archivedPath/user-stories/`:

- una carpeta `US-<n>-*`, o
- una US cuyo frontmatter tenga `work_item.id: <clave>`.

Si no existe → crear. Si existe → actualizar (abajo). Si está archivada, parar y avisar (trabajo cerrado;
desarchivar lo decide el usuario). Una carpeta `US-<n>-*` cuyo `work_item.id` es **otra** clave es un
choque de número entre proyectos: parar y preguntar (ver la base común).

## Actualizar — qué compara y qué escribe

Leer el issue y la US local, y presentar **un diff por sección**: título, Descripción, Criterios de
aceptación (por identificador), Contexto de gestión y requerimiento de origen (la [épica enlazada](#épica-enlazada--requerimiento-rq-xxx): si la US no tiene `requirement` y el issue sí tiene épica, se resuelve y se enlaza). Aplicar **solo lo que el usuario confirme**, con las
reglas del flujo «Actualizar una historia»: los `AC-XXX` existentes son inmutables (un criterio nuevo en
Jira toma el siguiente libre; uno eliminado en Jira se marca `Obsolete`, no se borra); si cambia el
enunciado de un criterio que ya tiene `Casos de prueba:`, avisar de la desalineación y sugerir
`test-define`. `status`, INVEST y DoR se recalculan como en cualquier actualización. Tampoco se
**escribe en Jira**.

## Épica enlazada → requerimiento (`RQ-XXX`)

Al sincronizar una historia (crear **o** actualizar), si tiene una épica enlazada, la épica se registra como
su requerimiento de origen y se descarga como `RQ-XXX`. **Descargarla no se pregunta**: es parte de la bajada.
Lo que el RQ necesita confirmar va en la **tanda única** del `sync`, no en una pregunta aparte (paso 4).

1. **Detectar la épica.** Cuenta como épica enlazada un issue de nivel épica (`hierarchyLevel: 1`)
   alcanzado por: el campo `parent` de la historia (o «Epic Link» en proyectos antiguos); o un vínculo
   directo (`relates to` u otro) a un `Epic`. Si hay más de una, la del campo `parent` es el requerimiento
   y las demás se citan en Contexto; si hay varias y ninguna es el `parent`, **preguntar** cuál es. Un
   nivel por encima de la épica (iniciativa) solo se cita en Contexto. Sin épica → este apartado no aplica
   y `requirement` no se toca.
2. **Buscar su documento local.** En `<changesPath>/requirements/` y `<archivedPath>/requirements/`, un
   `RQ-*`/`PRD-*`/`SRS-*` cuyo frontmatter tenga `work_item.id: <clave-épica>`.
3. **Si no existe, descargarla:** handoff a `/requirement-refine` con el tipo `rq`, la clave de la épica y
   la pista **`origen=work-define-sync`** — como subagente si el cliente lo permite. Ese skill lee la épica
   y crea el RQ en `Draft` según su [delta de Jira](../../requirement-refine/references/jira.md) **sin
   preguntar nada**, y devuelve la ruta del `README.md`, el `RQ-<n>` y lo que queda **por confirmar**
   (tabla de `AC-XXX`, Cobertura de la fuente, dueño de la definición). `work-define` **no escribe** el RQ
   ni su carpeta. En un lote, las épicas distintas se resuelven **una vez cada una** y **antes** de crear
   las historias.
4. **Confirmar en la tanda única.** Lo pendiente de cada RQ nuevo se presenta **junto con** las demás
   preguntas del `sync` (repositorios, lagunas), en la misma tanda. Las respuestas se devuelven a
   `/requirement-refine`, que las aplica y fija el `status` (`Ready` si todo quedó confirmado; si no,
   `Draft`). Un RQ que ya existía no añade preguntas.
5. **Enlazar.** En la US: `requirement: ../../requirements/RQ-<n>-[slug]/README.md` en el frontmatter y, en
   **Referencias**, la línea «Requerimiento de origen» de la plantilla, con el enlace al `README.md` del RQ
   y «Epic <clave>: título». Si el documento está archivado, se enlaza en su ruta de archivo y se informa;
   no se desarchiva ni se vuelve a descargar.
6. **Si la US ya tenía `requirement`** apuntando a otro documento (p. ej. el `SRS-XXX` del que se
   descompuso), no se sobrescribe: mostrar ambos y preguntar cuál queda; el otro se conserva en Referencias.

Qué **no** cambia: los `AC-XXX` de la historia salen de **su** issue, no del RQ (el vínculo es
trazabilidad, no herencia de criterios); un RQ en `Draft` no baja la US a `Draft`; el RQ no se modifica
desde aquí; y con `push` la relación con la épica **no se escribe** en Jira. Sin MCP no se puede leer el
padre: si el usuario indica la clave de la épica al pegar el contenido, se sigue desde el paso 2; si no,
se omite y se dice en el cierre.

## Ejemplo

- *Contexto:* `project-management.md` resolvió `provider: jira`, `project: PAG`; MCP de Jira disponible; `implementation.scope: tests`.
- *Entrada:* «/work-define sync PAG-4821».
- *Comportamiento:* lee PAG-4821 (`Story`, categoría `In Progress`), mapea resumen y descripción, encuentra
  cinco criterios bajo el encabezado «Acceptance Criteria» de la descripción (el proyecto no tiene campo
  dedicado), sin código, y les asigna `AC-001…AC-005`. Su `parent` es el Epic PAG-4500: no hay ningún
  documento con `work_item.id: PAG-4500`, así que `/requirement-refine` lo descarga como
  `RQ-4500-pagos-digitales`; sus criterios y su dueño se confirman en la tanda única (no se pregunta el
  repositorio: es un repo de pruebas). Crea `<changesPath>/user-stories/US-4821-pago-con-tarjeta/README.md`
  con `work_item` (`system: Jira`, `id: PAG-4821`),
  `requirement: ../../requirements/RQ-4500-pagos-digitales/README.md`, INVEST/DoR calculados y
  `status: Ready`. Cierra: «Sincronizada US-4821 desde Jira (PAG-4821): creada →
  <changesPath>/user-stories/US-4821-pago-con-tarjeta/ · requerimiento RQ-4500 (Epic PAG-4500), Ready» y
  ofrece `/test-define` según `createMode`.

## Subida (`push`)

Solo con `sync … push` explícito. Leer el issue y la US local, presentar el **diff inverso** (lo que
la US tiene y el issue no refleja) y escribir **solo lo confirmado** con el mapeo del Paso 2 en sentido
contrario: título → `summary` (≤ 255; el completo queda local); Descripción (COMO/QUIERO/PARA) y
Contexto → `description` (mismos encabezados); Criterios de aceptación con sus `AC-XXX` → el campo de
criterios del proyecto si existe, o su encabezado dentro de la descripción si no; Complejidad → el campo
de estimación solo si la escala coincide. **No** se ejecutan transiciones ni se escriben sprint,
componentes, versión, `parent` ni vínculos salvo petición expresa. Si la US no tiene `work_item`, ofrecer
crearla como `Story` en el `project` configurado y añadir `work_item` al frontmatter **sin renumerar** la
US. Cerrar con «Subida US-XXX a Jira (<clave>): <secciones>».

## Casos de prueba y subtareas ya existentes

Si la historia sincronizada tiene subtareas, o casos de prueba en la herramienta de pruebas del proyecto
(se sabe sin consultarla solo cuando son issues enlazados; con Zephyr se ofrece igualmente), **no** se
sincronizan desde aquí: al cerrar, además del handoff habitual, ofrecer `/test-define sync <clave>` para
traer los casos de prueba bajo la US recién creada y `/work-plan sync <clave-subtarea>` para sus tareas.
`test-define` sin ese modificador generaría TCs nuevos desde los criterios, que no es lo mismo.

## Anti-patrones (propios de este delta)

- Crear o modificar el issue en Jira sin `push` explícito; con `push`, ejecutar una transición, cambiar el tipo o el padre, o crear un segundo issue para una US que ya tiene `work_item`.
- Sincronizar un `Epic` como si fuera una historia, o una `Task`/`Sub-task`/`Bug` como US sin que el usuario lo confirme.
- Abrir una tanda de preguntas aparte para el RQ, o confirmar sus criterios por cuenta propia sin devolver las respuestas a `/requirement-refine`.
- Redactar el `RQ-XXX` de la épica desde aquí en vez de delegarlo en `/requirement-refine`, o descargar una épica que ya tiene documento local.
- Copiar a la historia los criterios de la épica, o sobrescribir en silencio un `requirement` que ya apuntaba a otro documento.
- Crear una segunda US local para una clave que ya tiene carpeta o `work_item` registrado.
- Dar por existente un campo de criterios de aceptación, o buscar los criterios solo ahí cuando el proyecto los escribe en la descripción.
- Conceder `Ready` solo porque en Jira está en curso, sin pasar los criterios de Ready del skill.
- Completar criterios, dependencias o repositorios con lo que «probablemente» quiso decir el issue.
- Copiar comentarios o adjuntos como si fueran especificación.
