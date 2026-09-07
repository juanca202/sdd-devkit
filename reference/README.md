# `reference/` — recursos compartidos del plugin

Contenido **transversal a varios skills** de SDD Devkit. Vive aquí, y no duplicado en cada
`SKILL.md`, para que exista una sola fuente de verdad por regla.

Los skills y los agentes lo referencian con **dos rutas en cada enlace**: el texto lleva la ruta que el
agente resuelve, y el destino la ruta que navega en GitHub o en un editor:

```markdown
[`${PLUGIN_ROOT}/reference/<archivo>.md`](../../reference/<archivo>.md)   # desde skills/<nombre>/SKILL.md
[`${PLUGIN_ROOT}/reference/<archivo>.md`](../../../reference/<archivo>.md) # desde skills/<nombre>/references/*.md
[`${PLUGIN_ROOT}/reference/<archivo>.md`](../reference/<archivo>.md)      # desde agents/<nombre>.md
```

**`${PLUGIN_ROOT}` es la raíz del plugin instalado** —la carpeta que contiene `skills/`, `agents/` y
`reference/`— y es un **placeholder del catálogo, no una variable de ningún cliente**: el agente lo
sustituye siguiendo la regla que cada `SKILL.md` y cada agente llevan en su sección **Rutas de las
referencias compartidas** (antes de «Resolución de idioma»): en Claude Code, `${PLUGIN_ROOT}` es
`${CLAUDE_PLUGIN_ROOT}` (se comprueba con `echo "$CLAUDE_PLUGIN_ROOT"`); en cualquier otro cliente, o si la
variable viene vacía, la carpeta desde la que se cargó el archivo (dos niveles arriba de
`skills/<nombre>/SKILL.md`, uno arriba de `agents/<nombre>.md`). Por qué un placeholder y no la
variable de Claude a secas: el catálogo se instala también en clientes que no la definen, y un nombre
propio evita que otro cliente lo interprete como suyo.

**El destino relativo del enlace existe solo para navegar el repositorio.** Un skill corre con el
directorio de trabajo en el **proyecto del usuario**; resolver `../../reference/language.md` desde ahí
busca `<proyecto>/reference/language.md` (o sube por encima del proyecto) y no lo encuentra. Es el
error que el placeholder existe para eliminar: un `reference/` que «no existe» en el proyecto no es
un archivo que falte, es una ruta mal resuelta, y la lectura obligatoria sigue siéndolo.
Lo que sí exige el plugin instalado es que la carpeta `reference/` viaje junto a `skills/` y
`agents/`: un skill copiado suelto pierde sus referencias.

## Catálogo

| Archivo | Qué contiene | Skills que lo consumen |
|---------|--------------|------------------------|
| [`language.md`](language.md) | Regla única de resolución del idioma de artefactos y mensajes: lectura obligatoria antes de ejecutar cualquier skill o agente | **Los 16 skills y los 3 agentes** |
| [`planning.md`](planning.md) | Política de definición de casos de prueba resuelta desde `.sdd-devkit/settings.json`: `testCases.mode` decide si se pregunta, se invoca automáticamente o nunca se sugiere `test-define` al cerrar la planificación; `testCases.askDetails`, si `test-define` entrevista o aplica valores por defecto | `work-define`, `work-plan` (`mode`) · `test-define` (`askDetails`) |
| [`implementation.md`](implementation.md) | Política de implementación resuelta desde `.sdd-devkit/settings.json`: ritmo de confirmación por unidad, qué hacer con cambios sin commitear al iniciar, worktrees y su ubicación, concurrencia máxima, handoff de cierre y modo de archivado | `work-implement` · `work-integrate`, `pr-create` (`archiveMode`) |
| [`git.md`](git.md) | Política de commit y push resuelta desde `.sdd-devkit/settings.json`: si se confirma la división en varios commits, si se hace push tras completarlo (no aplica en invocación delegada) y qué ramas son de integración con su `commitPolicy` | `git-commit` · `work-implement`, `work-integrate` (`integrationBranches`) |
| [`verification.md`](verification.md) | Puertas de cierre (`quality-check`, `code-review`, `trace-validate`) resueltas desde `.sdd-devkit/settings.json`: si cada una corre antes del merge (`enabled`, lo resuelve `work-integrate`) y si pide confirmación antes de corregir lo que encuentre (`confirmFix`, lo resuelve cada puerta); omitida ≠ aprobada | `quality-check`, `code-review`, `work-integrate` |
| [`escalation.md`](escalation.md) | Límite de intentos consecutivos sobre un mismo problema que no se resuelve (prueba en rojo, build roto, regla violada) resuelto desde `.sdd-devkit/settings.json`: `maxAttempts` fija el techo por problema y `onLimit` decide si al agotarlo se presenta el parte de bloqueo y se pregunta al usuario (`ask`) o se registra como `BLOCKED` y se continúa (`report`) | `work-implement`, `quality-check`, `code-review`, `trace-validate`, `work-integrate`, `arch-audit` y los 3 agentes |
| [`asking.md`](asking.md) | Mecanismo de preguntas estructuradas, ritmo de las tandas, fallback en prosa y qué hacer si falta una herramienta | `arch-init`, `design-define`, `git-commit`, `quality-check`, `test-define`, `trace-validate`, `work-implement`, `work-integrate`, `work-plan`, `work-research` |
| [`verdicts.md`](verdicts.md) | Vocabulario de veredictos y estados de los informes: valor canónico, símbolo y etiqueta en el idioma resuelto; cómo los lee un consumidor | `quality-check`, `code-review`, `trace-validate`, `arch-audit`, `work-integrate`, `pr-create` |
| [`artifacts.md`](artifacts.md) | Layout del harness (rutas de cada artefacto), **resolución de la raíz de arquitectura** (repo principal vs. submódulo), identificadores y numeración, y el contrato de archivado | Todo el ciclo de trabajo y de arquitectura |
| [`project-management.md`](project-management.md) | Integración con el gestor de proyectos resuelta desde `.sdd-devkit/settings.json`: si está activada, con qué proveedor y con qué datos de conexión (`host`, `workspace`, `project`) | `work-plan`, `test-define`, `work-research` |
| [`project-managers/azure-devops.md`](project-managers/azure-devops.md) | Delta del proveedor Azure DevOps: verificación del MCP, URL del work item, el ID de ADO sobre el secuencial local, límites de formato y contrato de sincronización | `work-plan`, `test-define`, `work-research` |

