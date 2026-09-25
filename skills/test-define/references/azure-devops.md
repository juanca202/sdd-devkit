# Integración con Azure DevOps — `test-define`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/azure-devops.md`](../../../references/project-managers/azure-devops.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, construcción de la URL, campo `Work Item (ADO)`, uso del `id` de ADO como número
> local, límite de 255 caracteres del título, contrato de reconstrucción íntegra y anti-patrones
> comunes. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `test-define`**. Se activa desde «Resolución de la integración con el
gestor de proyectos» en `SKILL.md` y aplica a los TC generados en su Paso 3.

## Jerarquía de Azure Test Plans

En ADO, un Test Case **no vive suelto**: cuelga de un **Test Suite**, que a su vez cuelga de un **Test
Plan**. Esta jerarquía (`Test Plan → Test Suite → Test Case`) es independiente de la jerarquía genérica
de work items (padre/hijo) y **debe respetarse siempre**. A diferencia de la vinculación al padre, que
es best-effort, **la pertenencia al Test Suite no es opcional**.

## Paso 1 — Resolver la jerarquía (antes de crear el TC)

Ninguno de los dos niveles se crea si ya existe uno con el nombre correcto — **reutilizar siempre el
existente**.

1. **Test Plan** — su nombre es el del **proyecto de Azure DevOps** al que está vinculado el repo
   (el `project` resuelto en `project-management.md`).
   Buscarlo vía MCP en el proyecto; **si no existe, crearlo** antes de continuar.
2. **Test Suite** — su nombre es el de la **historia de usuario o work item padre** del artefacto
   origen: el título completo tal como aparece en su `README.md` (p. ej.
   `US-003: Endpoint de autenticación`, o el título del `WI-XXX` / `FT-XXX` correspondiente).
   Buscarlo vía MCP **dentro del Test Plan resuelto**; si no existe, crearlo ahí.

Extraer los identificadores de ambos (creados o reutilizados): anclan el Test Case en el lugar correcto.

## Paso 2 — Crear el Test Case dentro del Test Suite

Antes de generar cada archivo local `TC-XXX-[slug].md`, crear el work item vía MCP **dentro del Test
Suite resuelto**, nunca como work item aislado:

| Campo | Valor |
|-------|-------|
| **Título** | El título GWT del TC (`Dado…, Cuando…, Entonces…`). Si supera 255 caracteres, abreviar conservando el sentido del escenario; el título completo permanece en el encabezado del archivo local (`# TC-{{XXX}} — …`). |
| **Tipo de work item** | `Test Case` (o el equivalente configurado en el proyecto). |
| **Pasos de ejecución** | Campo dedicado `Microsoft.VSTS.TCM.Steps` si existe: un paso del work item por cada fila de la tabla **Pasos de ejecución** (acción del actor + resultado esperado). Si el MCP no lo expone, incluirlos dentro de Descripción. |
| **Descripción** | El resto del documento completo, con los mismos encabezados que el `.md`: Perspectiva, Criterio de aceptación, Artefacto padre, Precondiciones, Datos de prueba, Resultado esperado final, Observaciones. |
| **Iteración / Area Path** | Omitir: no son configurables (ver la base común). ADO aplica los valores por defecto del proyecto. |
| **Test Suite** | Agregar el TC al Test Suite resuelto en el Paso 1 (mecanismo que provea el MCP). **Obligatorio.** |
| **Padre** | Trazabilidad adicional, best-effort: si el artefacto origen (US/WI/FT) tiene un `Work Item (ADO)` en su encabezado, vincular el TC a ese work item con la relación «Tests» / «Tested By». |

Tras la llamada, extraer el `id` numérico y usarlo como número del TC: `TC-<ado_id>-[slug].md`.
Verificar que no exista ya `TC-<ado_id>-*.md` en el `test-cases/` del artefacto antes de crear.

## Lectura (`sync`)

Solo con el modificador explícito `sync` de `SKILL.md`, que crea los TC locales que falten y actualiza los que existan. **Dirección única ADO → repo**: aquí no se crea ni se
modifica ningún work item, plan ni suite. Degradación sin MCP: pedir el contenido pegado (título, pasos,
parámetros) e indicar el `id`.

### Resolver qué Test Cases entran

| Entrada | Cómo se resuelven los Test Cases |
|---------|----------------------------------|
| `#id` de un `Test Case` | Ese. Su padre se obtiene de la relación «Tests» (el work item que prueba) o, si falta, del Test Suite que lo contiene: la suite lleva el título del padre (`US-4821: …`), del que se extrae el `id`. |
| `#id` de `User Story` / `PBI` / `Task` / `Bug` / `Feature` documentado como FT | Los work items de tipo `Test Case` con relación «Tested By» hacia él **más** los que cuelgan del Test Suite con su título dentro del Test Plan del proyecto (unión, sin duplicar). |

El padre **local** es la US/WI/FT cuya cabecera tenga `Work Item (ADO): [#<id-del-padre>]`. Sin él, parar y
sugerir `/work-define sync #<id>`.

### Mapeo de campos a la plantilla de TC

