---
name: requirement-refine
description: "Punto de entrada único de requerimientos: tomar uno en bruto (idea, ticket, correo, transcripción, diseño, wireframes, documento de cliente) y formalizarlo, eligiendo el tipo al inicio, como RQ-XXX (requerimiento de un tercero que solo se certifica: AC-XXX trazados a su documento, para /test-define), PRD-XXX (problema, objetivos, actores, alcance, FR-XXX y AC-XXX de negocio, sin decisiones técnicas) o SRS-XXX (ISO/IEC/IEEE 29148: PRD + NFR-XXX, interfaces, datos, cumplimiento, stack y repositorios). Promueve un PRD a SRS conservando el número. Guarda el original en references/; wireframes vía /design-define. Activar con «refina este requerimiento», «crea un SRS/PRD/RQ», «especificación de requisitos», «documento de producto», «/requirement-refine», al describir una necesidad cruda o por handoff de /test-define. Modificadores: `rq` / `prd` / `srs` fijan el tipo; `archive` archiva con confirmación. No crea US (/work-define), TC (/test-define) ni documentación técnica (/design-define)."
license: MIT
---

# Skill: Formalización de requerimientos (RQ · PRD · SRS)

Guía para **crear, actualizar o promover** el documento que formaliza un **requerimiento en bruto**: una idea, un ticket, un correo, una conversación, una transcripción de reunión, un diseño o wireframes existentes, documentación técnica, un documento ya redactado por el cliente, o cualquier combinación — todo insumo que dé contexto sirve, y no hace falta un único formato. Si el insumo incluye imágenes o gráficas, se leen y se interpretan antes de continuar. **Es el único punto de entrada de requerimientos del catálogo:** ningún otro skill formaliza uno por su cuenta (`test-define`, al recibir texto crudo, hace handoff aquí).

## Tipos de documento