## Cómo referenciarlo desde un `SKILL.md`

Un puntero, no una copia. La sección **Resolución de idioma** es la **única regla de idioma vigente**
en todo artefacto — `SKILL.md` o agente — y se escribe **literalmente así**, sin variantes. Solo si el
skill o el agente tiene una **excepción explícita**, se añade **dentro de esa misma sección**; no puede
existir ninguna otra regla de idioma en el resto del archivo ni en sus `references/`:

```markdown
## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/reference/language.md`](../../reference/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

**Excepción deliberada:** <solo si existe; describir aquí y en ningún otro lugar>.
```

En un archivo de `agents/`, el destino del enlace es `../reference/language.md` y el texto dice
«este agente» en vez de «este skill».

El texto del enlace lleva siempre `${PLUGIN_ROOT}/reference/<archivo>.md` (lo que el agente resuelve) y el
destino la ruta relativa (lo que navega el lector): las dos nombran el mismo archivo.

## Bloques ` ```! `: ejecutar, no interpretar

`language.md`, `git.md`, `planning.md`, `implementation.md`, `verification.md`, `escalation.md` y `project-management.md` resuelven su política con un bloque marcado ` ```! ` que contiene un script (`node -e` en todos los casos actuales, leyendo `.sdd-devkit/settings.json`). Ese bloque **es el mecanismo de resolución, no una explicación en prosa para razonar a mano**: se ejecuta con Bash —igual que un bloque ` ```bash ` — y lo que imprime por stdout **es** la política ya resuelta, lista para usar tal cual.

Leer el bloque como texto y reconstruir la lógica manualmente (parsear el JSON, inferir la conclusión) reintroduce el margen de error de interpretación que el script existe para eliminar, aunque se llegue al mismo resultado — y es más lento. Cada uno de estos siete archivos trae, justo antes de su bloque, un recordatorio de una línea con esta misma regla; **al añadir un archivo nuevo con este patrón, replicar ese recordatorio** en vez de asumir que se sobreentiende.

El mismo criterio vale para cualquier comando exacto y validado que una referencia entregue para un chequeo determinista (el caso vigente es el `grep` de [`secret-detection.md`](../skills/git-commit/references/secret-detection.md#comando) en `git-commit`): copiarlo literal y ejecutarlo, no reconstruirlo de memoria — ya resolvió los casos borde que una versión improvisada puede pasar por alto.

## Cuándo añadir algo aquí

Cuando una regla aplique a **tres o más skills** y su redacción sea sustancialmente la misma. Si aplica
a uno o dos, vive en el `SKILL.md` o en su `references/`. Al añadir un archivo, registrarlo en la tabla
de arriba y en [`AGENTS.md`](../AGENTS.md).
