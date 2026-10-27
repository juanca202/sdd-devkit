# Tipo de plan: Incidente

Definición del tipo de plan **incidente (`BUG-XXX`)**: el **registro de un hallazgo** — un comportamiento incorrecto, defecto o incidencia observada — con su evidencia. Esta referencia se carga desde `SKILL.md` cuando la selección de tipo de plan resuelve a este caso. Asume ya resueltos el subagente, el mecanismo de preguntas y el idioma (ver `SKILL.md`).

> **Un incidente no es implementable.** Describe **qué está mal**, nunca cómo corregirlo: no lleva Plan de implementación, Archivos afectados ni Dependencias, no va a `work-implement` y no dispara `test-define`. Es el **insumo** de la corrección, que se planifica aparte como un `WI-XXX` de tipo `bug-fix` (en este mismo repositorio, o en el repositorio de la aplicación cuando el incidente nace en un repositorio solo de pruebas) y lo cita en su cabecera (`Origen: BUG-XXX`). Vive en su propia carpeta, a la altura de `user-stories/` y `work-items/`: `<changesPath>/incidents/BUG-XXX-[kebab-case]/README.md`.

> **De dónde nace.** Una prueba automatizada que falla siendo fiel a su `TC-XXX` (`work-implement`, tipos TC/FT), una ejecución manual de casos de prueba, un criterio `UNCOVERED` por prueba en rojo en `coverage-verify`, el diagnóstico de `work-research` (flujo «Analizar issue») en un repositorio solo de pruebas, o un defecto observado en producción que el usuario quiere dejar registrado antes de —o sin— planificar su corrección. En todos los casos **lo redacta este skill**: los demás hacen *handoff* pasando lo que observaron; ninguno escribe el incidente por su cuenta.

