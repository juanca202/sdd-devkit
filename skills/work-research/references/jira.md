# Integración con Jira — `work-research`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../references/project-managers/jira.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, clave del issue, construcción de la URL, campo `work_item`, normalización de la
> Descripción y anti-patrones comunes. **Leerla antes que este archivo.**

Este archivo contiene **solo el delta de `work-research`**. Se activa desde «Entrada desde el gestor de
proyectos» en `SKILL.md`.

> **Rol de esta integración: leer y enrutar, nunca escribir.** `work-research`
> **investiga**; no crea ni modifica issues. Esta referencia sirve para (1)
> **obtener** cualquier issue de Jira que el usuario pase por su clave o URL, (2)
> **enrutarlo** al flujo que corresponde a su tipo, y (3) **propagar** su clave
> al skill que sí crea issues (`work-define`, `work-plan`, `test-define`).

> **Degradación sin MCP.** Al no crear artefactos, aquí la falta de MCP no se resuelve con ID secuencial
> local sino pidiendo el contenido al usuario:
> ```
> ⚠️ El repo está vinculado a Jira pero el MCP no está conectado.
> No puedo leer el issue <clave> automáticamente.
> Pégame su contenido, o conecta el MCP de Jira desde el menú de herramientas.
> ```

## Paso 1 — Leer el issue y enrutarlo

Cuando la entrada es un **identificador** (`PAG-4821`, `#4821`, una URL `<host>/browse/…`), obtener el
issue vía MCP y leer `issuetype` (nombre y `hierarchyLevel`) para elegir el flujo:

| Tipo de issue | Artefacto equivalente | Flujo de `work-research` |
|---------------|-----------------------|--------------------------|
| `Story` / `Epic` | `US-XXX` (una épica, además, `RQ-XXX` si está descargada) | **Analizar decisiones pendientes** |
| `Sub-task` / `Task` | `TK-XXX` (si cuelga de una historia) o `WI-XXX` | **Analizar decisiones pendientes** |
| `Bug` | Defecto (incidente `BUG-XXX` si está materializado localmente — buscar `BUG-<n>-*` o `work_item.id: <clave>`) | **Analizar issue**. Si el usuario solo quiere registrarlo sin diagnosticar, `/work-plan sync <clave>` |
| Caso de prueba de la herramienta de pruebas (con Zephyr, una clave `PAG-T123`, que se lee con el MCP de Zephyr y no es un issue) | `TC-XXX` | **Analizar test case** |
| Otros | — | Preguntar al usuario qué espera antes de elegir flujo |

> Los nombres de tipo son configurables: si el tipo devuelto no está en la tabla, **no adivinar** (ver la
> base común).

Si el issue tiene un documento equivalente en el repo (por su `work_item` registrado en el encabezado),
**leer también el documento local**: la especificación es el `.md`; el issue aporta estado, comentarios,
adjuntos y decisiones que no llegaron al documento. Si discrepan, registrarlo como hallazgo.

### Campos comunes a cualquier tipo

| Campo de Jira | Uso |
|---------------|-----|
| `summary` | Título del artefacto |
| `description` | Cuerpo principal; normalizar a markdown (ver la base común) |
| `status` (y su categoría), `resolution`, sprint, `fixVersions`, `components` | Contexto de gestión; registrar, no interpretar |
| `labels` | Señales de módulo, entorno o regresión |
| **Comentarios** | Decisiones ya tomadas, intentos descartados, datos de reproducción — leerlos siempre |
| **Adjuntos** (capturas, logs, HAR) | Evidencia; inspeccionarlos si el MCP permite descargarlos, o pedirlos al usuario |
| `parent`, subtareas y **vínculos** (`blocks`, `relates to`, `duplicates`, `is tested by`) | Artefacto padre, tareas, casos de prueba asociados, duplicados |

### Campos por tipo

**`Story` / `Epic` / `Task`** → flujo *Analizar decisiones pendientes*:

| Campo | Uso |
|-------|-----|
| Campo de criterios del proyecto, o encabezado «Criterios de aceptación» de la descripción | Criterios `AC-XXX`; la vara para contrastar los hallazgos |
| Campo de estimación («Story Points»), `timetracking` | Contexto de dimensionamiento |
| `parent` y subtareas | Épica contenedora y tareas asociadas |