| Campo de ADO | Campo de `test-case-template.md` | Regla |
|--------------|----------------------------------|-------|
| `id` | Número (`TC-<id>-[slug].md`) y `Work Item (ADO): [#<id>](<url>)` | Sin padding. |
| `System.Title` | Título `# TC-<id> — …` | Si ya es GWT (Dado/Cuando/Entonces o Given/When/Then) se conserva; si no, se conserva **tal cual** y se anota en Observaciones que no sigue GWT — no se reescribe el escenario. Slug kebab-case ≤ 5 palabras. |
| `Microsoft.VSTS.TCM.Steps` (XML: `<step>` con `action` y `expectedresult`) | **Pasos de ejecución** | Una fila por `<step>`, en orden, HTML normalizado. `Actor`: el que indique el texto; si no lo indica, `usuario` y nota en Observaciones. Un `shared step` se expande en sus pasos citando el id del shared step. |
| `Microsoft.VSTS.TCM.Parameters` + `Microsoft.VSTS.TCM.LocalDataSource` | **Datos de prueba** | Un campo por parámetro; una fila por juego de valores (o `N/A`). Los `@param` de los pasos se dejan como referencia al campo. |
| `System.Description` | **Precondiciones** si el texto lo es (o lleva ese encabezado); el resto a **Observaciones** | HTML → markdown. |
| `Microsoft.VSTS.Common.Priority` | `Prioridad` | `1` → Alta · `2` → Media · `3`/`4` → Baja. |
| `System.State` | `Estado` | `Design` → `Draft` · `Ready` → `Ready` **solo si** criterio, perspectiva y tipo quedaron resueltos (si no, `Draft` con laguna) · `Closed` → `Obsolete` previa confirmación (al actualizar, ofrecerlo; nunca borrar el archivo). |
| `Microsoft.VSTS.TCM.AutomationStatus`, `System.Tags`, título | `Tipo de prueba` y `Perspectiva` | Solo si lo dicen de forma explícita (etiquetas `api`, `e2e`, `ui`, `manual`, `happy`, `error`, `limite`/`boundary`, o el título). Si no, se preguntan en la tanda única del flujo; con `createDetailsMode: never`, `Draft` con laguna. `AutomationStatus = Automated` **no** fija el tipo. |
| Descripción, título o etiquetas que citen un identificador de criterio (`AC-003`, `CA-2`, `1.1`) | `Criterio de aceptación` y `criterion=` de la marca | Solo si el identificador **existe verbatim** en la sección de criterios del padre local; si no existe o no se cita, se pregunta en la tanda única (o queda `—` y `Draft`). |
| Relación «Tests» / suite | `Artefacto padre` y `parent=` | El padre local resuelto arriba. |
| Comentarios y adjuntos | **Observaciones** | Citar como fuente; no copiar como especificación. |

### Actualizar — qué compara

Título, pasos (por posición y texto), datos de prueba, precondiciones, prioridad y estado. Diff en una
sola tanda; se aplica lo confirmado con las reglas del flujo de actualización (identificador y archivo
intactos; `Obsolete` en vez de borrar). Si cambia el resultado esperado de un TC que ya está automatizado
(hay prueba con su ID en el repo), avisar de que la prueba queda desalineada y remitir a `work-implement`.

### Anti-patrones de lectura

- Crear la carpeta del padre o un `README.md` de US desde `test-define` para poder sincronizar un TC.
- Trazar un TC a un criterio que no cita explícitamente, o inventar perspectiva/tipo para dejarlo `Ready`.
- Resumir, reordenar o fusionar pasos del campo `Steps`.
- Escribir en ADO (estado, título, suite) desde `sync`.

## Anti-patrones específicos

- Crear el Test Case como work item aislado sin resolver ni asignar su Test Plan y Test Suite.
- Crear un Test Plan o Test Suite nuevo cuando ya existe uno con el nombre correcto.
- Nombrar el Test Suite con un texto distinto al título de la US/WI/FT padre (p. ej. una descripción
  libre), rompiendo la trazabilidad de la jerarquía.
- Omitir los Pasos de ejecución **tanto** del campo `Steps` **como** de la Descripción cuando el MCP no
  expone un campo dedicado — deben quedar registrados en algún lugar del work item.

## Ejemplo — Repo vinculado a ADO con MCP disponible

- *Contexto:* `project-management.md` resolvió `project: MyProject`. MCP de ADO disponible. La
  US padre (`US-003: Endpoint de autenticación`) tiene `Work Item (ADO): [#1500](https://dev.azure.com/…)`
  en su encabezado.
- *Entrada:* generar TCs para `AC-001` de `US-003`.
- *Comportamiento:* El agente detecta ADO (en `SKILL.md`), lee la base común y este archivo, y verifica
  el MCP. Resuelve la jerarquía: busca el Test Plan `MyProject` — no existe, lo crea; busca dentro de él
  el Test Suite `US-003: Endpoint de autenticación` — no existe, lo crea. Con el Suite resuelto, crea el
  work item `Test Case` dentro de él: título GWT (abreviado si supera 255 caracteres), Pasos de
  ejecución en el campo `Steps`, Descripción con el resto del documento serializado por secciones, y
  vinculado además a `#1500` si el MCP lo permite. Extrae `id: 2210` y genera
  `TC-2210-login-credenciales-validas-happy.md` con `Work Item (ADO): [#2210](…)` en el encabezado. El
  resto del flujo de `test-define` (Pasos 4 y 5) continúa normalmente. Para el siguiente TC del mismo
  `AC-001` (u otro AC de `US-003`), reutiliza el mismo Test Plan y Test Suite sin volver a crearlos.
