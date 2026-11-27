---
name: coverage-verify
description: >-
  Verificar que el código cubre —alcanza— los criterios de aceptación del artefacto implementado: una historia de usuario (US-XXX), una tarea de mantenimiento (WI-XXX), un feature (FT-XXX) o cualquier documento cuyos criterios tengan identificador codificado (AC-001, 1.1, R-3…). La evidencia son las pruebas automatizadas del repositorio, los casos de prueba (TC-XXX), o ambos. Por cada criterio indica qué lo cubre, su estado (`COVERED` / `PARTIAL` / `UNCOVERED`) y el resultado de su ejecución, y genera un reporte (criteria-coverage.md) con veredicto. No corre la suite: delega en quality-check. Activar cuando el usuario pida verificar que el código cumple o cubre los criterios de aceptación, validar cobertura, generar una matriz o reporte de trazabilidad, comprobar si un trabajo o feature está cubierto por pruebas, o mencione "trazabilidad" o "matriz de cobertura". Cubre también trabajo archivado en <archivedPath>/, dejando el reporte junto al artefacto.
license: MIT
---

# Skill: Verificar la cobertura de los criterios de aceptación

Verifica que **cada criterio de aceptación del artefacto tiene una prueba que lo valida**. La evidencia son los **artefactos de prueba automatizada** (unit, integración, e2e) presentes en el repositorio y los **casos de prueba** (`TC-XXX`) cuando existen — basta con una de las dos fuentes, y se cruzan ambas cuando están disponibles. El resultado es un **reporte de cobertura** (`criteria-coverage.md`) que mapea cada criterio a lo que lo cubre y cierra con un **veredicto** sobre si el trabajo queda cubierto.

