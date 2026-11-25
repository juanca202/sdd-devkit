# Herramienta de pruebas: tipo de issue de Jira (`issue-type`)

> **Se llega aquí desde** [`../jira.md`](../jira.md), cuando `projectManagement.testManagement` es
> `issue-type`. La base común de Jira ([`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../../references/project-managers/jira.md))
> ya debe estar leída: clave del issue y número local, campo `work_item`, límites de formato y contrato
> de reconstrucción íntegra aplican tal cual.

Módulo para proyectos cuyos casos de prueba **son issues de Jira**: Xray, el Zephyr Squad antiguo
(servidor / Data Center y la nube «legacy») o un tipo de issue propio (`Test Case`, `Caso de prueba`).
Usa el MCP de Jira; no necesita ningún otro.

## Dónde vive el caso de prueba

El caso de prueba es un **issue** de un tipo específico. No hay equivalente al Test Plan → Test Suite de
otros gestores; lo que lo ancla es **su tipo de issue** y **su vínculo con la historia** que prueba.

## Paso 1 — Resolver el tipo de issue de prueba (antes de crear el TC)

Consultar los tipos de issue del `project` configurado, una vez por corrida:

| Lo que tiene el proyecto | Qué se hace |
|--------------------------|-------------|
| Un tipo de issue de prueba (`Test` de Xray o del Zephyr Squad antiguo, o uno propio: `Test Case`, `Caso de prueba`) | Es el tipo con el que se crean y se leen los TC. |
| Varios candidatos | **Preguntar** cuál usar; no elegir por nombre parecido. |
| Ninguno | El módulo configurado no corresponde al proyecto: informar al usuario (si usa Zephyr, el valor correcto de `testManagement` es `zephyr`) y continuar con **numeración local secuencial**, sin `work_item`. No crear `Task` ni `Story` como sustituto. |

Los demás objetos de la app (planes, conjuntos y ejecuciones de prueba) **no se crean ni se modifican**
desde este skill.

## Paso 2 — Crear el issue de prueba enlazado a su historia

Antes de generar cada archivo local `TC-XXX-[slug].md`, crear el issue vía MCP:

| Campo | Valor |
|-------|-------|
| **Resumen (`summary`)** | El título GWT del TC (`Dado…, Cuando…, Entonces…`). Si supera 255 caracteres, abreviar conservando el sentido del escenario; el título completo permanece en el encabezado del archivo local (`# TC-{{XXX}} — …`). |
| **Tipo de issue** | El resuelto en el Paso 1. |
| **Pasos de ejecución** | El campo de pasos de la app **solo si el MCP lo expone** (en Xray los pasos se gestionan por su propia API, no por los campos estándar de Jira). Si no, dentro de Descripción, bajo «Pasos de ejecución», como tabla con una fila por paso (actor, acción, resultado esperado). |
| **Descripción** | El resto del documento completo, con los mismos encabezados que el `.md`: Perspectiva, Tipo de prueba, Criterio de aceptación, Artefacto padre, Precondiciones, Datos de prueba, Resultado esperado final, Observaciones. |
| **Prioridad** | `priority` solo si el esquema del proyecto tiene valores equivalentes (`High` / `Medium` / `Low`); si no, queda en Descripción. |
| **Sprint / componentes / versión / asignado** | Omitir: no son configurables (ver la base común). |
| **Vínculo con el padre** | Si el artefacto origen (US/WI/FT/RQ) tiene `work_item`, enlazar el issue de prueba a ese issue con el vínculo `tests` (el padre queda «is tested by») o, si la instancia no tiene ese tipo de vínculo, `relates to`. **Obligatorio** cuando el padre tiene `work_item`: es lo que permite reencontrar los TC de una historia. Si el padre no tiene `work_item`, crear el issue sin vínculo y decirlo. |

Tras la llamada, extraer la clave (`PAG-2210`) y usar su número como número del TC:
`TC-2210-[slug].md`, con la clave completa en `work_item.id`. Verificar que no exista ya `TC-2210-*.md`
en el `test-cases/` del artefacto antes de crear.

## Lectura (`sync`)

Solo con el modificador explícito `sync` del `SKILL.md`, que crea los TC locales que falten y actualiza los que existan. **Por defecto, bajada Jira → repo**: aquí no se crea ni se
modifica ningún issue. La subida existe solo con `sync … push`: diff inverso, confirmación y escritura de
lo confirmado con el mapeo del Paso 2 (resumen, pasos, prioridad); un TC sin `work_item` se ofrece crear
enlazado al issue del padre **sin renumerar** el TC local; estado y vínculos no se tocan salvo petición
expresa. Degradación sin MCP: pedir el contenido pegado (resumen, pasos, datos) e indicar la clave. Si el
Paso 1 resolvió que el proyecto no tiene issues de prueba, `sync` no está disponible para TC: informarlo.

### Resolver qué issues de prueba entran

| Entrada | Cómo se resuelven |
|---------|-------------------|
| Clave de un issue de prueba | Ese. Su padre es el issue al que apunta su vínculo `tests` (o `relates to`); si tiene varios, preguntar cuál es el artefacto padre. |
| Clave de una `Story` / `Task` / `Bug` / `Epic` documentado localmente | Los issues del tipo de prueba enlazados a él con `is tested by` (o `relates to`), sin duplicar. |

El padre **local** es la US/WI/FT/RQ cuyo frontmatter tenga `work_item.id: <clave-del-padre>`. Sin él, parar y
sugerir `/work-define sync <clave>` (o `/requirement-refine sync <clave>` si el padre es una épica).

### Mapeo de campos a la plantilla de TC

| Campo de Jira | Campo de `test-case-template.md` | Regla |
|---------------|----------------------------------|-------|
| Clave | Número (`TC-<n>-[slug].md`) y `work_item: { system: Jira, id: <clave>, url: <url> }` | Sin padding y sin prefijo de proyecto. |
| `summary` | Título `# TC-<n> — …` | Si ya es GWT (Dado/Cuando/Entonces o Given/When/Then) se conserva; si no, se conserva **tal cual** y se anota en Observaciones que no sigue GWT — no se reescribe el escenario. Slug kebab-case ≤ 5 palabras. |
| Pasos de la app (si el MCP los expone) o tabla/lista de pasos de la descripción | **Pasos de ejecución** | Una fila por paso, en orden. `Actor`: el que indique el texto; si no lo indica, `usuario` y nota en Observaciones. Si los pasos viven en la app y el MCP no los devuelve, **no reconstruirlos**: pedirlos pegados y dejar el TC en `Draft` hasta tenerlos. |
| Datos de la descripción (o del paso, en la app) | **Datos de prueba** | Un campo por dato; `N/A` si no hay. |
| `description` y precondiciones enlazadas | **Precondiciones** si el texto lo es (o lleva ese encabezado); el resto a **Observaciones** | Normalizar a markdown. Una precondición que sea otro issue se cita con su clave. |
| `priority` | `Prioridad` | `Highest`/`High` → Alta · `Medium` → Media · `Low`/`Lowest` → Baja. Otro esquema: preguntar. |
| `status` / `resolution` | `status` | El estado de Jira **solo orienta**: `Ready` se concede si criterio, perspectiva y tipo quedaron resueltos (si no, `Draft` con laguna). Un issue cerrado como obsoleto, duplicado o descartado → `Obsolete` previa confirmación (nunca borrar el archivo). |
| `labels`, resumen | `Tipo de prueba` y `Perspectiva` | Solo si lo dicen de forma explícita (etiquetas `api`, `e2e`, `content`/`contenido`, `style`/`estilo`, `manual`, `happy`, `error`, `limite`/`boundary`, o el resumen). Si no, se preguntan en la tanda única del flujo; con `createDetailsMode: never`, `Draft` con laguna. Que la app marque el caso como automatizado **no** fija el tipo. |
| Descripción, resumen o etiquetas que citen un identificador de criterio (`AC-003`, `CA-2`, `1.1`) | `Criterio de aceptación` y `criterion` | Solo si el identificador **existe verbatim** en la sección de criterios del padre local; si no existe o no se cita, se pregunta en la tanda única (o queda `—` y `Draft`). |
| Vínculo `tests` / `relates to` | `Artefacto padre` (`parent`) | El padre local resuelto arriba. |
| Comentarios y adjuntos | **Observaciones** | Citar como fuente; no copiar como especificación. |

### Actualizar — qué compara

Título, pasos (por posición y texto), datos de prueba, precondiciones, prioridad y estado. Diff en una
sola tanda; se aplica lo confirmado con las reglas del flujo de actualización (identificador y archivo
intactos; `Obsolete` en vez de borrar). Si cambia el resultado esperado de un TC que ya está automatizado
(hay prueba con su ID en el repo), avisar de que la prueba queda desalineada y remitir a `work-implement`.

### Anti-patrones de lectura

- Crear la carpeta del padre o un `README.md` de US desde `test-define` para poder sincronizar un TC.
- Trazar un TC a un criterio que no cita explícitamente, o inventar perspectiva/tipo para dejarlo `Ready`.
- Resumir, reordenar, fusionar o reconstruir pasos que el MCP no devolvió.
- Escribir en Jira desde `sync` sin `push`; con `push`, ejecutar transiciones, cambiar vínculos o clave, o crear un segundo issue para un TC que ya tiene `work_item`.

## Anti-patrones específicos

- Crear los TC como `Task`, `Story` o `Sub-task` porque el proyecto no tiene un tipo de issue de prueba.
- Elegir el tipo de issue de prueba por parecido de nombre cuando hay varios candidatos, sin preguntar.
- Crear el issue de prueba sin enlazarlo al issue de su historia cuando esta tiene `work_item`.
- Crear o modificar planes, conjuntos o ejecuciones de prueba de la app.
- Omitir los Pasos de ejecución **tanto** del campo de la app **como** de la Descripción — deben quedar
  registrados en algún lugar del issue.

## Ejemplo — Repo vinculado a Jira con MCP disponible

- *Contexto:* `project-management.md` resolvió `provider: jira`, `project: PAG`, `testManagement: issue-type`. MCP de Jira disponible. El
  proyecto tiene el tipo de issue `Test`. La US padre (`US-1500: Endpoint de autenticación`) tiene
  `work_item: { system: Jira, id: PAG-1500, url: https://…/browse/PAG-1500 }`.
- *Entrada:* generar TCs para `AC-001` de `US-1500`.
- *Comportamiento:* El agente detecta Jira (en `SKILL.md`), lee la base común, el delta de Jira y este módulo, y
  verifica el MCP. Resuelve el tipo de issue de prueba (`Test`, único candidato). Crea el issue: resumen GWT
  (abreviado si supera 255 caracteres), Descripción con el documento completo serializado por secciones
  —incluida la tabla de Pasos de ejecución, porque el MCP no expone el campo de pasos de la app— y
  vínculo `tests` hacia `PAG-1500`. Jira devuelve `PAG-2210`; genera
  `TC-2210-login-credenciales-validas-happy.md` con `work_item` (`system: Jira`, `id: PAG-2210`). El resto
  del flujo de `test-define` (Pasos 4 y 5) continúa normalmente; los siguientes TC reutilizan el tipo ya
  resuelto.