La plantilla canónica está en `assets/incident-template.md` (léela antes de escribir cualquier incidente). **Excepción:** en un repositorio con `implementation.scope: tests` la plantilla es `assets/incident-tests-template.md` — ver [Variante: modo pruebas](#variante-modo-pruebas-implementationscope-tests).

## Contenido

- [Ubicación de archivos](#ubicación-de-archivos)
- [Convenciones del nombre de carpeta](#convenciones-del-nombre-de-carpeta)
- [Información requerida antes de redactar](#información-requerida-antes-de-redactar)
- [Validación antes de crear](#validación-antes-de-crear)
- [Flujo: Registrar un incidente](#flujo-registrar-un-incidente)
- [Variante: modo pruebas](#variante-modo-pruebas-implementationscope-tests)
- [Flujo: Actualizar un incidente existente](#flujo-actualizar-un-incidente-existente)
- [`Resolución`: ciclo de vida](#resolución-ciclo-de-vida)
- [Checklist antes de redactar](#checklist-antes-de-redactar)
- [Ejemplos](#ejemplos)
- [Anti-patrones](#anti-patrones)
- [Notas](#notas)

---

## Ubicación de archivos

| Artefacto | Ruta |
|-----------|------|
| Incidente | `<changesPath>/incidents/BUG-XXX-[kebab-case]/README.md` |
| Evidencias adjuntas | `<changesPath>/incidents/BUG-XXX-[kebab-case]/assets/EV-XX-<descripción>.<ext>` |
| Incidente ya archivado (fallback) | `<archivedPath>/incidents/BUG-XXX-[kebab-case]/`, con la misma estructura interna |

Un incidente **no tiene** `progress.md`, `test-cases/`, `criteria-coverage.md` ni rama de trabajo: nada de eso aplica a un documento que no se implementa.

> **Los incidentes archivados siguen contando.** Un incidente puede estar bajo `<archivedPath>/incidents/` si el usuario lo archivó con `/work-plan BUG-XXX archive`. Su ID sigue ocupado y su carpeta se busca ahí cuando no está en la ruta activa. Ver [`${PLUGIN_ROOT}/references/archive.md`](../../../references/archive.md#contrato-para-el-resto-del-catálogo).

---

## Convenciones del nombre de carpeta

- Formato: `BUG-<número>-[nombre-descriptivo]/` con `BUG-<número>` en mayúsculas. Dentro, siempre un `README.md` como documento principal.
- **Sin tracker externo vinculado**: `<número>` es un secuencial **global de todos los incidentes del repo**, tres dígitos con cero a la izquierda → `BUG-001`, `BUG-002`, …
  - **El secuencial se calcula sobre `<changesPath>/incidents/` *y* `<archivedPath>/incidents/`.** Un ID no se libera al archivarse.
- **Con la integración activa**: `<número>` es el identificador que asigna ese proveedor al work item `Bug` creado; su formato exacto lo define el archivo de referencia del proveedor — ver «Resolución de la integración con el gestor de proyectos» en `SKILL.md`.
- Nombre descriptivo: minúsculas, kebab-case, corto y descriptivo; respetar el límite de título del tracker si lo hay.
- Ejemplos sin tracker: `BUG-001-api-acepta-tarjeta-vencida/README.md`, `BUG-002-alta-cliente-acepta-email-invalido/README.md`.

---

## Información requerida antes de redactar

**No inventar nada** — si un dato no es explícito, preguntar al usuario o al skill que hace el *handoff*.

| Dato | Cómo obtenerlo | Si no está disponible |
|------|----------------|-----------------------|
| **Comportamiento esperado** | Del `AC-XXX` / `TC-XXX` / documentación que fija lo correcto; si no existe, de lo que describa el usuario, citando que es su expectativa | Preguntar; sin «esperado» no hay defecto que registrar |
| **Comportamiento observado** | Literal: mensaje, código HTTP, estado en pantalla, valor devuelto, aserción que falló | Preguntar |
| **Pasos para reproducir** | Del `TC-XXX` ejecutado, del spec automatizado, de lo que el usuario hizo | Preguntar; si no se puede definir una reproducción, el incidente queda en `Draft` con el pendiente en Observaciones |
| **Evidencia** | Lo que registró la suite (capturas, video, traza, reporte, log, respuesta), el `TC-XXX`, `criteria-coverage.md`, una captura manual | **Obligatoria para `Ready`**: sin evidencia verificable queda en `Draft` |
| **Severidad** | Del usuario o inferida del impacto y confirmada: `Crítico` \| `Alto` \| `Medio` \| `Bajo` (solo esos valores) | Preguntar |
| **Repositorio** | Donde se observa el defecto; inferido del repo o indicado por el usuario. En modo pruebas, el **sistema bajo prueba** que declara `AGENTS.md` | Obligatorio para `Ready` |
| **Historia de usuario / caso de prueba relacionados** | Buscar la `US-XXX` (o `WI`/`FT`) cuyo comportamiento se incumple en `<changesPath>` y `<archivedPath>`, y el `TC-XXX` que lo detectó o lo cubre | `N/A` solo tras buscar; sin TC se omite la línea |
| **Vinculación con el gestor de proyectos** | Ver «Resolución de la integración con el gestor de proyectos» en `SKILL.md` | Con integración activa, seguir el archivo de referencia del proveedor **antes** de crear archivos: el incidente se crea allí como `Bug` |

> **Entrada desde otro skill.** Cuando el incidente llega por *handoff* (`work-implement`, `work-research`), ese skill ya trae el `TC-XXX`, la prueba, lo observado y las rutas de los artefactos del runner: **no re-entrevistar lo que ya viene**; limitar las preguntas a lo que falte. Si llega el **dossier de bug** de `work-research` (flujo «Analizar issue»), mapear: *Problema* → Descripción y Esperado/Observado; *Reproducción* → Pasos para reproducir; *Situación de las pruebas* y *Riesgos* → Contexto (como hipótesis, nunca como plan); cabecera (US, TC, work item) → cabecera.

Leer siempre **todos** los `BUG-*/README.md` existentes en `<changesPath>/incidents/` **y en `<archivedPath>/incidents/`** antes de crear: un mismo defecto no se registra dos veces.

---

## Validación antes de crear

- **ID disponible:** el `BUG-XXX` propuesto no existe ya **ni en `<changesPath>/incidents/` ni en `<archivedPath>/incidents/`** (con tracker externo: que no exista `BUG-<id>-*/` en ninguna de las dos rutas).
- **Duplicado:** comparar esperado/observado y pasos con los incidentes existentes (activos y archivados). Si uno ya registra el mismo defecto, informarlo y preguntar si actualizar su evidencia (p. ej. nueva ocurrencia) o descartar el nuevo; nunca crear un segundo incidente para el mismo comportamiento.
- **Rama de trabajo actual:** la misma advertencia que en las tareas de mantenimiento (`git branch --show-current`; si es una rama de implementación de una US, un WI o una automatización de pruebas, advertir y preguntar `Continuar en esta rama` / `Detenerme aquí`). **Excepción:** cuando el *handoff* viene de `work-implement` desde la rama `test/` donde se detectó el hallazgo, registrar ahí es el caso normal — no se pregunta; el incidente se commitea junto con la automatización.

**Si hay conflicto:**
```
⚠️ No es posible registrar el incidente todavía:
- <razón concreta>
- [BUG-XXX: Título](BUG-XXX-nombre/README.md) — <mismo defecto, si aplica>
```

---

## Flujo: Registrar un incidente

1. **Resolver el ID:** si el repo tiene un tracker externo vinculado, seguir su archivo de referencia (crea el work item `Bug` primero y usa su identificador). En cualquier otro caso, inferir el siguiente secuencial libre listando carpetas `BUG-*/` **en `<changesPath>/incidents/` y en `<archivedPath>/incidents/`**. Crear la carpeta `BUG-<número>-[nombre-descriptivo]/` antes de escribir el `README.md`.
2. **Redactar el incidente** siguiendo `assets/incident-template.md` (en modo pruebas, `assets/incident-tests-template.md` — ver la variante):
   - **Cabecera**: `Estado`; `Repositorio`; `Historia de usuario` (o `N/A` tras buscar); `Caso de prueba` si lo hay; `Reportado por`; `Fecha`; `Work Item (<sistema>)` solo si se creó vía el tracker vinculado.
   - **Descripción**: qué está mal, en una o dos frases. Sin causa supuesta ni solución.
   - **Comportamiento esperado / observado**, **Pasos para reproducir** (con precondiciones, ambiente por nombre y frecuencia), **Evidencia** (`EV-XX`, al menos una fila; los adjuntos copiados a `assets/`), **Impacto** (`Severidad`, `Alcance`, `Origen del hallazgo`, `Resolución: Open`).
   - **Contexto** (opcional): restricciones del dominio o la hipótesis de causa que aporte el usuario, **marcada como hipótesis**. Ningún texto del incidente propone cómo arreglarlo.
   - **Criterios de aceptación** (opcional): el comportamiento esperado ya es el criterio de cierre; si se rellenan, enuncian el comportamiento correcto, nunca la solución.
   - **Referencias**: work item del tracker, artefacto afectado, documentación que fija lo esperado.
   - **Observaciones**: solo pendientes reales (evidencia no adjuntable, datos que faltan para reproducir). Con pendientes que impidan reproducir: `Estado: Draft`.
3. **Sanitizar la evidencia.** Nunca incluir credenciales, tokens, cookies ni valores del `.env`; los ambientes se citan por nombre. Trazas, HAR y logs se revisan antes de copiar; si contienen datos de sesión y no se pueden limpiar, **no se adjuntan**: se listan como «No adjuntado — motivo» con su ruta de origen.
4. **Verificar el checklist** antes de asignar `Estado: Ready`.
5. **Trazabilidad hacia atrás.** Si el incidente llegó desde `work-implement`, devolverle el `BUG-XXX` creado para que lo anote en la línea `Hallazgos` de `test-cases-automation.md` (`seguimiento: BUG-XXX`) o en `Cobertura de test cases` de `progress.md`.
6. **Handoff.** Con el incidente en `Ready`, preguntar (herramienta estructurada): **[Planificar la corrección]** → `work-research` «Analizar issue» sobre este incidente (diagnóstico y `bug-fix` con plan) o, si la causa ya es conocida, `work-plan` para un `WI` de tipo `bug-fix` con `Origen: BUG-XXX`; **[Solo registrar]** → terminar. **Con `implementation.scope: tests` la única opción es registrar**: la corrección se planifica en el repositorio de la aplicación citando este incidente (o el work item `Bug` del tracker). Un incidente **nunca** va a `work-implement` ni dispara `test-define`.

---

## Variante: modo pruebas (`implementation.scope: tests`)

Aplica **solo** cuando la política de implementación resolvió `scope = tests`. Allí el incidente nace siempre de ejecutar un caso de prueba, así que el documento **tiene la forma de ese caso de prueba**: se redacta con **`assets/incident-tests-template.md`** (leerla antes de escribir), no con `incident-template.md`. Todo lo dicho en el flujo anterior sigue valiendo (no se propone solución, `Resolución`, handoffs, tracker); esta variante cambia **la estructura del documento y cómo se reúne la evidencia**. Con `scope: code` nada de esto aplica.

1. **Partir del `TC-XXX`.** Leer completo el caso de prueba que detectó el hallazgo (lo pasa el skill que lo detectó, o lo indica el usuario) y **copiar** sus Precondiciones, Datos de prueba, Pasos de ejecución y Resultado esperado final, con la misma numeración de pasos. La cabecera enlaza el TC, su criterio y su artefacto padre. El `TC-XXX-*.md` **no se edita**. Si el hallazgo no nace de un TC (observación manual), las mismas secciones se redactan a mano con lo que el usuario describa y `Caso de prueba: N/A`.
2. **Ampliar los pasos con lo ocurrido.** Cada paso lleva su **Resultado observado** (literal; «Conforme» si se comportó como se esperaba; «No ejecutado» tras el fallo) y sus **Comentarios**: todo lo que hace falta para **reproducirlo** y el TC no dice — esperas, endpoint o selector exacto, cuerpo de la petición, datos que hay que sembrar, orden, diferencias entre ejecuciones. Se marca con ❌ el paso donde aparece el fallo. Los valores reales usados van en Datos de prueba; lo sensible, por el nombre de su variable. Esa información sale del spec automatizado, de la salida del runner y de lo que reporte el skill que detectó el hallazgo; lo que no conste **se pregunta**, no se inventa.
3. **Hallazgos (`H-XX`).** Una fila por comportamiento incorrecto distinto: paso, qué está mal, esperado, observado, su **Severidad** y sus evidencias; la `Severidad` de Impacto es la más alta de la tabla. Si son defectos independientes, proponer un incidente por defecto.
4. **Evidencias (`EV-XX`) — adjuntar lo que registró la suite.**
   - **Localizar** la salida del runner para la prueba fallida a partir de **su configuración real** (p. ej. `outputDir` / reporter en Playwright, `screenshotsFolder` / `videosFolder` en Cypress, el directorio de reportes que declare el proyecto o `AGENTS.md`); no asumir rutas. Recoger los artefactos **de esa prueba y esa ejecución**: capturas, video, traza, diff visual, reporte, log, respuesta de la API.
   - **Copiar** cada artefacto a `BUG-XXX-[slug]/assets/` con nombre `EV-XX-<descripción>.<ext>` y enlazarlo por ruta relativa en la tabla. No se enlaza la carpeta de salida del runner: suele estar en `.gitignore` y se sobrescribe en la siguiente ejecución.
   - **Este skill no ejecuta pruebas.** Si la suite no dejó artefactos (o ya se sobrescribieron), no se re-ejecuta desde aquí: se pide al usuario la evidencia o se le indica re-ejecutar el caso con `work-implement` / el runner, y el incidente queda en `Draft` hasta tener al menos una.
   - **Sanitizar**, como en el flujo general. Un artefacto muy pesado (video o traza grande) se confirma con el usuario antes de entrar al repositorio.
5. **Ready** exige: Descripción, Caso de prueba (o `N/A` justificado), Precondiciones, Pasos con observado y el paso fallido marcado, Resultado esperado y observado final, al menos un `H-XX`, al menos una `EV-XX` **adjunta en `assets/`**, Severidad y sistema bajo prueba.
6. **Tracker.** Con la integración activa, el work item `Bug` lleva el documento con estos mismos encabezados y las evidencias de `assets/` **como adjuntos** — ver `references/<proveedor>.md`.

---

## Flujo: Actualizar un incidente existente

1. **Identificar la carpeta** — por número, nombre o título. Si no aparece en `<changesPath>/incidents/`, buscarla bajo `<archivedPath>/incidents/` antes de darla por inexistente. **Si está archivada, parar y avisar:** editarla exige desarchivarla primero, decisión del usuario. **Nunca** crear una carpeta nueva en la ruta activa por no haber encontrado el incidente.
2. **Leer el contenido actual** completo antes de editar.
3. **Aplicar los cambios** solicitados: nueva ocurrencia (fila de Evidencia, frecuencia), severidad corregida, datos que faltaban para reproducir, `Resolución` por decisión del usuario (`Discarded — motivo`). Si el usuario cambia el estado a **Ready**: verificar el checklist antes de guardar.
4. **Confirmar** mostrando las secciones modificadas.

---

## `Resolución`: ciclo de vida

| Valor | Quién lo escribe | Cuándo |
|-------|------------------|--------|
| `Open` | `work-plan` al registrar | Siempre al crear |
| `Fixing (WI-YYY)` | `work-plan` al crear el `bug-fix` que cita `Origen: BUG-XXX` | Al planificar la corrección en este repositorio. Si la corrección se planifica en otro repositorio (incidente nacido en un repo de pruebas), el valor cita el work item del tracker o el repositorio: `Fixing (<referencia>)` |
| `Fixed (WI-YYY)` | `work-integrate` al integrar ese `bug-fix` | Misma búsqueda en ruta activa y archivo; si el incidente vive en otro repositorio, solo se menciona en el reporte |
| `Discarded — motivo` | `work-plan` (flujo *Actualizar*) por decisión del usuario | No es un defecto, no se reproduce, duplicado de otro `BUG-XXX`… |

Un incidente con `Resolución: Open` o `Fixing (…)` cuenta como **incompleto** para `/work-plan archive` sin ID; con `Fixed (…)` o `Discarded` cuenta como completo.

---

## Checklist antes de redactar

**Información:**
- [ ] Todos los `BUG-*/README.md` de `<changesPath>/incidents/` **y de `<archivedPath>/incidents/`** leídos; sin duplicado del mismo defecto
- [ ] Lo aportado por el skill que hace el *handoff* (TC, spec, observado, artefactos del runner) leído completo; preguntas limitadas a lo que falta
- [ ] Idioma resuelto según la sección «Resolución de idioma» de `SKILL.md`
- [ ] **Vinculación con tracker externo**: verificada (ver `SKILL.md`); si está vinculado, seguido su archivo de referencia y el identificador externo extraído antes de crear la carpeta local

**Validación:**
- [ ] ID `BUG-XXX` libre en `<changesPath>/incidents/` **y en `<archivedPath>/incidents/`**
- [ ] Rama de trabajo actual verificada; si es una rama de implementación ajena, se advirtió y se preguntó `Continuar` / `Detenerme aquí` (no aplica al *handoff* de `work-implement` desde su rama `test/`)

**Condiciones para `Estado: Ready`:**
- [ ] **`scope: code`** (plantilla `assets/incident-template.md`): Descripción, Comportamiento esperado/observado, Pasos para reproducir (precondiciones, ambiente por nombre, frecuencia), al menos una `EV-XX` verificable (sin credenciales), Severidad con uno de los cuatro valores, Repositorio, `Resolución: Open`
- [ ] **Modo pruebas** (plantilla `assets/incident-tests-template.md`): secciones del `TC-XXX` copiadas con su numeración; pasos con Resultado observado y Comentarios para reproducir, paso fallido marcado; al menos un `H-XX`; evidencias de la suite copiadas a `assets/` y enlazadas (`EV-XX`), sanitizadas; Severidad; sistema bajo prueba. Sustituye a la condición anterior.
- [ ] **Sin** Plan de implementación, Archivos afectados ni Dependencias; ninguna propuesta de solución en el texto (una hipótesis de causa, si la hay, marcada como tal en Contexto u Observaciones)
- [ ] **Observaciones** sin pendientes que impidan reproducir

**Formato:**
- [ ] Nombre de carpeta en kebab-case, secuencial global sobre `incidents/` **+ `<archivedPath>/incidents/`**
- [ ] Marca oculta `<!-- bug:status=… -->` conservada, en inglés
- [ ] Sin párrafos instructivos de plantilla en el incidente publicado
- [ ] `specification.testCases.createMode` **no aplicado**: un incidente no tiene `AC-XXX` que cubrir

---

## Ejemplos

**Ejemplo 1 — Hallazgo en un repositorio solo de pruebas**
- *Entrada:* `implementation.scope: tests`; `work-implement` reporta que `TC-005` (API Test) falla: la API responde 200 donde el TC espera 422, y el runner dejó el reporte y el cuerpo de la respuesta.
- *Salida:* carpeta `BUG-003-alta-cliente-acepta-email-invalido/` con `README.md` según `assets/incident-tests-template.md`: cabecera enlazando `TC-005` y su `AC-XXX`; Precondiciones, Datos y Pasos copiados del TC, con el paso 2 marcado ❌ (observado: `200 OK`, comentario con el endpoint y el cuerpo enviado); `H-01`; `assets/EV-01-reporte.html` y `assets/EV-02-respuesta.json` copiados de la salida del runner; `Resolución: Open`. Sin plan ni propuesta de corrección. Devuelve `BUG-003` a `work-implement` para la línea `Hallazgos`. Única opción al cerrar: registrar.

**Ejemplo 2 — Defecto observado en producción (`scope: code`)**
- *Entrada:* «Registra el bug: el cálculo de impuestos del carrito ignora el descuento cuando hay cupón; en producción desde el viernes, captura adjunta.»
- *Salida:* `BUG-004-impuestos-ignoran-cupon/README.md` con `assets/incident-template.md`: Esperado citando el `AC-003` de `US-018`, Observado literal, Pasos con precondiciones y `Frecuencia: Always`, `EV-01` con la captura copiada a `assets/`, `Severidad: Alto`, `Origen del hallazgo: producción`, `Resolución: Open`. Pregunta **[Planificar la corrección]** / **[Solo registrar]**; con lo primero, *handoff* a `work-research` «Analizar issue» sobre `BUG-004`.

**Ejemplo 3 — Posible duplicado**
- *Entrada:* un hallazgo cuyo esperado/observado coincide con `BUG-002`, ya archivado con `Resolución: Fixed (WI-011)`.
- *Comportamiento:* informar que el defecto ya fue registrado y corregido; preguntar si es una **regresión** (nuevo incidente que cita `BUG-002` en Referencias) o una ocurrencia que no se corrigió (desarchivar y actualizar — decisión del usuario). No crear nada hasta la respuesta.

**Ejemplo 4 — Repo vinculado a un tracker externo** — ver `references/<proveedor>.md` (p. ej. `references/azure-devops.md`): el incidente se crea como work item `Bug` y su `id` da el número local.

---

## Anti-patrones

- Escribir en un incidente cómo solucionarlo (plan, archivos, diseño): un incidente describe qué está mal; la solución es un `WI` de tipo `bug-fix`.
- Registrar un hallazgo como `WI-XXX`: el tipo `bug` ya no existe en los work items; el registro es siempre un `BUG-XXX`.
- Dejar un incidente en `Ready` sin evidencia verificable, o pegar en su evidencia tokens, cookies o valores del `.env`.
- Enviar un incidente a `work-implement`, ofrecerle `test-define` o crearle `progress.md`.
- Crear un `bug-fix`, refactor u otro WI en un repositorio con `implementation.scope: tests`: allí solo se registran incidentes; la remediación se planifica en el repositorio de la aplicación.
- Redactar el incidente directamente desde `work-implement` o `work-research` en lugar de hacer *handoff* a este skill.
- Crear un segundo incidente para un defecto ya registrado (activo o archivado) en lugar de actualizar su evidencia o registrarlo como regresión que lo cita.
- En modo pruebas: redactar el incidente con `incident-template.md` en vez de la plantilla con forma de caso de prueba; resumir los pasos en lugar de copiar los del `TC-XXX` con lo observado; enlazar la carpeta de salida del runner en vez de copiar las evidencias a `assets/`; adjuntar una traza, HAR o log sin revisar que no lleve tokens o cookies; re-ejecutar la suite desde `work-plan` para generar evidencia.
- Narrar el flujo interno al usuario; solo reportar el incidente creado, lo que debe decidir y lo pendiente.

---

## Notas

### Handoffs del ciclo

Posición: **registro** — un incidente no entra en el ciclo de implementación; lo alimenta.

| | |
|--|--|
| **Entrada** | Un hallazgo que se registra: *handoff* de `work-implement` (prueba en rojo fiel al TC) o de `work-research` («Analizar issue» en modo pruebas), o la petición directa del usuario (un `UNCOVERED` por rojo en `coverage-verify`, una ejecución manual de TC, producción). |
| **Salida** | Incidente en **`Estado: Ready`** con `Resolución: Open`. Nunca es salida para implementar. |
| **Siguiente paso** | `work-research` «Analizar issue» sobre el `BUG-XXX` (diagnóstico → `bug-fix` con plan) o `work-plan` → `WI` de tipo `bug-fix` con `Origen: BUG-XXX` cuando la causa ya es conocida. En `implementation.scope: tests`: ninguno en este repo; la corrección se planifica en el repositorio de la aplicación. |
| **Cierre de trazabilidad** | `work-plan` pone `Fixing (WI-YYY)` al crear el `bug-fix`; `work-integrate` pone `Fixed (WI-YYY)` al integrarlo (un PR creado con `pr-create` se cierra después con `work-integrate`, que es quien marca el `Done`). |