**`Bug`** → flujo *Analizar issue*:

| Campo | Uso en el dossier de bug |
|-------|--------------------------|
| `description` (pasos de reproducción) | Pasos de reproducción y entrada disparadora — Jira no tiene campo dedicado |
| `environment`, `versions` (versión afectada) | Entorno, versión, configuración |
| Campo «Severity» si existe, `priority` | Severidad e impacto |
| `parent` o vínculo a una historia | Historia afectada: sus `AC-XXX` definen el comportamiento esperado |

Si el bug está marcado como **duplicado** (`resolution: Duplicate` o vínculo `duplicates`) o ya
**cerrado**, informarlo y preguntar si continuar antes de invertir la investigación.

**Caso de prueba** → flujo *Analizar test case*. Los campos dependen de la herramienta de pruebas
(`testManagement`): leerlos con el mapeo de lectura de su módulo en
[`test-define/references/jira.md`](../../test-define/references/jira.md), sin crear ni modificar nada.

| Dato | Uso en el análisis |
|------|--------------------|
| Pasos y resultado esperado de cada paso | Pasos de ejecución — nunca reconstruirlos si la herramienta no los devuelve |
| Precondición y datos de prueba | Datos de prueba y variantes |
| Estado y, si la herramienta lo registra, si está automatizado | Un caso sin automatizar es ya un hueco de cobertura |
| Enlace al issue que prueba (trazabilidad o vínculo) | El requerimiento o historia que el TC dice verificar — la traza a auditar |

Notas transversales:

- **Nunca inventar lo que el issue no dice.** Si falta información, preguntarla al usuario.
- Registrar el `work_item` en el encabezado del informe o del dossier, con el formato que define la base
  común (clave completa en `id`).

## Paso 2 — Propagar la clave en el *handoff*

`work-research` no crea issues. Al hacer *handoff*, pasar siempre la clave y la URL del issue leído para
que el skill destino lo enlace o lo reutilice:

| Flujo | Qué propagar |
|-------|--------------|
| **Analizar issue** → `work-plan` | La clave del **`Bug` ya existente** en Jira. Ese `Bug` es el **reporte** (equivale a un incidente `BUG-XXX` local; si existe uno con ese `work_item`, pasar también su ruta para `origin`); el `bug-fix` que planifica `work-plan` es trabajo de corrección y en Jira es siempre una `Task` **vinculada** a ese `Bug` (`relates to`), con `origin` en su frontmatter — nunca un segundo `Bug` para el mismo defecto. Con `implementation.scope: tests` el *handoff* es solo el incidente: `BUG-<n>` reutilizando el `Bug` existente, o creándolo si no existe |
| **Analizar decisiones pendientes** → `work-define` / `work-plan` | La clave del artefacto investigado, para que las actualizaciones caigan sobre ese mismo issue |
| **Historia leída de Jira sin documento local** → `work-define` | Sugerir `/work-define sync <clave>`: es la única vía para que la US se materialice localmente con su número y su `work_item`. |
| **Analizar test case** → `test-define` | La clave del caso de prueba auditado (y su herramienta), para que se corrija o amplíe **ese** caso y no se cree uno nuevo |

El detalle de creación y actualización vive en la referencia de Jira de cada skill destino
(`work-plan/references/jira.md`, `test-define/references/jira.md` y su módulo de herramienta de pruebas).

## Anti-patrones específicos

- Crear o modificar issues desde este skill — `work-research` solo lee.
- Asumir el flujo por el prefijo de la clave o por el nombre del tipo sin leer `issuetype`; o adivinar el
  flujo cuando el tipo no está en la tabla.
- Leer el issue y **no** leer su documento equivalente en el repo cuando existe.
- Investigar un artefacto sin haber leído sus **comentarios** y **adjuntos**.
- Copiar la descripción de Jira (ADF o wiki markup) tal cual al informe sin normalizarla a markdown.
- Completar campos ausentes por inferencia propia en lugar de preguntar.