Lo primero que resuelve el skill —antes de crear nada— es **qué documento se genera**, según quién es dueño de la definición y para qué se va a usar. Detalle y DoR de cada uno en [`references/quality-criteria.md`](references/quality-criteria.md#tipos-de-documento-rq-prd-y-srs); cómo se elige y se pregunta, en [`references/flow.md` — Paso 0](references/flow.md#paso-0--tipo-de-documento).

| Documento | Pregunta que responde | Cuándo | `Ready` significa | Lo consume |
|---|---|---|---|---|
| **`RQ-XXX` — requerimiento externo** | ¿Qué certificamos de lo que otro definió? | La definición es de un tercero (cliente, otro proveedor, documento ya aprobado) y este equipo **solo prueba**. Harness `scope: tests`. | El dueño de la definición puede firmar la *Cobertura de la fuente* | `/test-define` |
| **`PRD-XXX` — documento de producto** | ¿Por qué, para quién y qué resultado? | Negocio debe aprobar alcance y prioridades **antes** de decidir tecnología (preventa, estimación, go/no-go), o la decisión técnica es de otro o es después. | Negocio aprobó alcance, prioridades y criterios de aceptación | `/work-define`, `/test-define`, promoción a SRS |
| **`SRS-XXX` — especificación de requisitos** | ¿Qué debe hacer el sistema exactamente, con qué calidad, dónde y cómo se verifica? | Este equipo implementa; stack decidido o a investigar; sistema nuevo o existente. | Se puede implementar sin repreguntar | `/work-define`, `/work-plan`, `/arch-init`, `/design-define`, `/test-define` |

- **Un solo secuencial para los tres prefijos:** el número de un `RQ-`, `PRD-` o `SRS-` es el siguiente libre entre **todas** las carpetas `RQ-*`, `PRD-*` y `SRS-*` de `<changesPath>/requirements/` y `<archivedPath>/requirements/`. El prefijo es el tipo; no hay campo `Tipo`.
- **Cada tipo tiene su plantilla** (`assets/rq-template.md`, `assets/prd-template.md`, `assets/srs-template.md`). PRD y SRS comparten la **numeración de secciones 1-15**: el PRD es el SRS con el bloque de ingeniería (stack, repositorios, `NFR-XXX` con umbral, interfaces hw/sw/comunicaciones, entidades de datos, cómo se cumple la normativa, método de verificación, riesgos técnicos) marcado «Pendiente — se completa al promover a SRS». **Promover** completa solo ese bloque y renombra la carpeta `PRD-XXX-slug` → `SRS-XXX-slug` con el **mismo número** (`git mv` + reparación de enlaces), sin renumerar nada.
- **El RQ no se convierte** en PRD/SRS: si el caso pasa a implementarse, se crea el PRD/SRS desde el mismo insumo, se enlaza el RQ y se archiva.
- **Los tres llevan `AC-XXX`** (criterios de aceptación con id inmutable): en PRD/SRS viven en la sección 12 junto al método de verificación; en el RQ, en su tabla con la **fuente** del documento del dueño. `test-define` los consume tal cual, sin artefactos intermedios.
- El SRS **no** contiene historias de usuario ni tareas — eso lo produce `work-define` (y, para las tareas, `work-plan`). Tampoco modelos de datos, contratos de API ni diagramas técnicos — eso es `design-define`. Si un requerimiento ya está claro (stack, repos y alcance conocidos, sin decisiones pendientes), se puede ir directo a `/work-define`.

Plantillas canónicas: `assets/rq-template.md`, `assets/prd-template.md` y `assets/srs-template.md` — lee la del tipo antes de escribir el documento.

## Mapa de referencias

Carga el archivo correspondiente cuando vayas a ejecutar la tarea; el detalle íntegro vive en `references/`.

| Necesitas… | Archivo |
| ---------- | ------- |
| **Paso 0 — tipo de documento** (parte de señales, reglas de recomendación y la pregunta RQ/PRD/SRS), flujo de **crear un RQ**, flujo de **promover un PRD a SRS**, y el flujo paso a paso de **crear** y **actualizar** un PRD/SRS: cierre de lagunas funcionales (incluidas interfaces externas, datos y cumplimiento normativo), supuestos de funcionalidad transversal reutilizable, **wireframes de UI** (tipo de solución, pantallas, y su delegación a `/design-define` vía subagente), **verificación y trazabilidad**, **riesgos**, la pregunta sobre el stack (investigar vs. ya decidido) y su delegación a `/work-research`, repositorios/proyecto base, checklist, ejemplos y anti-patrones | [`references/flow.md`](references/flow.md) |
| **Guion de la entrevista**: la secuencia de 17 etapas (idea → problema → objetivo de negocio → … → ready), las **tres olas** (Discovery / Definition / Validation), los **tres roles** (PO, UI/UX, Arquitecto) con su dominio y lenguaje de preguntas, la regla **requisitos vs. decisiones de diseño**, y la validación final con **subagente sin contexto** | [`references/interview.md`](references/interview.md) |
| Detalle de **RFC 2119**, categorías de **FR-XXX** (funcionales) y **NFR-XXX** (ISO 25010), **prioridad**, **estado por requisito**, **métodos de verificación**, **verificabilidad**, la tabla comparativa de **tipos de documento** y las **Definition of Ready (DoR)** del PRD, del RQ y del SRS | [`references/quality-criteria.md`](references/quality-criteria.md) |
| Estructura del `README.md` de un PRD (problema y evidencia, `OB-XX`, `SC-XX`, expectativas de calidad cualitativas, obligaciones de datos, `AC-XXX` de negocio; secciones «solo SRS» como «Pendiente») | [`assets/prd-template.md`](assets/prd-template.md) |
| Estructura del `README.md` de un SRS (misma numeración que el PRD, con el bloque de ingeniería completo) | [`assets/srs-template.md`](assets/srs-template.md) |
| Estructura del `README.md` de un RQ (requerimiento externo: fuente por `AC-XXX`, historial del documento fuente, Cobertura de la fuente) | [`assets/rq-template.md`](assets/rq-template.md) |
| Generación y revisión de los **wireframes** (`WF-XXX`): no es de este skill — se delega a `/design-define` (flujo «Wireframes» de ese skill, dueño de la plantilla y del lote de revisión); este skill resuelve tipo de solución y pantallas, invoca el subagente y registra en la sección 11 las rutas y estados devueltos | Sección «Diseño de interfaz» de [`references/flow.md`](references/flow.md) (paso 4) |

### Referencias compartidas del plugin

Reglas transversales del catálogo; viven en la raíz del plugin, no en este skill.

- [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md): **Idioma** — resolución obligatoria del idioma de artefactos, documentos y mensajes. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/linking.md`](../../references/linking.md): **Enlaces** — toda referencia a un archivo del proyecto se escribe como enlace que lo abre. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../references/requirement-criteria.md): **Vocabulario de requisitos** — tabla RFC 2119 y catálogos de categorías. *Al redactar o clasificar un requisito o criterio.*
- [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md): **Artefactos** — rutas del harness, identificadores, archivado. *Al resolver una ruta o calcular un ID.*
- [`${PLUGIN_ROOT}/references/frontmatter.md`](../../references/frontmatter.md): **Frontmatter** — cabecera YAML de todo artefacto: claves y valores en inglés, cómo se lee `status` y el resto de campos. *Al crear, leer o actualizar cualquier artefacto.*
- [`${PLUGIN_ROOT}/references/asking.md`](../../references/asking.md): **Preguntas** — mecanismo estructurado, ritmo, fallback. *Antes de la primera pregunta.* Este skill declara una excepción de ritmo (cierre de lagunas por tandas de hasta 3) — ver la tabla de excepciones en ese archivo.

---

## Rutas de las referencias compartidas

`${PLUGIN_ROOT}` es la **raíz del plugin instalado** (la carpeta que contiene `skills/`, `agents/` y `references/`), y toda referencia compartida de este skill se escribe como `${PLUGIN_ROOT}/references/<archivo>.md`. Para resolverla: la raíz es la **carpeta desde la que se cargó este archivo**, dos niveles arriba (`<raíz>/skills/<nombre>/SKILL.md`) — el cliente anuncia esa ubicación al invocar el skill (p. ej. «Base directory for this skill: …»). Si esa ubicación no está disponible, localizar la instalación buscando el manifiesto del plugin: `PLUGIN_ROOT="$(dirname "$(grep -rl '\"name\": *\"sdd-devkit\"' "$HOME/.claude/plugins" --include=plugin.json 2>/dev/null | head -1)")"`. En ambos casos, **verificar antes de usarla** que `$PLUGIN_ROOT/references/language.md` existe. El destino de cada enlace markdown (`../../references/…`) existe solo para navegar el repositorio en GitHub o en un editor: **no** resolverlo desde el directorio de trabajo. **Nunca buscar `references/` en el proyecto**: un `<proyecto>/references/language.md` que no existe no es un archivo que falte, es una ruta mal resuelta — corregir la raíz y volver a leer, sin preguntar al usuario ni saltarse la lectura.

## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos, documentos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

**Enlaces a archivos del proyecto:** DEBES leer y aplicar [`${PLUGIN_ROOT}/references/linking.md`](../../references/linking.md) — todo archivo o carpeta existente del proyecto que este skill mencione en un artefacto, documento o mensaje (identificadores como `US-XXX` o `WF-XXX`, rutas, índices) se escribe como enlace Markdown que lo abre.

---

## Modificadores de invocación

| Modificador | Efecto |
|---|---|
| `rq` · `prd` · `srs` | Fija el **tipo de documento** y omite la pregunta del Paso 0 (`/requirement-refine prd portal de socios`). `srs` sobre un `PRD-XXX` existente = **promover** (`/requirement-refine srs PRD-004`). |
| `archive` | Archiva `RQ-XXX`, `PRD-XXX` o `SRS-XXX`; ver abajo. |
| *(sin modificador)* | Crear (con Paso 0), o actualizar si se indica un ID existente. Sobre un PRD en `Ready`, ofrece promover. |

## Modificador `archive` (archivar `RQ-XXX`, `PRD-XXX` y `SRS-XXX`)

**Archiva este skill, no los de cierre.** `work-integrate` y `pr-create` no archivan: siempre hay una revisión humana antes, y el usuario lo pide aquí cuando decide. `test-define` tampoco archiva: el `RQ-XXX` lo produce este skill y se archiva aquí (los `TC-XXX` viajan con su padre). Procedimiento, destinos, reglas de confirmación y contrato para el resto del catálogo: [`${PLUGIN_ROOT}/references/archive.md`](../../references/archive.md) — leerlo antes de mover nada.

| Invocación | Alcance |
|------------|---------|
| `/requirement-refine archive SRS-XXX` · `/requirement-refine archive PRD-XXX` · `/requirement-refine archive RQ-XXX` · `/requirement-refine SRS-XXX RQ-YYY archive` (uno o varios IDs de cualquier tipo; el orden es indiferente) | Los artefactos indicados, **estén como estén**. |
| `/requirement-refine archive` (sin ID) | **Todos** los `RQ-XXX`, `PRD-XXX` y `SRS-XXX` de `<changesPath>/requirements/` que ya estén **completos**; los incompletos se listan aparte con su estado y no se mueven. |

Reglas que este skill aplica al archivar:

- **El estado no restringe, pero se informa.** Antes de preguntar, componer el parte de estado. `SRS-XXX`: `status` y la tabla «Historias de usuario derivadas» (FR/NFR sin US derivada cuentan como incompleto). `PRD-XXX`: `status` y si fue o no promovido (un PRD archivado sin promover es válido — p. ej. un go/no-go negativo — pero se informa). `RQ-XXX`: `status`, `test-cases/` (AC sin TC, TC en `Draft`) y, si existe, el veredicto de `criteria-coverage.md`. Con algo incompleto, la pregunta lo dice explícitamente y el usuario decide.
- **Siempre se confirma** (herramienta estructurada, una sola tanda para todo el lote), mostrando origen → destino de cada carpeta y las investigaciones sueltas que quedarían huérfanas. Sin canal de respuesta, no se archiva.
- **Destino:** `<archivedPath>/requirements/<ID>-<slug>/`, con `<archivedPath>` = `specification.archivedPath` de `.sdd-devkit/settings.json` (por defecto `docs/specs/archived/`) y la subcarpeta espejo de `<changesPath>`. La carpeta se mueve completa (`README.md`, `references/`, `assets/`, `wireframes/`, `research/`, `test-cases/`). `git mv`, guard de destino, reparación de enlaces y cierre con un commit directo `docs(specs): archivar <ID>`, tal como describe la referencia.
- Un artefacto ya bajo `<archivedPath>` se informa y no se toca; un ID suelto **sin** `archive` nunca archiva.

---

## Ubicación de archivos

Layout completo del harness, identificadores y contrato de archivado: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md).

Lo propio de este skill:

| Artefacto | Ruta |
| --------- | ---- |
| PRD (**salida**) | `<changesPath>/requirements/PRD-XXX-[nombre-corto]/README.md` |
| SRS (**salida**; o PRD promovido, mismo número) | `<changesPath>/requirements/SRS-XXX-[nombre-corto]/README.md` |
| RQ — requerimiento externo (**salida**) | `<changesPath>/requirements/RQ-XXX-[slug]/README.md` |
| Requerimiento en bruto o documento fuente (**entrada, conservada tal cual**) | `<changesPath>/requirements/<ID>-[slug]/references/` (una copia por versión recibida) |
| Casos de prueba de aceptación (los crea `/test-define`) | `<changesPath>/requirements/<ID>-[slug]/test-cases/` — padre `RQ-XXX`, `PRD-XXX` o `SRS-XXX`; este skill no los escribe, pero al promover actualiza su **Artefacto padre** al nuevo prefijo |
| Wireframes de pantalla (si el requerimiento tiene UI) | `wireframes/WF-XXX-[pantalla-slug].md` (documento) y `WF-XXX-[pantalla-slug].svg` (SVG hermano enlazado) — **dentro de la carpeta del SRS**, junto a `references/` y `assets/`, indexados en la sección 11 del `README.md`. **Los crea y revisa `/design-define` vía subagente**; este skill no escribe el `.md` ni el `.svg`, solo la fila de la sección 11 con la ruta y el estado devueltos. Son un recurso del SRS, no documentación de arquitectura: ni este skill ni `design-define` los ponen en `docs/architecture/` |
| Otros archivos de apoyo | `<changesPath>/requirements/<ID>-[slug]/assets/` |
| Investigación de stack delegada (si se investigó; solo SRS) | `<changesPath>/requirements/SRS-XXX-[nombre-corto]/research/RS-XXX-[slug]/README.md` — la crea `/work-research`, este skill solo la referencia |
| Glosario (opcional) | `docs/glossary.md` |

> **`references/` vs. `assets/`.** `references/` guarda el **insumo tal como llegó** (el ticket, el correo, la transcripción de reunión, diseños, wireframes ya existentes, capturas o documentación técnica) para trazabilidad — nunca se edita ni se reescribe, solo se añade. `assets/` guarda lo que **este skill produce** como apoyo del documento (cualquier archivo derivado distinto de los wireframes); eso sí se actualiza cuando cambia. **Los wireframes no van en `assets/`:** tienen su propia carpeta `wireframes/` dentro de la carpeta del SRS (ver tabla), enlazados desde la sección 11.

### Convenciones del nombre de carpeta

> Reglas comunes de slug e identificadores: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md). Lo específico de este skill:

- Formato: `RQ-XXX-[slug]`, `PRD-XXX-[nombre-corto]` o `SRS-XXX-[nombre-corto]`, prefijo en mayúsculas y número de 3 dígitos.
- Nombre corto: minúsculas, kebab-case, sin artículos ni palabras vacías.
- **Un único secuencial** para los tres prefijos, global sobre `<changesPath>/requirements/` **y** `<archivedPath>/requirements/`: el siguiente número es el mayor entre todas las carpetas `RQ-*`, `PRD-*` y `SRS-*` + 1 (un documento archivado conserva su ID; un número nunca se reutiliza). Un PRD promovido a SRS conserva el número y cambia de prefijo y de carpeta (`PRD-007-…` → `SRS-007-…`). La carpeta permanece en la ruta activa hasta que el usuario la archive con el [modificador `archive`](#modificador-archive-archivar-rq-xxx-prd-xxx-y-srs-xxx).
- Ejemplos: `RQ-001-roles-capp`, `PRD-002-disputas-de-cargos`, `SRS-003-migracion-facturacion-electronica`, y `SRS-002-disputas-de-cargos` cuando el PRD-002 se promueve.

---

## Información requerida antes de redactar

Antes de crear o editar cualquier PRD o SRS, el agente debe tener clara la siguiente información (el RQ sigue su propio flujo y solo usa la primera fila). **No inventar nada** — si algún dato no es explícito, preguntar al usuario.

La tabla sigue el **orden en que se resuelven**: primero lo funcional, después la UI y al final lo técnico — salvo que una fila funcional dependa de una fila técnica puntual para cerrarse (ver la excepción en [Flujo (resumen)](#flujo-resumen)).

| Dato | Cómo obtenerlo | Si no está disponible |
| ---- | --------------- | ---------------------- |
| **Tipo de documento** (RQ / PRD / SRS) | Modificador, contexto de la sesión, o reglas del Paso 0 (`scope: tests` + dueño externo → RQ sin preguntar); si no, pregunta estructurada con la recomendación primero, tras presentar el parte de señales | Nunca se asume: sin tipo no se crea carpeta. Las filas marcadas *(solo SRS)* no aplican a un PRD (quedan «Pendiente — se completa al promover») y ninguna fila de entrevista aplica a un RQ (ver su flujo) |
| **Requerimiento en bruto y su contexto** | Cualquier insumo aportado por el usuario: descripción, ticket, correo, transcripción de reunión, diseño, wireframes, capturas o diagramas, documentación técnica existente. Todo se guarda tal cual en `references/` de la carpeta del SRS. Las **imágenes y gráficas se leen y se interpretan** (no se asume su contenido) antes de continuar — mismo criterio que `/work-define` | Preguntar; sin esto no hay nada que estructurar |
| **Alcance y objetivo funcional** | Del requerimiento en bruto | Preguntar; sin esto el SRS solo puede crearse en Draft |
| **Requisitos funcionales (`FR-XXX`)** | Del requerimiento en bruto | Preguntar; sin al menos un `FR-XXX` el SRS solo puede crearse en Draft |
| **Requisitos no funcionales (`NFR-XXX`)** | Del requerimiento o inferibles del dominio | Preguntar; puede quedar «No aplica» justificado |
| **Supuestos de funcionalidad transversal reutilizable** (autenticación, roles/permisos, notificaciones, auditoría, pagos, almacenamiento, búsqueda, etc.) | Inferido primero (¿ya existe/se reutiliza del proyecto base o una plataforma compartida, o está en el alcance construirla?); se pregunta solo si la inferencia es ambigua | Si es claramente reutilizada, no se pregunta — se registra el supuesto en Supuestos y dependencias y no se crea `FR-XXX`; si está en alcance, se redacta su `FR-XXX` |
| **Interfaces externas** (usuario, hardware, software, comunicaciones) | Del requerimiento, a nivel de existencia y contrato mínimo | Preguntar; omitir las subsecciones que no apliquen |
| **Requisitos de datos** (entidades, retención/privacidad, volumen) | Del requerimiento o del dominio | Preguntar; formalizarlos antes de Ready si el requerimiento maneja datos |
| **Cumplimiento normativo** (normativa aplicable y cómo se cumple) | Del requerimiento o del dominio (p. ej. datos personales, financieros, de salud) | Preguntar solo si el dominio lo exige; «No aplica» es válido |
| **Prioridad** de cada `FR-XXX`/`NFR-XXX` | Propuesta por lote al cerrar los requisitos, confirmada en una sola pregunta (ver [Prioridad](references/quality-criteria.md#prioridad)) | Sin asignar, el SRS no puede declararse Ready |
| **Restricciones, supuestos y fuera de alcance** | Del requerimiento o del usuario | Preguntar |
| **¿Requiere diseño de interfaz (UI)?** | Inferido del objetivo funcional y los `FR-XXX` una vez identificados; se pregunta solo si la inferencia es ambigua | Si es claramente Sí o No, no se pregunta — se registra la conclusión y se continúa; «No» cierra la sección de wireframes sin más |
| **Tipo de solución** (web, app nativa, híbrida, escritorio) y **¿responsiva?** — solo si hay UI | Inferido de menciones explícitas, el actor y su contexto de uso; se pregunta solo si la inferencia es ambigua | Sin resolver, el SRS no puede declararse Ready si hay UI involucrada |
| **Revisión de cada wireframe** (aprobado / con cambios) | La hace `/design-define` dentro del subagente (lote completo, una sola pregunta por vuelta); este skill recibe el estado final y las observaciones con impacto en `FR-XXX` | Sin resolver (algún `WF-XXX` devuelto `Proposed`), el SRS no puede declararse Ready si hay UI involucrada |
| **Verificación y trazabilidad** (origen, dependencias, estado del requisito) | Por cada `FR-XXX`/`NFR-XXX`, una vez cerrados | Sin resolver, el SRS no puede declararse Ready |
| **Objetivos y métricas de éxito** (`OB-XX`) | Ola 1 con el PO: resultado de negocio y cómo se medirá; una métrica proxy es válida si se marca como tal | Sin al menos un `OB-XX`, un PRD no puede declararse Ready; en un SRS creado directamente se recomienda |
| **Escenarios de uso** (`SC-XX`) por actor | Ola 1 con el PO (y UX): qué intenta lograr cada actor y cómo se ve el éxito | Sin ellos, un PRD no puede declararse Ready |
| **Criterios de aceptación** (`AC-XXX`) de cada requisito | Levantados con el rol dueño («¿cómo sabrás que quedó cumplido?»), id secuencial global, inmutables | Sin al menos un `AC-XXX` por `FR-XXX`/`NFR-XXX`, ni PRD ni SRS pueden declararse Ready |
| **Método de verificación** de cada `AC-XXX` *(solo SRS)* | Propuesto por lote (ver [Métodos de verificación](references/quality-criteria.md#métodos-de-verificación)), confirmado en una sola pregunta; criterio redactado en términos verificables (ver [Verificabilidad](references/quality-criteria.md#verificabilidad)) | Sin método o criterio, el SRS no puede declararse Ready |
| **Riesgos** (probabilidad, impacto, mitigación) | Propuestos por lote a partir de lo ya cerrado, confirmados en una sola pregunta | Dato informativo; no bloquea `status: Ready` salvo que el usuario lo trate como laguna abierta |
| **Modo de resolución del stack** (investigar vs. ya decidido) *(solo SRS)* | Pregunta estructurada, una vez cerrado lo funcional, la UI, la verificación y los riesgos | No aplica — se pregunta siempre en ese momento, salvo que ya se haya adelantado por la excepción de duda funcional |
| **Stack tecnológico resuelto** *(solo SRS)* | Investigación delegada a `/work-research` (dominio Técnica) si el usuario pidió investigar, o respuesta directa si ya lo tiene decidido | Sin resolver, el SRS queda en Draft |
| **Repositorios git** de la implementación *(solo SRS)* | Indicados por el usuario, o candidatos inferidos de submódulos/repos anidados del workspace | Sin ellos el SRS no puede declararse Ready |
| **¿Nuevo o existente?**, por cada repositorio *(solo SRS)* | Pregunta estructurada explícita por cada repositorio identificado — nunca inferida del nombre | Sin resolver, el SRS no puede declararse Ready |
| **Proyecto base** (starter, scaffold, boilerplate) — solo si el repositorio es nuevo *(solo SRS)* | Preguntado por cada repositorio nuevo; «No aplica» si el repositorio es existente | Preguntar; «ninguno, desde cero» es una respuesta válida para un repositorio nuevo |

> El único dato estrictamente obligatorio para crear el documento es tener identificado el alcance funcional del requerimiento. Si algo no es completamente resoluble con la información disponible, el SRS se crea con `status: Draft` y las lagunas documentadas en Observaciones. El estado **Ready** requiere todos los datos sin excepción.
>
> **Excepción de orden:** si una fila funcional (`FR-XXX`/`NFR-XXX`) no se puede cerrar sin una decisión técnica puntual, esa decisión se resuelve en ese momento — no se espera a llegar a las filas de Stack/Repositorios.

---

## Flujo (resumen)

El procedimiento completo —el Paso 0 de tipo de documento, cómo preguntar al usuario, la pregunta inicial sobre el stack y su delegación a `/work-research`, la vuelta por repositorios (nuevo o existente) y proyecto base, el cierre de lagunas por tandas, los pasos de **Crear**, **Actualizar** y **Promover**, el checklist y los ejemplos/anti-patrones— está en [`references/flow.md`](references/flow.md). Síntesis:

- **Paso 0 — tipo de documento:** leer el insumo (imágenes incluidas) → componer el parte de señales (insumo, **dueño de la definición**, stack, `implementation.scope` del harness, recomendación) → aplicar las reglas: modificador o tipo ya dicho → sin pregunta; `scope: tests` + documento de un tercero → **RQ sin preguntar**; handoff de `test-define` o «solo pruebas» → recomendar RQ; producto nuevo sin stack o negocio debe aprobar antes → recomendar PRD; stack decidido / sistema existente y este equipo implementa → recomendar SRS → **una pregunta estructurada**: «¿Qué documento generamos a partir de este requerimiento?» con la recomendada primera y «(Recomendado)», y las otras dos en orden fijo PRD → SRS; etiquetas ≤5 palabras: *RQ — solo certificar* / *PRD — aprobar producto* / *SRS — especificar para implementar* → advertencia de una línea si la elección va contra la señal (sin segunda pregunta).
- **Crear un RQ (requerimiento externo):** ID `RQ-XXX` (número del secuencial único) → documento fuente íntegro en `references/` y leído → encabezado (dueño de la definición, documento fuente con versión, work item del dueño) → `BR-XX` y `AC-XXX` **solo de lo que el documento dice, cada uno con su fuente** (§/ítem/HU) → **Cobertura de la fuente** ítem por ítem (`Cubierto` / `Sin criterio` / `Fuera del alcance de certificación` / `Pendiente`) → una sola confirmación del lote → `Ready` → ofrecer `/test-define RQ-XXX`. Sin entrevista de producto, sin FR/NFR, sin stack, sin Ola 3.
- **Crear un PRD o SRS (funcional primero, técnico al final):** fijar ID (secuencial único) y carpeta `PRD-XXX-[nombre-corto]/` o `SRS-XXX-[nombre-corto]/` → capturar el requerimiento en bruto y guardarlo en `references/` → cerrar lo **funcional** con la **entrevista por olas y roles** de [`references/interview.md`](references/interview.md) — Ola 1 Discovery con el PO (problema, objetivo, actores, proceso actual, resultado deseado, reglas) y Ola 2 Definition por rol (PO: `FR-XXX` y criterios; UX: experiencia; ARCH: calidad, restricciones, integraciones), cada tanda de un solo rol y en su lenguaje, integrando el agente las respuestas (alcance, actores, `FR-XXX`, `NFR-XXX`, reglas de negocio, interfaces externas, requisitos de datos, cumplimiento normativo), inferir primero si alguna capacidad transversal común (autenticación, roles, notificaciones, etc.) **ya existe o se reutiliza** en vez de crear un `FR-XXX` para ella, preguntando solo si queda duda, y al final del cierre asignar **prioridad** a cada `FR-XXX`/`NFR-XXX` por lote → si el requerimiento tiene UI propia (inferido, o preguntado solo si es ambiguo), inferir el **tipo de solución** (web, nativa, híbrida, responsiva), identificar las pantallas y **delegar los wireframes a `/design-define` mediante subagente** (genera `wireframes/WF-XXX-[pantalla-slug].md` + `.svg` en la carpeta del SRS, presenta el lote y lo revisa con el usuario con **una sola pregunta** por vuelta), registrar en la sección 11 las rutas y estados devueltos y trasladar a los `FR-XXX` afectados las observaciones reportadas → completar **verificación y trazabilidad** de cada requisito (origen, dependencias, estado) y asignar **método y criterio de verificación** por lote → identificar **riesgos** y presentarlos como lote → recién entonces resolver lo **técnico**: preguntar si se investiga el stack o ya está decidido, resolverlo (delegando a `/work-research` mediante subagente, o registrando la decisión directa del usuario), identificar repositorios y, por cada uno, si es **nuevo o existente** y, si es nuevo, si hay proyecto base → redactar el `README.md` con la plantilla y el prefijo en el título (Introducción con `OB-XX`, Descripción general con `SC-XX`, Stack tecnológico, Repositorios, `FR-XXX`, `NFR-XXX`, Reglas de negocio, Interfaces externas, Requisitos de datos, Cumplimiento normativo, Diseño de interfaz, Verificación y trazabilidad con `AC-XXX`, Riesgos, Enlaces y archivos de apoyo, Observaciones). **En un PRD** se omiten los pasos de stack/repositorios/proyecto base y el bloque ARCH de la entrevista; las secciones correspondientes y el método de verificación quedan «Pendiente — se completa al promover a SRS», los `NFR-XXX` son cualitativos y la Ola 3 corre con PO+UX → **Ola 3 Validation** sobre el documento redactado: análisis de gaps, revisión cruzada PO+UX+ARCH y **validación con un subagente sin el contexto de la sesión** (solo lee la carpeta del SRS) que confirme que basta para implementar sin repreguntar — hallazgos a tandas por rol u Observaciones → glosario si aplica → cierre. **Excepción:** si una laguna funcional no se puede cerrar sin una decisión técnica puntual, esa pieza se adelanta y se pregunta dentro de la misma tanda funcional, sin esperar al bloque técnico.
- **Promover un PRD a SRS:** solo desde un PRD `Ready` → correr únicamente el bloque ARCH (cuantificar `NFR-XXX` con el mismo id, interfaces 8.2-8.4, entidades de datos, cómo se cumple la normativa, método de verificación por `AC-XXX`, riesgos técnicos) y los pasos de stack/repositorios/proyecto base → `git mv PRD-XXX-… SRS-XXX-…` (mismo número) con reparación de enlaces (US derivadas, TC, índices), fecha y origen en `promoted_at` / `promoted_from` → Ola 3 completa → DoR del SRS → avisar si ya había US derivadas afectadas.
- **Actualizar:** identificar y leer el `README.md` → aplicar cambios conservando **siempre** los ids `FR-XXX`/`NFR-XXX`/`BR-XX`/`AC-XXX`/`OB-XX`/`SC-XX` existentes (son inmutables: los nuevos toman el siguiente libre) → revalidar → confirmar. Un RQ se actualiza por **versión nueva del documento fuente** (archivo nuevo en `references/`, fila en el historial, diff de AC, Cobertura actualizada, aviso de qué TC revisar).
- **Cierre:** si queda **Draft**, cerrar lagunas con preguntas estructuradas (tandas de hasta 3, encadenando tantas como haga falta). Si queda **Ready**, según el tipo: **RQ** → `/test-define RQ-XXX`; **PRD** → `/work-define`, `/test-define PRD-XXX` o promover a SRS (nunca `/work-plan` ni `/arch-init`); **SRS** → `/work-define` y `/test-define SRS-XXX`, más `/arch-init` como opción adicional si algún repositorio de la sección 4 no tiene el harness (`AGENTS.md`/`.sdd-devkit/settings.json`). Nunca crear la US ni los TC desde este skill.

Las modalidades **RFC 2119** y las categorías de **FR-XXX**/**NFR-XXX** detalladas están en [`references/quality-criteria.md`](references/quality-criteria.md).

---

## Criterios para `status: Ready` (resumen)

Declarar **Ready** solo si se cumplen todos los del tipo; el detalle está en [`references/quality-criteria.md`](references/quality-criteria.md) ([DoR del SRS](references/quality-criteria.md#definition-of-ready-dor-del-srs) · [DoR del PRD](references/quality-criteria.md#definition-of-ready-dor-del-prd) · [DoR del RQ](references/quality-criteria.md#definition-of-ready-dor-del-rq)).

**RQ:** encabezado completo (dueño, documento fuente con versión, work item del dueño), todos los `AC-XXX` confirmados con fuente, cada `BR-XX` verificada por un AC, Cobertura de la fuente sin `Pendiente`.

**PRD:** los criterios de abajo **salvo** los marcados *(solo SRS)*, más: al menos un `OB-XX` con métrica (directa o proxy), cada actor con un `SC-XX`, `NFR-XXX` cualitativos revisados, interfaces solo de usuario, datos solo como obligaciones, normativa solo «qué aplica», método de verificación `Pendiente`, y la primera línea de Observaciones enumerando qué falta para promover (no cuenta como pendiente).

**SRS:**

- **Stack tecnológico** resuelto *(solo SRS)*: investigado (con `RS-XXX` enlazado) o decidido explícitamente por el usuario, sin alternativas abiertas.
- **Repositorios** identificados *(solo SRS)* y, por cada uno, su **tipo** resuelto (nuevo o existente) y el **proyecto base** resuelto cuando aplica (uno concreto, «desde cero» si es nuevo, o «No aplica» si es existente).
- Sección **Requisitos funcionales** completa: al menos un `FR-XXX` con categoría, prioridad, estado y enunciado RFC 2119 en MAYÚSCULAS.
- **Requisitos no funcionales** revisados, priorizados y **con umbral** (con entradas o «No aplica» justificado).
- **Interfaces externas** revisadas (usuario, hardware, software, comunicaciones); «No aplica» si no corresponde.
- **Requisitos de datos** formalizados si el requerimiento maneja datos.
- **Cumplimiento normativo** trazado si el dominio lo exige, con el cómo; «No aplica» si no corresponde.
- **Diseño de interfaz**: si el requerimiento tiene UI propia, el **tipo de solución** (web, nativa, híbrida, escritorio) y si debe ser **responsiva** están definidos, y cada pantalla tiene su wireframe revisado por el usuario (aprobado, o con los cambios ya trasladados al SRS); «No aplica» si no hay UI.
- **Verificación y trazabilidad** completa: todo `FR-XXX`/`NFR-XXX` con al menos un `AC-XXX`, y todo `AC-XXX` con método de verificación *(solo SRS)* y criterio redactado en términos comprobables.
- **Riesgos** identificados, con probabilidad, impacto y mitigación.
- **Alcance y fuera de alcance** declarados sin ambigüedad.
- **Observaciones** sin aclaraciones ni decisiones pendientes abiertas.
- **Ola 3 superada**: gaps y revisión cruzada resueltos, y la validación del **subagente sin contexto** sin hallazgos pendientes (ver [`references/interview.md`](references/interview.md)).

Si falta cualquiera, mantener `status: Draft` con las lagunas documentadas en Observaciones.

---

## Mensaje al usuario

Solo resultados y lo que el usuario debe saber o decidir. No incluir razonamiento interno ni narración del trabajo en curso («leí el requerimiento», «creé el archivo»). El **parte de señales del Paso 0** sí se muestra (3-5 líneas) porque es la información con la que el usuario elige el tipo; cuando el tipo se fija por regla, una línea dice cuál y por qué. Si hay pendientes, listarlos agrupados por sección (Stack, Repositorios, `FR-XXX`, `NFR-XXX`, `AC-XXX`, Interfaces externas, Requisitos de datos, Cumplimiento normativo, Wireframes, Verificación y trazabilidad, Riesgos; en un RQ: `AC-XXX` sin confirmar y filas `Pendiente` de la Cobertura de la fuente). En un PRD Ready, decir explícitamente que es un PRD y qué falta para promoverlo. Los wireframes se generan todos (SVG enlazado, no pegado como código) antes de mostrarlos, y se presentan **juntos, en un solo mensaje**: `WF-XXX` y nombre de cada pantalla con el enlace a su documento (`wireframes/WF-XXX-[pantalla-slug].md` en la carpeta del SRS) y a su SVG (`…/WF-XXX-[pantalla-slug].svg`) para revisarla con facilidad — nunca uno por turno. La prioridad, el método de verificación y los riesgos también se proponen como lote y se confirman en una sola pregunta cada uno — nunca requisito por requisito. Al llegar a Ready, ofrecer explícitamente el siguiente paso según el tipo — **RQ:** `/test-define RQ-XXX`; **PRD:** `/work-define`, `/test-define PRD-XXX` o promover a SRS; **SRS:** `/work-define` y `/test-define SRS-XXX` — nunca crear la historia de usuario ni los casos de prueba desde aquí. Si es un SRS y algún repositorio de la sección 4 todavía no tiene el harness (`AGENTS.md`/`.sdd-devkit/settings.json`), agregar `/arch-init` como opción adicional en esa misma pregunta.