El trazado primario es para **historias de usuario** (`US-XXX`) con sus **criterios de aceptación**. Sirve igual para cualquier otro artefacto que tenga criterios con **identificador codificado** — el formato es indiferente (`AC-001`, `1.1`, `R-3`…) y se usa **verbatim**, sin normalizar (ver [Tipos de trabajo y criterios](#tipos-de-trabajo-y-criterios)). Es el mismo contrato que produce `test-define`.

> **Tres preguntas, tres puertas.** Aquí «criterio sin cubrir» significa que **ninguna prueba lo valida**. Si el código **no implementa** el criterio, eso lo detecta [`code-review`](../code-review/SKILL.md) (dimensión de intención). Y si la prueba existe pero está **en rojo**, quien bloquea es [`quality-check`](../quality-check/SKILL.md): aquí el resultado se muestra en la matriz, pero no cambia el estado de cobertura del criterio (ver [Estados de cobertura](#estados-de-cobertura) y [Veredicto](#veredicto)).
>
> **Qué hace:** lee, mapea, **obtiene los resultados de pruebas delegando en `quality-check`** y reporta. Es una actividad de **verificación**, no de desarrollo.
>
> **No ejecuta pruebas por sí mismo.** La ejecución de la batería de pruebas se **delega en `quality-check`**: si existe una corrida previa fresca de `quality-check` (sin cambios en el código desde entonces), se **reutilizan** sus resultados; si no, se invoca `quality-check` en modo `tests-only` para producirlos. Ver [Resultados de pruebas: delegación en quality-check](#resultados-de-pruebas-delegación-en-quality-check). **Repositorio solo de pruebas (`implementation.scope: tests`).** Allí `quality-check` **no ejecuta** los specs contra el sistema desplegado (API, E2E, Content, Style) —validan otro sistema, no el repo—, así que `quality-check-run.json` no trae sus resultados y **no se le invoca en `tests-only` para obtenerlos**. La fuente de ejecución es **`test-cases-automation.md`** del artefacto padre, que `work-implement` dejó al cerrar la unidad: cada archivo de `Pruebas` es evidencia; una línea en `Hallazgos` para el `TC-XXX` significa `Resultado = FAIL`; sin hallazgo, `PASS`. En la matriz, `Ejecución = work-implement`. **Ese `FAIL` no descubre el criterio** —como en cualquier repositorio—: existe una prueba fiel al TC, así que el criterio queda `COVERED`, y el fallo se reporta como hallazgo del sistema bajo prueba en «Observaciones y pendientes», con el incidente `BUG-XXX` de seguimiento si lo hay. Detectar ese rojo es el objetivo del repo, no una deuda de cobertura, y no degrada el veredicto. Con `scope: code` o sin la clave, esta nota no aplica.
>
> **Reporte idempotente.** Si no han cambiado ni el código, ni las pruebas, ni los criterios y casos de prueba del artefacto desde la última vez que se generó el `criteria-coverage.md`, **no se genera un documento nuevo**: se devuelven los mismos resultados del reporte existente. Ver [Reutilización del reporte (idempotencia)](#reutilización-del-reporte-idempotencia).
>
> **Qué NO hace:** no escribe ni modifica código de aplicación, no escribe nuevos tests (eso es de `quality-specialist` vía `work-implement`), no edita la especificación de producto (README de la US, `TK-XXX`, `WI-XXX`, `FT-XXX`, `validation.md`, ADRs), **ni corre la suite de pruebas directamente**. Lo único que produce es el **reporte de trazabilidad**. Lo que no se puede determinar de las fuentes va a **Observaciones** o se pregunta al usuario — nunca se inventa cobertura ni resultados.

---

## Alcance del informe

El informe de este skill cubre **un artefacto concreto y sus criterios de aceptación**. La pregunta es «¿cada criterio de *este* trabajo está probado?», así que el universo lo definen los criterios del artefacto, no los archivos que cambiaron ni el repositorio completo.

Consecuencias prácticas:

- **Se validan todos los criterios del artefacto**, aunque en esta rama no se haya tocado el código de alguno de ellos: un criterio cuya prueba nunca se escribió sigue siendo un hueco.
- **No se reportan pruebas ni código ajenos al artefacto.** Tests de otros trabajos, cobertura global o fallos en módulos que no mapean a ningún criterio de este artefacto no entran en la matriz — a lo sumo van a «Observaciones y pendientes».
- **Si la rama abarca varios trabajos**, se valida uno por corrida, con su propio `criteria-coverage.md` junto a su artefacto. Los resultados de pruebas sí son compartidos (vienen de la corrida de `quality-check`), pero el **mapeo** es por artefacto.
- **La clave de frescura tiene una mitad de rama y otra de artefacto.** El `FINGERPRINT` cubre el código y los tests de todo el árbol, así que un cambio en *otro* trabajo de la misma rama invalida también este `criteria-coverage.md`; el `SPEC_FINGERPRINT` cubre solo la carpeta de **este** artefacto. Es conservador a propósito: prefiere revalidar de más antes que devolver un reporte que ya no corresponde.

---

## Subagente

**Si el proyecto define el subagente `quality-specialist`, ejecutar este skill bajo ese subagente** (es el mismo agente que escribe los tests en el cierre de `work-implement`, por lo que es el contexto natural para validarlos). Si no existe en el proyecto, ejecutar el flujo normalmente.

---

## Tipos de trabajo y criterios

El tipo se determina por el identificador que indique el usuario o por la ruta de trabajo. Cada tipo fija de dónde se leen los criterios de aceptación y con qué códigos se traza.

| Tipo | Identificador | Dónde viven los criterios | Códigos a trazar |
|------|---------------|---------------------------|------------------|
| **Historia de usuario** | `US-XXX` | Sección **Criterios de aceptación** del `README.md` de la US (lista plana, habitualmente `AC-XXX`) | El identificador de cada criterio, en el orden en que aparecen |
| **Tarea de mantenimiento** | `WI-XXX` | Sección **## Criterios de aceptación** del `README.md` del WI (`WI-XXX-[kebab]/README.md`) | El identificador de cada criterio, en el orden en que aparecen |
| **Feature (funcionalidad ya implementada)** | `FT-XXX` | Sección **## Criterios de aceptación** del `README.md` del feature (`<currentPath>/FT-XXX-[slug]/README.md`) | El identificador de cada criterio, en el orden en que aparecen |
| **Cualquier otro artefacto de especificación** | Ruta o nombre que indique el usuario | La sección de criterios del documento (puede llamarse «Criterios de aceptación», «Requerimientos», «Acceptance Criteria»…) | El identificador de cada criterio, tal como aparece |

> **El requerimiento no es el formato, es que exista identificador.** En todo el flujo, «criterio» se refiere al identificador **tal como está escrito en el artefacto** — `AC-012`, `1.3`, `R-3`, `CA-07` son todos válidos. **Nunca normalizar ni renombrar**: el vínculo de trazabilidad debe ser buscable literalmente tanto en el artefacto como en los TCs que produjo `test-define`. Si el trabajo **no tiene criterios**, o los tiene sin identificador, no hay nada que trazar → **bloquear** (ver «Cuándo bloquear»).

> **FT — validar cobertura de funcionalidad ya implementada.** Un `FT-XXX` es el
> registro de una funcionalidad **ya implementada** (inferida de código legacy por el
> análisis de `work-research`, o simplemente el registro de funcionalidad existente),
> no trabajo por construir. Validarlo responde: *¿esa funcionalidad ya existente está
> cubierta por pruebas?* Un criterio `UNCOVERED` significa que ese comportamiento
> **carece de pruebas** (un hueco a cerrar escribiendo tests), **no** que falte código
> funcional. Sus casos de prueba documentados viven en
> `<currentPath>/FT-XXX-[slug]/test-cases/`, igual que en una US o un WI.

---

## Modificadores de invocación

Las **claves** son en inglés (estándar); el usuario puede nombrarlas en español y se mapean. Sin modificador, se asume el comportamiento por defecto.

| Modifier | Efecto exacto |
|----------|----------------|
| `revalidate` | **Forzar la regeneración** del `criteria-coverage.md` aunque el existente esté fresco: ignorar la comprobación del Paso 0 y ejecutar el flujo completo. Sinónimos aceptados: «revalidar», «forzar», «vuelve a validar». Necesario cuando los criterios viven **fuera del repo** (un ticket, un documento externo) y han cambiado allí — eso el `SPEC_FINGERPRINT` no puede verlo. Mismo modificador y mismo significado que en [`code-review`](../code-review/SKILL.md). |

---

## Cómo preguntar al usuario

Mecanismo, ritmo y fallback compartidos: [`${PLUGIN_ROOT}/references/asking.md`](../../references/asking.md).

Cada vez que este skill o sus referencias digan *preguntar*, *pedir*, *confirmar*, *validar* o *sugerir* algo al usuario, asume ese mecanismo; no se repite allí.

---

## Rutas de las referencias compartidas

`${PLUGIN_ROOT}` es la **raíz del plugin instalado** (la carpeta que contiene `skills/`, `agents/` y `references/`), y toda referencia compartida de este skill se escribe como `${PLUGIN_ROOT}/references/<archivo>.md`. Para resolverla: la raíz es la **carpeta desde la que se cargó este archivo**, dos niveles arriba (`<raíz>/skills/<nombre>/SKILL.md`) — el cliente anuncia esa ubicación al invocar el skill (p. ej. «Base directory for this skill: …»). Si esa ubicación no está disponible, localizar la instalación buscando el manifiesto del plugin: `PLUGIN_ROOT="$(dirname "$(grep -rl '\"name\": *\"sdd-devkit\"' "$HOME/.claude/plugins" --include=plugin.json 2>/dev/null | head -1)")"`. En ambos casos, **verificar antes de usarla** que `$PLUGIN_ROOT/references/language.md` existe. El destino de cada enlace markdown (`../../references/…`) existe solo para navegar el repositorio en GitHub o en un editor: **no** resolverlo desde el directorio de trabajo. **Nunca buscar `references/` en el proyecto**: un `<proyecto>/references/language.md` que no existe no es un archivo que falte, es una ruta mal resuelta — corregir la raíz y volver a leer, sin preguntar al usuario ni saltarse la lectura.

## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos, documentos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

**Excepción deliberada:** la salida y los mensajes de error de las herramientas de prueba no se traducen; se citan literales.

**Enlaces a archivos del proyecto:** DEBES leer y aplicar [`${PLUGIN_ROOT}/references/linking.md`](../../references/linking.md) — todo archivo o carpeta existente del proyecto que este skill mencione en un artefacto, documento o mensaje (identificadores como `US-XXX` o `WF-XXX`, rutas, índices) se escribe como enlace Markdown que lo abre.

## Límite de intentos y escalamiento

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/escalation.md`](../../references/escalation.md).

Las reglas de `escalation.md` son obligatorias y determinan, vía `escalation.maxAttempts` y `escalation.onLimit`, cuántos intentos consecutivos se hacen sobre **el mismo** problema que no se resuelve —una corrida de pruebas que no se logra completar o un criterio que no se logra evidenciar— y qué se hace al agotarlos: detener el trabajo sobre ese problema, presentar el **parte de bloqueo** y preguntar al usuario cómo seguir (`ask`), o marcarlo como `BLOCKED` en el informe y continuar con el alcance que no dependa de él (`report`).

El contador es **por problema**, no global, y **el límite es un techo, no una cuota**: si no hay una hipótesis nueva que justifique el siguiente intento, se escala ya. Nunca se «resuelve» un bloqueo desactivando o saltando una prueba, relajando una aserción ni bajando un umbral.

No continúes hasta haber leído y aplicado `escalation.md`.

---

## Información requerida antes de generar el reporte

No inventar nada. Si un dato no es explícito, obtenerlo del repo o preguntar al usuario.

| Dato | Cómo obtenerlo | Si no está disponible |
|------|----------------|-----------------------|
| **Trabajo a validar** | Indicado por el usuario o inferido de la ruta de trabajo; determinar el tipo (`US-XXX` / `WI-XXX` / `FT-XXX` / otro artefacto) | Preguntar qué trabajo validar; sin él no se puede generar el reporte |
| **Criterios de aceptación** | Según el tipo (ver [Tipos de trabajo y criterios](#tipos-de-trabajo-y-criterios)) | Si el trabajo no tiene criterios de aceptación: **bloquear** y reportar — sin criterios no hay nada que trazar |
| **Casos de prueba** | **Fuente primaria:** la carpeta `test-cases/` **junto al artefacto** y su índice `test-cases/README.md`, más la línea `Casos de prueba:` que `test-define` deja bajo cada criterio. **Fallback:** inferir desde los tests del repo | Si no hay casos documentados, derivar la cobertura desde los artefactos de prueba del repo |
| **Artefactos de prueba** | Buscar en el repo archivos de test unit / integración / e2e relacionados con el trabajo (ver el Paso 2 en `references/flow.md`) | Si no se encuentran, marcar criterios sin artefacto como `UNCOVERED` y dejar Observación |
| **Resultados de pruebas** | **Delegados en `quality-check`**: caché fresca `quality-check-run.json` o invocación `tests-only` (ver [Resultados de pruebas: delegación en quality-check](#resultados-de-pruebas-delegación-en-quality-check)) | Si `quality-check` no puede ejecutarlas (sin stack, entorno sin correr, no disponible en la sesión) o el usuario declina la delegación: las filas **con artefacto** van con `Ejecución = —` y `Resultado = `NOT_RUN`, y el motivo a «Observaciones y pendientes» |
| **Alcance** | Todo el trabajo por defecto; el usuario puede acotar a ciertos criterios | Si es ambiguo, preguntar |

> Leer **siempre** el documento de criterios completo (el `README.md` del trabajo, o el archivo del artefacto externo) antes de generar el reporte. No asumir criterios que no estén escritos.

---

## Flujo

Resumen de los pasos. El detalle íntegro de cada paso está en **`references/flow.md`** (leerlo antes de ejecutar el flujo).

0. **Comprobar frescura del reporte** — si ya existe `criteria-coverage.md` con un fingerprint guardado y no hubo cambios en los archivos desde entonces, **devolver el reporte existente sin regenerarlo** (ver [Reutilización del reporte (idempotencia)](#reutilización-del-reporte-idempotencia)). Solo si hay cambios (o el usuario pide revalidar) continuar con los pasos siguientes.
1. **Localizar y leer el trabajo** — resolver tipo y ubicación; extraer todos los criterios con su identificador **verbatim**. Sin criterios (o sin identificador) → bloquear (ver «Cuándo bloquear»).
2. **Inventariar casos y artefactos** — leer la carpeta `test-cases/` del artefacto y su índice como fuente primaria, y clasificar los tests del repo por tipo, con ruta y criterio.
3. **Mapear cobertura fila a fila** — expandir cada criterio en sus filas (criterio × TC × tipo declarado), rellenar `Evidencia` y derivar el estado del criterio (ver «Estados de cobertura») con sus observaciones. No forzar mapeos inciertos.
4. **Obtener resultados de pruebas (delegando en `quality-check`)** — reutilizar la caché `quality-check-run.json` si está fresca, o invocar `quality-check` en modo `tests-only`; mapear por suite a las filas y rellenar `Ejecución` (`quality-check` / `Manual` / `—`) y `Resultado` (`PASS` / `FAIL` / `NOT_RUN` / `UNCOVERED` / `N/A`). **No** correr pruebas directamente. Nunca fabricar resultados (ver [Resultados de pruebas: delegación en quality-check](#resultados-de-pruebas-delegación-en-quality-check) y `references/flow.md`).
5. **Redactar el reporte** desde `assets/criteria-coverage-template.md` (leerla antes de redactar): cabecera, Resumen (prosa con la procedencia + tabla de indicadores), **cobertura por criterio** (una fila por criterio, con su Estado), **matriz de trazabilidad** (una fila por criterio × TC × tipo declarado, con Evidencia, Ejecución y Resultado) y, si los hay, los caveats globales en «Observaciones y pendientes». Ver [Vistas del reporte](#vistas-del-reporte-cobertura-por-criterio-y-matriz).
6. **Emitir el veredicto** (ver «Veredicto») respondiendo si todos los criterios quedan cubiertos.
7. **Entregar y guardar** el reporte en la ubicación del tipo (ver «Ubicación de archivos»), **grabando el fingerprint** del estado actual para la próxima comprobación de frescura; no modificar otros artefactos.

---

## Vocabulario de veredictos y estados

Antes de redactar cualquier informe, DEBES leer [`${PLUGIN_ROOT}/references/verdicts.md`](../../references/verdicts.md).

Las reglas de `verdicts.md` son obligatorias: el valor canónico y el símbolo son estables, y la **etiqueta que lee la persona se redacta siempre en el idioma resuelto** por `language.md`. Ninguna etiqueta de este skill se fija en un idioma concreto.

No continúes hasta haber leído y aplicado `verdicts.md`.

---

## Estados de cobertura

Los valores de la columna `status` son **canónicos**: en el reporte se escribe su símbolo seguido de la etiqueta en el idioma resuelto.

| Estado (canónico) | Símbolo | Cuándo aplicarlo |
|-------------------|---------|------------------|
| `COVERED` | `✅` | El criterio tiene al menos un caso de prueba **y** el artefacto que le corresponde, y lo valida de forma completa. **El resultado de la ejecución no cambia este estado:** si la prueba existe y está en `FAIL`, el criterio sigue `COVERED`, con el `FAIL` en la matriz y la Observación «prueba en rojo» (ver la nota de abajo). **Un criterio cuyos TCs son `Manual` por diseño también es `COVERED`** si esos TCs lo validan por entero. |
| `PARTIAL` | `⚠️` | El criterio está cubierto solo en parte: hay prueba pero no abarca todo el criterio, el artefacto existe pero no se pudo ejecutar, o existe solo validación manual **no declarada como tal** (TC automatizable aún sin automatizar). Detallar el límite en Observaciones. |
| `UNCOVERED` | `❌` | No existe caso de prueba ni artefacto que valide el criterio. |

> **Cobertura ≠ ejecución.** Que exista prueba que valida el criterio es una cosa; que haya corrido y con qué resultado, otra, y este skill solo juzga la primera. Una prueba en `FAIL` **no descubre el criterio**: el criterio queda `COVERED` (o `PARTIAL`, si lo era por otro motivo), la fila lleva `Resultado = FAIL` y la columna Observaciones dice «prueba en rojo — la bloquea `quality-check`», indicando si el fallo pudo **aislarse** a su test o solo se sabe que falló la suite. El dueño de ese rojo es `quality-check`, que da `REJECTED` por él; duplicar aquí el bloqueo no aporta señal. Es la misma regla en cualquier repositorio, incluido uno solo de pruebas (`implementation.scope: tests`). Su efecto en el veredicto está en [Veredicto](#veredicto).
>
> **El `status` del TC filtra la cobertura.** La fuente primaria es la **columna `status` del índice** `test-cases/README.md`; si el índice no la trae, abrir el `TC-XXX-*.md` y leer la clave `status` de su frontmatter. Los **valores** (`Draft`/`Ready`/`Obsolete`) son canónicos y no se traducen. Un TC **`Obsolete`** no cuenta como cobertura (dejar Observación); uno **`Draft`** cuenta como cobertura `PARTIAL` (aún no está listo para respaldar el criterio); solo los **`Ready`** cuentan como cobertura plena. Si el TC no trae el campo, tratarlo como `Ready`. Esto es distinto del `status` del **artefacto**, que este skill no exige (ver «Cuándo bloquear»).
>
> **Manual por diseño vs. pendiente de automatizar.** `test-define` distingue los dos casos en el campo **Tipo de prueba** del TC: `Manual` significa *no se automatiza por decisión de diseño*; cualquier otro valor (`Unit`, `Integration`, `API Test`, `Content Test`, `Style Test`, `E2E`) significa *debería existir artefacto automatizado*. Respetar esa declaración: un criterio con TCs `Manual` que lo cubren por completo es `COVERED` (sus filas van con `Ejecución = Manual` y `Resultado = N/A`), no una deuda; un criterio con TCs automatizables **sin** artefacto es `PARTIAL` o `UNCOVERED`. No penalizar una decisión de diseño ni disimular una automatización pendiente.
>
> **Un TC con varios tipos declarados se cubre por tipo.** Si un TC declara `Unit, E2E` y solo existe el test unitario, el criterio **no** es `COVERED`: la fila `E2E` de la matriz queda en `UNCOVERED` y el criterio baja a `PARTIAL`, con el tipo faltante nombrado en Observaciones. La matriz muestra esa asimetría fila a fila (ver [Vistas del reporte](#vistas-del-reporte-cobertura-por-criterio-y-matriz)).

---

## Vistas del reporte: cobertura por criterio y matriz

El reporte tiene **dos tablas complementarias**, no una. Separarlas evita el problema de meter en una sola fila
información de granularidades distintas (un criterio puede tener varios TCs, y un TC varios tipos de prueba).

El **Resumen** las precede con una tabla de indicadores de **cuatro columnas y una sola fila de cifras**
—criterios de aceptación, cubiertos, parciales, no cubiertos— cuyos tres últimos valores deben sumar el total. No lleva indicadores de
pruebas (fallidas, no ejecutadas): esa granularidad ya está en la matriz y mezclar los dos ejes confunde.
La **procedencia** de los resultados y el `result` **por suite** van en la línea «Pruebas» del Resumen;
`quality-check-run.json` no trae un agregado global, así que no se inventa uno.

**1. Cobertura por criterio** — la vista de veredicto. Una fila por criterio:

| Criterio | Descripción | Estado | Observaciones |
|----------|-------------|--------|---------------|
| AC-2.1 | El usuario recibe confirmación por correo | `PARTIAL` | E2E declarado en TC-001 sin automatizar |
| AC-2.2 | La plantilla del correo respeta la identidad visual | `COVERED` | Validación manual por diseño (TC-004) |

**2. Matriz de trazabilidad** — la vista auditable. **Una fila por cada combinación criterio × TC × tipo de
prueba declarado**: si un TC declara `Unit, E2E`, produce dos filas.

| Criterio | TC | Tipo | Evidencia | Ejecución | Resultado |
|----------|-----|------|-----------|-----------|-----------|
| AC-2.1 | TC-001 | Unit | `tests/unit/notify.test.ts` | quality-check | Paso |
| AC-2.1 | TC-001 | E2E | — | — | `UNCOVERED` |
| AC-2.2 | TC-004 | Manual | `test-cases/TC-004-revision-visual.md` | Manual | N/A |

Semántica de las columnas:

| Columna | Qué contiene | Valores |
|---------|--------------|---------|
| **Criterio** | Identificador **verbatim** del artefacto, repetido en cada fila suya | `AC-012`, `1.3`, `R-3`… |
| **TC** | Caso de prueba que produjo `test-define` | `TC-XXX` · `—` si el criterio no tiene TC documentado (fila **derivada** de un test hallado, o hueco total) |
| **Tipo** | El `Tipo de prueba` **declarado en el TC**; en filas derivadas, el tipo del artefacto hallado | `Manual` · `Unit` · `Integration` · `API Test` · `Content Test` · `Style Test` · `E2E` · `—` (sin TC y sin artefacto) |
| **Evidencia** | La prueba concreta que respalda la fila | Ruta del artefacto automatizado · ruta del TC para filas `Manual` · `—` si esa intención no está materializada |
| **Ejecución** | **Quién** produjo el resultado | `quality-check` · `work-implement` (solo en `scope: tests`: resultado leído de `test-cases-automation.md`) · `Manual` · `—` (no se ejecutó) |
| **Resultado** | Qué dio esa prueba. Valores **canónicos**; en el reporte va la etiqueta en el idioma resuelto | `PASS` · `FAIL` · `NOT_RUN` (hay artefacto, no corrió) · `UNCOVERED` (no hay evidencia para ese tipo) · `N/A` (manual por diseño) |

> **Por qué se eliminó la columna `Automática`.** Un `Sí` no decía nada útil: no revelaba qué tipo de prueba
> respaldaba el criterio, dónde vivía, ni quién produjo el resultado. `Tipo` + `Evidencia` + `Ejecución` dan
> esa información sin ambigüedad, y la granularidad por tipo hace **visible el hueco** (la fila `E2E` sin
> evidencia) en lugar de esconderlo tras un `Sí` que solo hablaba del test unitario.

> **`Evidencia = —` implica `Ejecución = —` y `Resultado = `UNCOVERED`.** No hay excepción: si no hay
> artefacto, no hubo ejecución ni puede haber resultado. Al revés no: puede haber evidencia con
> `Ejecución = —` y `Resultado = `NOT_RUN` (el artefacto existe pero `quality-check` no pudo correrlo;
> la razón va a «Observaciones y pendientes»).

> **Criterio sin TC documentado pero con test hallado.** Si el mapeo se infirió desde el repo (fallback del
> Paso 2), la fila se escribe igual con `TC = —` y el **tipo del artefacto hallado**, y se anota en
> Observaciones que el mapeo es inferido, no declarado. Solo el criterio **sin TC y sin artefacto** produce
> la fila vacía `— | — | — | — | `UNCOVERED`.

**Derivación del `status` del criterio** a partir de sus filas. Evaluar **en orden** y detenerse en la primera que aplique:

| # | Filas del criterio | Estado |
|---|--------------------|--------|
| 1 | **Ninguna** fila aporta cobertura — todas en `UNCOVERED`, o el criterio no tiene TC ni artefacto, o sus únicos TCs son `Obsolete` | `UNCOVERED` |
| 2 | **Alguna** fila en `UNCOVERED`/`NOT_RUN`, o algún TC en `Draft` u `Obsolete` conviviendo con cobertura válida | `PARTIAL` |
| 3 | **Todas** con `Resultado` ∈ {`PASS`, `FAIL`, `N/A`} y todos los TCs en `Ready` (o sin campo `status`) — una fila en `FAIL` no rebaja el estado: lleva su Observación «prueba en rojo» | `COVERED` |

> **Dos destinos de observación, no intercambiables.** La prueba para elegir: *¿se puede atribuir a un
> criterio concreto?* Si sí, va en la **columna `Observaciones`** de la tabla 1; si no, en la **sección
> «Observaciones y pendientes»**. La matriz no lleva columna de observaciones.
>
> | Destino | Qué recibe |
> |---------|------------|
> | **Columna `Observaciones`** (tabla 1) | Tipo declarado sin automatizar · TC en `Draft`/`Obsolete` · **prueba en rojo** (`FAIL`, aislado a su test o solo a nivel de suite) · suite efectiva distinta del tipo declarado · mapeo inferido en vez de declarado · **cobertura apoyada en TCs `Manual`** (aunque sea por diseño: es el caveat que justifica el `APPROVED_WITH_NOTES`) · límite de la cobertura |
> | **Sección «Observaciones y pendientes»** | Suite `coverage` en `FAIL` · `workingTreeClean: false` (árbol sucio) · clases de prueba ausentes en el repo · ejecución no delegable y su motivo · tests que no se pudieron vincular con certeza a ningún criterio · tests o fallos ajenos al artefacto |
>
> La sección global **se omite entera** si no hay ninguno. Cuando el skill diga «dejar Observación» sin más,
> aplicar esta prueba.

> **La derivación no es cerrada sobre la matriz: un dato vive fuera de ella.** El `status` del TC
> (`Draft`/`Obsolete`/`Ready`, que viene del propio TC) se anota siempre en la columna **Observaciones de
> la tabla 1** — sin esa anotación, dos criterios con filas idénticas quedarían con estados distintos sin
> explicación. Si un `FAIL` pudo **aislarse** al test del criterio no cambia el estado, pero sí se anota
> («prueba en rojo, aislada a su test» / «suite `X` en `FAIL`, no se pudo aislar el test»): es lo que usa
> la regla de [Veredicto](#veredicto) cuando `quality-check` está desactivada.
>
> **TCs `Obsolete`.** Sus filas se conservan en la matriz por trazabilidad con su valor real, pero **no
> cuentan como cobertura** al derivar el estado: si son los únicos TCs del criterio, este cae en la fila 1
> aunque sus filas digan `PASS`; si conviven con TCs `Ready` que sí lo cubren, el criterio es como máximo
> `PARTIAL` (fila 2). En ambos casos, Observación explicando que el TC está obsoleto.

---

## Reutilización del reporte (idempotencia)

Mismo principio de caché que `quality-check` y [`code-review`](../code-review/SKILL.md#reutilización-del-informe-idempotencia)
—las **tres** puertas del cierre lo aplican, cada una sobre su propio artefacto—: **si no hubo cambios en los
archivos desde la última generación, no se produce un reporte nuevo** — se devuelven los mismos resultados del
`criteria-coverage.md` existente. Esto evita rehacer el mapeo y volver a delegar la ejecución de pruebas cuando nada
cambió.

La frescura se decide con **dos claves**: `FINGERPRINT` (el código y los tests; el canónico de la tubería) y
`SPEC_FINGERPRINT` (los criterios y los `TC-XXX` del artefacto, excluyendo el propio `criteria-coverage.md`).
En el **Paso 0** se calculan ambas —siempre, haya reporte previo o no— y el reporte existente se devuelve sin
regenerar **solo si** coinciden las dos con las de su marca de pie, no registra una ejecución fallida
(`NOT_RUN` por entorno) y el usuario no pasó `revalidate`; en cualquier otro caso se ejecuta el flujo completo
y se regraban al guardar (Paso 7).

**Antes de ejecutar el Paso 0, DEBES leer [`references/report-reuse.md`](references/report-reuse.md)**: la
receta exacta de `SPEC_FINGERPRINT`, por qué son dos claves, el formato de la marca de pie, qué hacer si está
ilegible y qué cambios no cuentan.

---

## Resultados de pruebas: delegación en quality-check

`coverage-verify` **no ejecuta la suite de pruebas**. La ejecución es responsabilidad de `quality-check`,
que la persiste en un artefacto reutilizable `quality-check-run.json` (esquema `quality-check-run/v1`). Como el review es
una **corrida completa** de la rama, este artefacto vive en una **ubicación fija**, no por unidad:
**`.sdd-devkit/quality-check-run.json`**, en la raíz del repositorio.

**Cómo obtener los resultados (Paso 4 del flujo):**

1. **Reusar el fingerprint canónico** ya calculado en el Paso 0 (mismo valor; no recalcular).
2. **Si existe `quality-check-run.json`, su `schema` es `quality-check-run/v1`, su `generatedBy` es `"quality-check"`, su `git.fingerprint` coincide y su
   `suites[]` cubre el conjunto vigente** (las dos fijas, más e2e si el repo la ejecuta, las que
   declare el estándar de testing y la entrada `architecture` si el repo tiene runner de arquitectura) → caché **fresca**: no hubo cambios desde la corrida de `quality-check`. **Reutilizar**
   los resultados por suite sin ejecutar nada. Si `generatedBy` trae cualquier otro valor,
   **descartar la caché** y delegar: `quality-check` es el único productor autorizado. **Si el estándar de
   testing cambió** desde la corrida (suites de más o de menos), la caché es obsoleta **aunque el fingerprint
   coincida** —el estándar vive en `docs/`, excluido del fingerprint—: delegar. Anotar la procedencia en la línea «Pruebas» del **Resumen**: «resultados tomados de
   la corrida de `quality-check` del {{commit/fecha}}».
3. **Si no existe o el fingerprint difiere** (hubo cambios, o nunca corrió) → **delegar en `quality-check`
   en modo `tests-only`**, que ejecuta solo los checks de pruebas, escribe `quality-check-run.json` y devuelve los
   resultados. Luego consumir esa caché ya fresca.
4. **Si `quality-check` no puede ejecutarlas** (stack no detectable, entorno sin poder correr, dependencias
   ausentes, o el usuario declina la delegación) → las filas con artefacto van con `Ejecución = —` y
   `Resultado = `NOT_RUN`, con la razón en «Observaciones y pendientes», y se entrega igualmente la matriz con los
   artefactos hallados. **Nunca fabricar resultados.**

**Mapeo a la matriz.** Cada entrada `suites[]` de `quality-check-run.json` trae `type` y `result`
(`PASS`/`FAIL`/`SKIPPED`/`N/A`). Las **dos fijas** —`unit`, `coverage`— vienen siempre; `e2e` solo si el repo la ejecuta, y el resto son
**suites configuradas** en el estándar de testing del repo, cuyo `type` es el `ID` del requerimiento que las
declara (p. ej. `integration-testing`, `contract-testing`) y que traen su referencia global en `standard`
(p. ej. `testing/integration-testing`). **Pueden no existir**: si el estándar no declara integración, no hay
entrada para ella —y **no** hay que buscar una clave fija llamada `integration`—, así que una fila de tipo
`Integration` se resuelve contra la suite donde el repo la tenga (típicamente `unit`) o queda
`NOT_RUN`. **No inferir una suite ausente ni inventar su resultado.** La suite **`coverage` no se mapea a ningún
criterio**: es cobertura de líneas/ramas, una métrica del repo que juzga `quality-check`, no cobertura
funcional; si viene en `FAIL`, mencionarlo en «Observaciones y pendientes» y nada más. **La entrada
`architecture` tampoco se mapea**: es la corrida del runner de validaciones de arquitectura del repo,
cacheada en el mismo archivo para `arch-audit`. **No es una clase de prueba**, no cubre ningún criterio de
aceptación y **no se lista en la matriz**; si viene en `FAIL`, como mucho una línea en «Observaciones y
pendientes». Su presencia o ausencia **nunca** degrada una fila a `NOT_RUN`. Mapeo al reporte: `PASS`→`PASS`,
`FAIL`→`FAIL`, `SKIPPED`→`NOT_RUN`, `N/A` (el repo no tiene esa suite)→`NOT_RUN`, dejando en
«Observaciones y pendientes» que esa clase de prueba no existe en el repo. Un `FAIL` **no cambia el estado
de cobertura** del criterio: se escribe en la fila y se anota en Observaciones como «prueba en rojo»,
indicando si se pudo aislar a su test (ver «Estados de cobertura» y la nota de granularidad más abajo).

**El mapeo es por fila, no por criterio.** Cada fila de la matriz (criterio × TC × tipo) se resuelve así:

| Situación de la fila | Evidencia | Ejecución | Resultado |
|----------------------|-----------|-----------|-----------|
| Tipo declarado sin artefacto en el repo | `—` | `—` | `UNCOVERED` |
| Artefacto hallado y la suite que lo corre dio `PASS` | ruta | `quality-check` | `PASS` |
| Artefacto hallado y su test dio `FAIL` (aislable) | ruta | `quality-check` | `FAIL` |
| Artefacto hallado, suite en `FAIL` **sin** poder aislar el test | ruta | `quality-check` | `FAIL` (+ Observación «suite en rojo, test no aislable») |
| Artefacto hallado, suite `SKIPPED` / ausente / no ejecutable | ruta | `—` | `NOT_RUN` |
| TC `Manual` por diseño | ruta del TC | `Manual` | `N/A` |

`Ejecución` dice **quién** produjo el resultado, no de qué clase es la prueba: eso ya lo dice la columna
`Tipo` y la ruta de `Evidencia`. La **suite efectiva** que corrió el test (dónde vive realmente en el repo)
solo se menciona cuando **no** coincide con el tipo declarado —un `API Test` que corre en `unit`, por
ejemplo—, y va en Observaciones, no en la matriz.

> **Granularidad suite vs. criterio:** `result` es por **suite completa**, no por test individual. Si
> varios criterios mapean a tests dentro de la misma suite y esa suite da `FAIL`, no propagar el `FAIL` a todos ellos sin más: si el `summary` u otro detalle de `quality-check` permite aislar qué test
> falló, escribir `FAIL` solo en las filas de ese criterio (el resto, `PASS`); si no hay forma de aislarlo,
> escribir `FAIL` en las filas afectadas con la Observación «suite en rojo, test no aislable». En ningún
> caso cambia el estado de cobertura del criterio. Detalle completo en
> `references/flow.md` (Paso 4).

> Si el proyecto no usa `quality-check` (no está disponible en la sesión), degradar con elegancia: reportar
> las filas **con artefacto** en `Ejecución = —` / `Resultado = `NOT_RUN` («ejecución delegada no disponible») —las que no tienen artefacto siguen en `UNCOVERED`— y entregar la cobertura estática. No
> reintroducir un runner propio en `coverage-verify`.

---

## Cuándo bloquear

Parar y reportar (sin generar reporte parcial) cuando:

- El trabajo no existe o no se encuentra su documento de criterios.
- No hay sección de criterios de aceptación, está vacía, o los criterios **no tienen identificador codificado** (el formato es indiferente; lo que no puede faltar es el identificador): no hay nada que trazar de forma trazable; sugerir alinear el trabajo con su skill de definición/planificación antes de validar (para un `FT-XXX`, completar su especificación con el flujo «Analizar legado» de `work-research`).

> **No bloquear** por que el artefacto no siga las convenciones del plugin: identificadores fuera del formato `AC-XXX`, ubicación fuera de `docs/specs/` o ausencia de campo `status` **no** son motivos de bloqueo.

`
WARNING No es posible generar el reporte de trazabilidad:
- <razón concreta>
- <acción sugerida: p. ej. definir los criterios de aceptación del trabajo antes de validar>
`

---

## Ubicación de archivos

Layout completo del harness, identificadores y contrato de archivado: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md).

Lo propio de este skill:

| Rol | Ruta |
|-----|------|
| Artefacto a trazar (entrada) | La carpeta de la `US-XXX` / `WI-XXX` / `FT-XXX`; para cualquier otro artefacto, la ruta que indique el usuario |
| Casos de prueba documentados (entrada, los produce `test-define`) | `test-cases/` **dentro de la carpeta del artefacto**, con su índice `test-cases/README.md` |
| Caché de corrida de pruebas (entrada, la produce `quality-check`) | `.sdd-devkit/quality-check-run.json` (ubicación fija, no por unidad) |
| Reporte de trazabilidad (**salida**) | `criteria-coverage.md` **dentro de la carpeta del artefacto, allí donde se haya resuelto** — activa o bajo `<archivedPath>/`; para otro artefacto, junto a él (confirmar la ruta con el usuario antes de escribir) |

> **Un `US`/`WI` archivado se traza igual.** Todo se resuelve relativo a la carpeta encontrada: los criterios, el `test-cases/`, la clave `SPEC_FINGERPRINT` y el `criteria-coverage.md` de salida. `coverage-verify` es el **único** skill que escribe dentro de un artefacto archivado, y solo su propio informe: es un derivado del artefacto, no trabajo nuevo, y revalidar un trabajo ya integrado tiene que seguir siendo posible.

---

## Mensaje al usuario

Solo el veredicto, el resumen de cobertura y lo que el usuario debe saber o decidir (criterios `UNCOVERED`/`PARTIAL`, pruebas que fallaron, si no se pudo ejecutar y por qué). No narrar el trabajo en curso («leí el README», «creé el archivo») ni el razonamiento interno. Listar pendientes en viñetas agrupadas por criterio.

---

## Veredicto

| Veredicto (canónico) | Símbolo | Cuándo aplicarlo |
|----------------------|---------|------------------|
| `APPROVED` | `✅` | **Todos** los criterios del trabajo en estado `COVERED` y, si se ejecutaron pruebas automáticas, **todas pasaron**. |
| `APPROVED_WITH_NOTES` | `⚠️` | **Ningún** criterio en `UNCOVERED`, pero hay caveats que el usuario debe conocer: algún criterio en `PARTIAL`, cobertura apoyada en TCs `Manual` (aunque sea por diseño), pruebas que **no se pudieron ejecutar** y por tanto no confirman nada, o **alguna prueba en rojo** (`FAIL`) con la puerta `quality-check` activa, que es quien la bloquea. Enumerar cada caveat. |
| `REJECTED` | `❌` | Al menos un criterio en `UNCOVERED`. **O** una prueba asociada en `FAIL` **aislado a su test** cuando la puerta `quality-check` está **desactivada** (`verification.qualityCheck.enabled: false`): ahí nadie más bloquearía ese rojo. Listar los criterios sin cubrir (y, en ese caso, los fallidos). |

Precedencia: `REJECTED` > `APPROVED_WITH_NOTES` > `APPROVED`. Es decir, `APPROVED` exige **cero caveats**: si hay alguno (criterio `PARTIAL`, cobertura apoyada en TCs `Manual`, pruebas no ejecutadas, prueba en rojo), el veredicto es `APPROVED_WITH_NOTES` (`⚠️`), no `APPROVED` (`✅`).

> **Una prueba en rojo es de `quality-check`.** Este skill no duplica ese bloqueo: con `quality-check` activa, un `FAIL` es un caveat (`APPROVED_WITH_NOTES`) cuya Observación remite a esa puerta, que ya da `REJECTED` por él. Si la puerta está activa o no se resuelve con el bloque de [`${PLUGIN_ROOT}/references/verification.md`](../../references/verification.md) (`qualityCheck.enabled`; sin `settings.json`, activa por defecto) — ejecutarlo, no razonarlo a mano. Solo con `quality-check` desactivada el `FAIL` aislado bloquea aquí, para que desactivar una puerta no deje una prueba fallida sin dueño. En `implementation.scope: tests` no aplica esa excepción: el rojo es un hallazgo del sistema bajo prueba (nota del encabezado).

> **En el cierre, este `⚠️` no bloquea** (a diferencia del `INCOMPLETE` de `quality-check` y `code-review`, que sí): `work-integrate` y `pr-create` continúan mostrando las observaciones al usuario. Por eso cada caveat debe quedar enumerado y ser legible por sí solo — es lo único que el usuario verá antes de integrar.

> **Repositorio solo de pruebas (`implementation.scope: tests`): este skill NO es puerta de cierre y el cierre NO lo invoca.** Aquí la cobertura que se trazaría es la de los `AC-XXX` del **sistema bajo prueba** (otro repositorio) contra los `TC-XXX` de este, con la ejecución leída de `test-cases-automation.md`. Ese veredicto habla de la aplicación probada, no de la calidad de este repositorio, así que `pr-create` y `work-integrate` **no lo ejecutan** y lo reportan `N/A` por política; las puertas del repo propio son `quality-check` y `code-review`. Este skill solo corre **a mano, a petición expresa del usuario**, como informe de cobertura del sistema bajo prueba, y su veredicto nunca condiciona un PR ni un merge. Un `FAIL` fiel al TC cuenta como criterio cubierto con hallazgo (es el objetivo del repo detectarlo). Contrato completo en [`${PLUGIN_ROOT}/references/implementation.md`](../../references/implementation.md#modo-pruebas-implementationscope-tests--contrato-para-el-catálogo).

---

## Handoffs del ciclo

Posición: **validación / cierre de calidad** — después de `work-implement`.

| | |
|--|--|
| **Entrada** | Trabajo (`US-XXX` / `WI-XXX`, u otro artefacto) con **criterios de aceptación identificados**; código implementado; idealmente tests escritos por `quality-specialist` en el cierre de `work-implement`. Resultados de pruebas **vía `quality-check`** (caché `quality-check-run.json` o delegación `tests-only`). **O** un `FT-XXX` (registro de funcionalidad ya implementada — inferida de código legacy o documentada como existente) para comprobar si está cubierta por pruebas. |
| **Salida** | `criteria-coverage.md` en la ubicación del tipo + veredicto sobre la cobertura. |
| **Veredicto `REJECTED` (US/WI)** | Volver a `work-implement` (fase de pruebas con `quality-specialist`) para cubrir los criterios faltantes; revalidar después. |
| **Prueba en rojo (`FAIL`)** | No es un hueco de cobertura: la corrige el flujo de `quality-check` (que delega en `work-implement`). Aquí solo queda anotada. |
| **Veredicto `REJECTED` (FT)** | Hay comportamiento ya implementado **sin pruebas**: escribir los tests faltantes sobre el código existente (no código funcional) con `work-implement` en su tipo **feature** —que automatiza los `TC-XXX` del `FT-XXX`— y revalidar. Formalizar ese trabajo como una tarea de mantenimiento (`WI-XXX`) es opcional y lo decide el usuario. |
| **Falta funcional en el trabajo** | Si la matriz revela que un criterio no es testeable o está mal definido, escalar a la definición/planificación del trabajo — para un `FT`, a quien lo registró (el flujo «Analizar legado» de `work-research` u otra fuente de la funcionalidad); no editar la especificación desde aquí. |

---

## Mapa de referencias

| Archivo | Cuándo leerlo |
|---------|---------------|
| `references/flow.md` | Flujo paso a paso (Pasos 0-7), delegación de la ejecución de pruebas en `quality-check` (caché `quality-check-run.json` / `tests-only`) y checklist completo. Leer antes de ejecutar el flujo. |
| `references/examples.md` | Ejemplos por tipo (US / WI, sin criterios, sin runner, criterio sin prueba) y anti-patrones. Leer ante dudas de comportamiento. |
| `assets/criteria-coverage-template.md` | Plantilla canónica del reporte de trazabilidad. Leer antes de redactar el reporte. |
| `references/report-reuse.md` | Reutilización del reporte: cálculo de `FINGERPRINT` y `SPEC_FINGERPRINT`, marca de pie y comportamiento del Paso 0. Leer antes de ejecutar el Paso 0. |

### Referencias compartidas del plugin

- [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md): **Idioma** — resolución obligatoria del idioma de artefactos, documentos y mensajes. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/linking.md`](../../references/linking.md): **Enlaces** — toda referencia a un archivo del proyecto se escribe como enlace que lo abre. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/fingerprint.md`](../../references/fingerprint.md) y [`${PLUGIN_ROOT}/references/quality-check-run.md`](../../references/quality-check-run.md): **Caché de cierre** — receta del `FINGERPRINT` y contrato de `quality-check-run.json` (esquema, frescura). *Al calcular la clave o leer/escribir la caché.*
- [`${PLUGIN_ROOT}/references/asking.md`](../../references/asking.md): **Preguntas** — mecanismo estructurado, ritmo, fallback. *Antes de la primera pregunta.*
- [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md): **Artefactos** — rutas del harness, identificadores, archivado. *Al resolver una ruta o calcular un ID.*
- [`${PLUGIN_ROOT}/references/frontmatter.md`](../../references/frontmatter.md): **Frontmatter** — cabecera YAML de todo artefacto: claves y valores en inglés, cómo se lee `status` y el resto de campos. *Al crear, leer o actualizar cualquier artefacto.*
- [`${PLUGIN_ROOT}/references/escalation.md`](../../references/escalation.md): **Límite de intentos** — cuántos intentos consecutivos se hacen sobre un mismo problema que no se resuelve antes de escalar al usuario, y qué hacer al agotarlos. *Lectura obligatoria antes de ejecutar el skill.*
