# Herramienta de pruebas: Zephyr (`zephyr`)

> **Se llega aquí desde** [`../jira.md`](../jira.md), cuando `projectManagement.testManagement` es
> `zephyr` (o no está definido). La base común de Jira ([`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../../references/project-managers/jira.md))
> ya debe estar leída: campo `work_item`, límites de formato, contrato de reconstrucción íntegra y
> dirección de `sync`/`push` aplican tal cual.

Módulo para **Zephyr** de SmartBear en Jira Cloud (el producto que se llamó Zephyr Scale; la edición
Zephyr Essential comparte el modelo de datos).

## Dónde vive el caso de prueba

En Zephyr un caso de prueba **no es un issue de Jira**: es un objeto de Zephyr con su propia clave,
`<PROYECTO>-T<n>` (p. ej. `PAG-T2210`), y su propia numeración, independiente de la de los issues. Se
organiza en **carpetas** dentro del proyecto y se relaciona con los issues por **trazabilidad** (enlaces
a issues), no por vínculos de Jira. Consecuencias:

- **Hace falta una herramienta MCP de Zephyr**, distinta de la de Jira (p. ej. el MCP de SmartBear, con
  herramientas `zephyr_*`). El MCP de Jira no ve los casos de prueba. Si el MCP de Zephyr no está
  disponible —o el plan de Zephyr no lo admite; la edición Essential no lo hace—, notificar y continuar:
  al crear, **numeración local secuencial** sin `work_item`; al leer, contenido pegado.

  ```
  ⚠️ El repo usa Zephyr para los casos de prueba pero el MCP de Zephyr no está conectado.
  <qué ocurre en su lugar: los TC se numeran localmente / no puedo leer el caso <clave>>.
  Para sincronizarlos, conecta el MCP de Zephyr desde el menú de herramientas.
  ```
- **Número local:** `PAG-T2210` → `TC-2210-[slug].md`, sin padding y sin `T`; la clave completa va en
  `work_item.id` con `system: Zephyr`. La `url` es la que devuelva la herramienta; si no devuelve
  ninguna, se omite la clave `url` (no se construye a mano).
- **Entrada de `sync`:** una clave `PAG-T2210` es un caso de Zephyr; una clave `PAG-1500` es un issue de
  Jira (el padre). No confundir las dos numeraciones.

Ciclos, planes y ejecuciones de prueba **no se crean ni se modifican** desde este skill.

## Resolver dónde se crea (antes de crear el TC)

La carpeta cumple el papel de agrupar los casos de una historia. No se crea si ya existe una con el
nombre correcto — **reutilizar siempre la existente**.

1. **Proyecto** — el `project` resuelto en `project-management.md` (su clave de Jira es también la de
   Zephyr). Si Zephyr no está habilitado en ese proyecto, informar y continuar con numeración local.
2. **Carpeta** (de tipo caso de prueba) — su nombre es el título completo del artefacto padre tal como
   aparece en su `README.md` (p. ej. `US-1500: Endpoint de autenticación`, o el del `WI-XXX` / `FT-XXX` /
   `RQ-XXX`). Buscarla en el proyecto; si no existe, crearla en la raíz de casos de prueba.
3. **Issue del padre** — si el artefacto padre tiene `work_item` de Jira, obtener ese issue con el MCP de
   Jira: el enlace de trazabilidad se crea con su **identificador interno**, no con la clave.

## Crear el caso

Antes de generar cada archivo local `TC-XXX-[slug].md`, crear el caso vía MCP en la carpeta resuelta:

| Campo de Zephyr | Valor |
|-----------------|-------|
| **Nombre** | El título GWT del TC (`Dado…, Cuando…, Entonces…`). Si supera 255 caracteres, abreviar conservando el sentido del escenario; el título completo permanece en el encabezado del archivo local. |
| **Carpeta** | La resuelta arriba. **Obligatoria.** |
| **Objetivo** | El resto del documento, con los mismos encabezados que el `.md`: Perspectiva, Tipo de prueba, Criterio de aceptación, Artefacto padre, Datos de prueba, Resultado esperado final, Observaciones. |
| **Precondición** | La sección **Precondiciones**. |
| **Pasos** (guion paso a paso) | Un paso por cada fila de la tabla **Pasos de ejecución**: descripción = actor + acción; datos de prueba = los que use ese paso; resultado esperado = el de la fila. En modo de reemplazo, nunca añadiendo a pasos previos. |
| **Prioridad** | `High` / `Normal` / `Low` para Alta / Media / Baja, **si** el proyecto conserva las prioridades por defecto; si las cambió, consultar las del proyecto y, sin equivalente claro, dejar la de por defecto y decirlo. |
| **Estado, responsable, etiquetas, componente** | Omitir: se deja el valor por defecto del proyecto. |
| **Enlace a issue (trazabilidad)** | El issue del artefacto padre. **Obligatorio** cuando el padre tiene `work_item`; si no lo tiene, crear el caso sin enlace y decirlo. |

Tras la llamada, extraer la clave (`PAG-T2210`) y usar su número como número del TC
(`TC-2210-[slug].md`). Verificar que no exista ya `TC-2210-*.md` en el `test-cases/` del artefacto antes
de crear.

## Lectura (`sync`)

Solo con el modificador explícito `sync` del `SKILL.md`, que crea los TC locales que falten y actualiza los
que existan. **Por defecto, bajada Zephyr → repo**: no se crea ni se modifica ningún caso, carpeta ni
enlace. La subida existe solo con `sync … push`: diff inverso, confirmación y escritura de lo confirmado con
el mapeo de [Crear el caso](#crear-el-caso) (nombre, objetivo, precondición, pasos en modo de reemplazo,
prioridad); un TC sin `work_item` se ofrece crear en la carpeta del padre **sin renumerar** el TC local;
estado, carpeta y enlaces no se tocan salvo petición expresa.

### Qué casos entran

| Entrada | Cómo se resuelven |
|---------|-------------------|
| Clave de un caso (`PAG-T2210`) | Ese. Su padre es el issue de su enlace de trazabilidad; si tiene varios, preguntar cuál es el artefacto padre; si no tiene ninguno, el que indique el nombre de su carpeta. |
| Clave de un issue de Jira (`PAG-1500`: historia, tarea, bug, épica) | Los casos enlazados a ese issue por trazabilidad **más** los de la carpeta que lleva el título del padre (unión, sin duplicar). |

El padre **local** es la US/WI/FT/RQ cuyo frontmatter tenga `work_item.id: <clave-del-issue>`. Sin él,
parar y sugerir `/work-define sync <clave>` (o `/requirement-refine sync <clave>` si es una épica).

### Mapeo de campos a la plantilla de TC

| Campo de Zephyr | Campo de `test-case-template.md` | Regla |
|-----------------|----------------------------------|-------|
| Clave | Número (`TC-<n>-[slug].md`) y `work_item: { system: Zephyr, id: <clave>, url: <url> }` | Sin padding y sin `T`. |
| Nombre | Título `# TC-<n> — …` | Si ya es GWT (Dado/Cuando/Entonces o Given/When/Then) se conserva; si no, se conserva **tal cual** y se anota en Observaciones que no sigue GWT — no se reescribe el escenario. Slug kebab-case ≤ 5 palabras. |
| Pasos (guion paso a paso) | **Pasos de ejecución** y **Datos de prueba** | Una fila por paso, en orden: descripción → acción, resultado esperado → resultado esperado. `Actor`: el que indique el texto; si no lo indica, `usuario` y nota en Observaciones. Los datos de cada paso se reúnen en **Datos de prueba**. Un paso que **llama a otro caso** se expande en sus pasos citando la clave del caso llamado. |
| Guion en texto plano o BDD (en vez de pasos) | **Pasos de ejecución** | Texto plano: un paso por línea o ítem, sin reinterpretar. BDD: un paso por cláusula `Given`/`When`/`Then`, conservando el texto. Anotar en Observaciones el tipo de guion de origen. |
| Precondición | **Precondiciones** | Normalizar a markdown. |
| Objetivo | Las secciones que traiga con sus encabezados (si lo serializó este skill, mapeo 1:1); si es texto libre, a **Observaciones** | No inventar lo que no diga. |
| Prioridad | `Prioridad` | `High` → Alta · `Normal` → Media · `Low` → Baja. Otro esquema: preguntar. |
| Estado | `status` | Con los estados por defecto: `Draft` → `Draft` · `Approved` → `Ready` **solo si** criterio, perspectiva y tipo quedaron resueltos (si no, `Draft` con laguna) · `Deprecated` → `Obsolete` previa confirmación (nunca borrar el archivo). Estados propios del proyecto: solo orientan. |
| Etiquetas, nombre, objetivo | `Tipo de prueba` y `Perspectiva` | Solo si lo dicen de forma explícita (etiquetas `api`, `e2e`, `content`/`contenido`, `style`/`estilo`, `manual`, `happy`, `error`, `limite`/`boundary`, o los encabezados del objetivo). Si no, se preguntan en la tanda única del flujo; con `createDetailsMode: never`, `Draft` con laguna. Que Zephyr marque el caso como automatizado **no** fija el tipo. |
| Objetivo, nombre o etiquetas que citen un identificador de criterio (`AC-003`, `CA-2`, `1.1`) | `Criterio de aceptación` (`criterion`) | Solo si el identificador **existe verbatim** en la sección de criterios del padre local; si no existe o no se cita, se pregunta en la tanda única (o queda `—` y `Draft`). |
| Enlace de trazabilidad / carpeta | `Artefacto padre` (`parent`) | El padre local resuelto arriba. |
| Comentarios, adjuntos, enlaces web | **Observaciones** | Citar como fuente; no copiar como especificación. |

### Actualizar — qué compara

Nombre, pasos (por posición y texto), datos de prueba, precondición, prioridad y estado. Diff en una sola
tanda; se aplica lo confirmado con las reglas del flujo de actualización (identificador y archivo
intactos; `Obsolete` en vez de borrar). Si cambia el resultado esperado de un TC que ya está automatizado
(hay prueba con su ID en el repo), avisar de que la prueba queda desalineada y remitir a `work-implement`.

## Anti-patrones

- Crear el caso de prueba como issue de Jira (`Task`, `Story`, `Sub-task`) porque el MCP de Zephyr no está
  disponible, en vez de degradar a numeración local.
- Crear el caso suelto, sin carpeta, o crear una carpeta nueva cuando ya existe una con el título del padre.
- Nombrar la carpeta con un texto distinto al título de la US/WI/FT/RQ padre.
- Omitir el enlace de trazabilidad al issue del padre cuando este tiene `work_item`, o intentar crearlo
  como vínculo de Jira.
- Usar el número del caso como si fuera el de un issue (o al revés), o guardar `work_item.system: Jira`
  en un TC de Zephyr.
- Añadir pasos a los existentes al subir, en vez de reemplazarlos; resumir, reordenar o fusionar pasos.
- Crear o modificar ciclos, planes o ejecuciones de prueba.
- Escribir en Zephyr desde `sync` sin `push`; con `push`, cambiar estado, carpeta o enlaces, o crear un
  segundo caso para un TC que ya tiene `work_item`.
- Trazar un TC a un criterio que no cita explícitamente, o inventar perspectiva/tipo para dejarlo `Ready`.

## Ejemplo

- *Contexto:* `project-management.md` resolvió `provider: jira`, `project: PAG`, `testManagement: zephyr`.
  MCP de Jira y MCP de Zephyr disponibles. La US padre (`US-1500: Endpoint de autenticación`) tiene
  `work_item: { system: Jira, id: PAG-1500, url: https://…/browse/PAG-1500 }`.
- *Entrada:* generar TCs para `AC-001` de `US-1500`.
- *Comportamiento:* El agente detecta Jira (en `SKILL.md`), lee la base común, el delta de Jira y este
  módulo, y verifica ambos MCP. Busca en el proyecto `PAG` la carpeta `US-1500: Endpoint de autenticación`
  — no existe, la crea. Obtiene el issue `PAG-1500` para tener su identificador interno. Crea el caso en
  esa carpeta: nombre GWT (abreviado si supera 255 caracteres), objetivo con el resto del documento
  serializado por secciones, precondición, pasos uno por fila y enlace de trazabilidad a `PAG-1500`.
  Zephyr devuelve `PAG-T2210`; genera `TC-2210-login-credenciales-validas-happy.md` con `work_item`
  (`system: Zephyr`, `id: PAG-T2210`). El resto del flujo de `test-define` (Pasos 4 y 5) continúa
  normalmente; los siguientes TC de `US-1500` reutilizan la misma carpeta.
