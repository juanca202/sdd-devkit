# Criterios de calidad: RFC 2119 / categorías / prioridad / verificación / Definition of Ready

Referencia detallada para redactar y validar Especificaciones de Requisitos de Software (SRS), alineada a **ISO/IEC/IEEE 29148:2018** (proceso de especificación de requisitos de software). Las secciones del `SKILL.md` y de `references/flow.md` apuntan aquí mediante anclas (`#rfc-2119`, `#categorías-de-fr-xxx`, `#categorías-de-nfr-xxx`, `#prioridad`, `#estado-por-requisito`, `#métodos-de-verificación`, `#verificabilidad`, `#definition-of-ready-dor-del-srs`).

---

## RFC 2119

Mismo vocabulario normativo que usa `work-define` para sus `AC-XXX` — no se duplica aquí. Ver la tabla completa en [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../../references/requirement-criteria.md) (RFC 2119).

Aplica igual a `FR-XXX`, `NFR-XXX` y `BR-XX`: elegir una forma por nivel y mantenerla consistente en todo el SRS. Un enunciado que no admite una palabra clave RFC 2119 clara suele ser un síntoma de que todavía no es **verificable** — ver [Verificabilidad](#verificabilidad).

---

## Categorías de FR-XXX

Cada **FR-XXX** declara su categoría. Son las mismas siete categorías funcionales que usa `work-define` para sus `AC-XXX` — ver [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../../references/requirement-criteria.md) (Categorías funcionales):

Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema

Usar la categoría de **primer nivel** que mejor encaje. Un `FR-XXX` no tiene por qué mapear 1:1 a un futuro `AC-XXX`: al descomponerse en `work-define`, un `FR-XXX` amplio puede dar lugar a varios criterios de aceptación en una o más historias, y varios `FR-XXX` relacionados pueden terminar en la misma historia. La tabla **Historias de usuario derivadas** del SRS registra esa relación después del handoff, no antes.

---

## Categorías de NFR-XXX

Cada **NFR-XXX** usa las características **ISO/IEC 25010** — mismo catálogo que las categorías no funcionales de `AC-XXX` en `work-define`, ver [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../../references/requirement-criteria.md) (Categorías no funcionales):

Idoneidad funcional · Eficiencia de rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad · Portabilidad

«No aplica» es una respuesta válida para una característica si se justifica brevemente por qué no es relevante para este requerimiento — no dejarla en blanco sin nota.

**Disponibilidad** no es una categoría aparte: ISO/IEC 25010 la trata como subcaracterística de **Fiabilidad** — un `NFR-XXX` sobre tiempo de actividad, recuperación o tolerancia a fallos va bajo esa categoría.

**Seguridad no se dispersa.** Cualquier requisito de seguridad —autenticación, autorización, cifrado, protección de datos, auditoría de accesos— se redacta como `NFR-XXX` de categoría **Seguridad**, aunque haya salido de una conversación sobre restricciones (sección 2.3), interfaces (sección 8) o cumplimiento normativo (sección 10). Esas otras secciones pueden **mencionar** que existe una implicación de seguridad y enlazar el `NFR-XXX` correspondiente, pero el enunciado verificable vive en uno solo lugar.

---

## Prioridad

Cada `FR-XXX` y `NFR-XXX` lleva una prioridad, en la misma tabla que su enunciado. Cuatro niveles:

| Prioridad | Significado | Equivalente MoSCoW |
| ---------- | ------------- | --------------------- |
| **Esencial** | Sin este requisito, el requerimiento no cumple su propósito — bloquea el release. | Must have |
| **Alta** | Se espera en esta versión; su ausencia degrada seriamente el valor entregado. | Should have |
| **Media** | Aporta valor pero es negociable dentro del alcance de esta versión. | Could have |
| **Baja** | Deferible sin afectar el objetivo de esta versión — candidato a la sección **2.6 Requisitos diferidos a futuras versiones**. | Won't have (por ahora) |

**Cómo se asigna:** no se pregunta requisito por requisito. Una vez cerrados todos los `FR-XXX`/`NFR-XXX` de una tanda, se presenta la lista completa y se pide clasificarlos en un solo paso (p. ej. selección múltiple de cuáles son `Esencial`) — mismo mecanismo de lote que la revisión de wireframes. Por defecto, sin indicación del usuario, un requisito nuevo se registra como **Alta** hasta que se reclasifique.

---

## Estado por requisito

Distinto del `Estado: Draft/Ready` del documento completo (ver [Definition of Ready (DoR) del SRS](#definition-of-ready-dor-del-srs)). Cada `FR-XXX`/`NFR-XXX` lleva su propio estado:

| Valor | Cuándo aplica |
| ------ | -------------- |
| **Propuesto** | El agente lo redactó a partir de una inferencia o un valor por defecto que el usuario todavía no confirmó explícitamente. |
| **Aprobado** | El usuario confirmó el enunciado — al responder la pregunta que lo originó, ya lo está aprobando; no hace falta una confirmación aparte. |

Un SRS puede llegar a `status: Ready` con requisitos en `Proposed` **solo si** esa laguna quedó documentada y aceptada en Observaciones; en general, `Ready` implica que todos los `FR-XXX`/`NFR-XXX` relevantes están `Approved`.

---

## Métodos de verificación

Los cuatro métodos canónicos de ISO/IEC/IEEE 29148 para declarar cómo se comprobará que un requisito se cumplió. Van en la sección **13. Verificación y trazabilidad** del SRS, una fila por `FR-XXX`/`NFR-XXX`:

| Método | Cuándo usarlo | Heurística de inferencia |
| ------- | -------------- | --------------------------- |
| **Inspección** | Se comprueba revisando el artefacto (documento, pantalla, configuración) sin ejecutarlo. | Requisitos sobre formato, contenido de un documento/reporte, o presencia de un elemento. |
| **Análisis** | Se comprueba con cálculo, modelado o revisión técnica, sin necesidad de ejecutar el sistema completo. | Requisitos de capacidad, arquitectura o restricciones de diseño que se validan por razonamiento o simulación. |
| **Demostración** | Se comprueba mostrando el comportamiento en un entorno controlado, sin instrumentación rigurosa. | Flujos de usuario visibles, integraciones que se muestran funcionando end-to-end sin medir con precisión. |
| **Prueba** | Se comprueba ejecutando un caso de prueba con resultado medible y reproducible. | La mayoría de los `FR-XXX` de comportamiento observable y los `NFR-XXX` de rendimiento/fiabilidad con un umbral numérico. Es el método que más tarde formaliza `test-define` en `TC-XXX`. |

**Cómo se asigna:** igual que la inferencia de UI (ver `flow.md`, paso 4) — el agente **propone** el método según la naturaleza del requisito, presenta la tabla completa a la vez y pregunta **una sola vez** si algo necesita ajustarse, en vez de preguntar método por método.

**Criterio de verificación:** además del método, cada fila declara la condición observable que demuestra el cumplimiento (p. ej. «se sube una factura válida y aparece en el listado en menos de 2 s»). Un requisito al que no se le puede escribir un criterio de verificación concreto no está listo — es la señal de [verificabilidad](#verificabilidad) insuficiente y debe volver a la sección 5/7 para precisarse antes de continuar.

---

## Verificabilidad

Un requisito es verificable cuando puede escribirse una condición objetiva que confirme si se cumplió o no — el mismo criterio que exige ISO/IEC/IEEE 29148 para toda especificación. Señales de que un `FR-XXX`/`NFR-XXX` **no** es verificable todavía:

- Usa adjetivos sin umbral («rápido», «fácil de usar», «seguro») en vez de una condición medible o observable.
- No admite una palabra clave RFC 2119 sin ambigüedad (si hace falta «y/o» para describirlo, probablemente son dos requisitos).
- No se le puede asignar ninguno de los cuatro [métodos de verificación](#métodos-de-verificación) con un criterio concreto.

Si aparece cualquiera de estas señales al redactar la sección 12, no forzar un método: volver a la tanda de preguntas del paso 3 y precisar el enunciado antes de continuar.

---

## Modo de resolución del stack tecnológico

La marca oculta `srs:stack-mode` (ver `assets/srs-template.md`) refleja cómo se resolvió la sección **Stack tecnológico**, y condiciona qué contenido lleva esa sección:

| Valor | Cuándo aplica | Qué debe contener la sección |
| ----- | -------------- | ------------------------------ |
| `researched` | El usuario eligió investigar en la pregunta inicial del flujo | Enlace al `RS-XXX` producido por `/work-research` (vía subagente) + resumen de la recomendación (opción y razón principal), sin duplicar el detalle completo del informe |
| `decided` | El usuario ya tenía el stack decidido | Tabla de decisiones por capa (frontend, backend, base de datos, infraestructura…), con justificación solo si el usuario la dio |

Ambos modos pueden dejar **Decisiones pendientes** si alguna capa queda sin resolver — eso no cambia el modo, solo mantiene el SRS en Draft hasta cerrarse.

---

## Tipos de documento: RQ, PRD y SRS

Este skill produce tres documentos. La elección se hace al inicio (ver [`flow.md` — Paso 0](flow.md#paso-0--tipo-de-documento)) y determina qué secciones, qué roles de la entrevista y qué DoR aplican.

| | `RQ-XXX` — requerimiento externo | `PRD-XXX` — documento de producto | `SRS-XXX` — especificación de requisitos |
|---|---|---|---|
| **Pregunta que responde** | ¿Qué se certifica de lo que otro definió? | ¿Por qué, para quién y qué resultado? | ¿Qué debe hacer el sistema exactamente, con qué calidad, dónde y cómo se verifica? |
| **Dueño de la definición** | Un tercero (cliente, otro proveedor, documento ya aprobado) | Este equipo con negocio | Este equipo con negocio e ingeniería |
| **Lector** | QA y el dueño del documento | Negocio: cliente, PO, sponsor | Equipo de implementación y agentes |
| **Roles de la entrevista** | Ninguno (no hay entrevista de producto): solo confirmación de `AC-XXX` y de la Cobertura de la fuente | PO + UX (Olas 1-3 sin el bloque ARCH) | PO + UX + ARCH |
| **Contiene** | Resumen, historial del documento fuente, `BR-XX`, `AC-XXX` con fuente, Cobertura de la fuente | Problema, objetivos y métricas (`OB-XX`), actores y escenarios (`SC-XX`), alcance, `FR-XXX` priorizados, `BR-XX`, `NFR-XXX` cualitativos, interfaz de usuario y wireframes, obligaciones de datos y normativa, `AC-XXX` de negocio, riesgos de producto, fases | Todo lo del PRD más: stack, repositorios, `NFR-XXX` con umbral, interfaces hw/sw/comunicaciones, entidades de datos, cómo se cumple la normativa, método de verificación por `AC-XXX`, riesgos técnicos |
| **`Ready` significa** | El dueño de la definición puede firmar qué se certifica | Negocio aprobó alcance, prioridades y criterios | Se puede implementar sin repreguntar |
| **Consumidores** | `test-define` → `TC-XXX` | `work-define` → `US-XXX` · `test-define` → `TC-XXX` de aceptación · promoción a SRS | `work-define` · `work-plan` · `arch-init` · `design-define` · `test-define` |
| **Plantilla** | [`assets/rq-template.md`](../assets/rq-template.md) | [`assets/prd-template.md`](../assets/prd-template.md) — misma numeración 1-15 que el SRS | [`assets/srs-template.md`](../assets/srs-template.md) |

**Identificadores:** los tres prefijos comparten **un único secuencial** sobre `<changesPath>/requirements/` + `<archivedPath>/requirements/` (carpetas `RQ-*`, `PRD-*` y `SRS-*` juntas): el siguiente número libre es el mayor de todos + 1, sea cual sea el tipo. **Promoción PRD → SRS:** mismo número, mismos `FR-XXX`/`NFR-XXX`/`BR-XX`/`AC-XXX` (inmutables; los nuevos toman el siguiente libre); la carpeta `PRD-XXX-slug` se renombra a `SRS-XXX-slug` (`git mv`), el documento pasa a la estructura de `srs-template.md` (misma numeración, así que es completar secciones, no reescribirlas) y se reparan los enlaces entrantes. Se completan solo las secciones marcadas «Pendiente — se completa al promover a SRS», se registra la fecha y el origen en `promoted_at` / `promoted_from` del frontmatter y se repite la Ola 3 con el rol ARCH. **No existe promoción RQ → PRD/SRS:** si el caso cambia y se va a implementar, se crea el PRD/SRS desde el mismo insumo, se enlaza el RQ en `references/` y se archiva el RQ cuando el usuario lo decida.

## Definition of Ready (DoR) del PRD

Un `PRD-XXX` es **Ready** cuando cumple la tabla DoR de `prd-template.md`; las secciones «solo SRS» quedan «Pendiente — se completa al promover a SRS» y no bloquean. En concreto:

- **Objetivos y métricas** (1.4): al menos un `OB-XX` con métrica directa o proxy declarada.
- **Actores y escenarios** (2.4): cada actor con al menos un `SC-XX`.
- **`FR-XXX`** completos, priorizados y `Approved`; **`NFR-XXX`** cualitativos revisados (sin umbral es válido en PRD).
- **Interfaz de usuario** (8.1) y **wireframes** (11) igual que en un SRS: si hay UI, tipo de solución y pantallas aprobadas.
- **Obligaciones de datos** (9) y **normativa aplicable** (10) identificadas, sin el «cómo».
- **`AC-XXX`** (12): todo `FR-XXX`/`NFR-XXX` con al menos un criterio de aceptación verificable en términos de negocio; método de verificación `Pendiente`.
- **Riesgos de producto**, **alcance** y **Ola 3 con PO+UX** igual que en un SRS.
- **Problema y evidencia** (1.1) descritos, y **aprobación de negocio** registrada en el frontmatter (quién y cuándo).
- **Observaciones:** solo la línea «Para promover a SRS falta» — que es obligatoria y no cuenta como pendiente.

## Definition of Ready (DoR) del RQ

Un `RQ-XXX` es **Ready** cuando:

- **Encabezado** completo: dueño de la definición, documento fuente con versión y enlace a `references/`, work item del dueño si existe.
- **`AC-XXX`**: todos confirmados por el usuario, con identificador, categoría, enunciado RFC 2119 y **fuente** (fragmento del documento del dueño).
- **`BR-XX`**: cada una verificada por al menos un `AC-XXX`.
- **Cobertura de la fuente**: sin filas en `Pendiente`; cada ítem del documento fuente es `Cubierto`, `Sin criterio (no verificable)` con motivo, o `Fuera del alcance de certificación` con motivo.
- **Historial del documento fuente** con la versión vigente registrada.

El RQ no tiene Ola 3 ni validación con subagente: su contrato es la Cobertura de la fuente, que firma el dueño de la definición.

## Definition of Ready (DoR) del SRS

Tabla con los criterios de la plantilla (columna «Aplica a» = SRS). Para cada uno: `Met` / `Not Met` / `Partial` (los criterios marcados abajo admiten además `N/A`, en las condiciones que se indican).

| Criterio DoR | Qué exige |
| ------------ | --------- |
| Stack tecnológico resuelto | `srs:stack-mode` fijado y sin decisiones pendientes: investigado con `RS-XXX` enlazado, o decidido explícitamente por el usuario en todas las capas relevantes. |
| Repositorios y proyecto base definidos | Al menos un repositorio identificado; cada uno con su **tipo** resuelto (`Nuevo` / `Existente (con cambios)`) y su proyecto base resuelto cuando aplica (uno concreto o «desde cero» si es nuevo; «No aplica» si es existente). |
| Requisitos funcionales completos y priorizados | Al menos un `FR-XXX` con categoría, prioridad, estado `Approved` y enunciado RFC 2119; cubren el alcance descrito en la Introducción sin huecos evidentes. |
| Requisitos no funcionales revisados y priorizados (`N/A` si ninguna característica ISO 25010 aplica, justificado) | Cada característica ISO 25010 relevante tiene un `NFR-XXX` con prioridad y estado, o quedó marcada «No aplica» con justificación — cubre explícitamente Seguridad, Rendimiento (Eficiencia de rendimiento), Fiabilidad y su subcaracterística Disponibilidad. |
| Interfaces externas revisadas (`N/A` por subsección si esa interfaz no existe) | Las cuatro subsecciones (usuario, hardware, software, comunicaciones) fueron consideradas; las que no aplican lo declaran explícitamente en vez de omitirse en silencio. |
| Requisitos de datos formalizados (`N/A` si el requerimiento no maneja datos propios) | Las entidades de datos relevantes están identificadas con retención/privacidad y volumen, o la sección se marcó «No aplica». |
| Cumplimiento normativo trazado (`N/A` si no hay normativa identificada) | Cada normativa aplicable enlaza al `FR-XXX`/`NFR-XXX` que la satisface; ninguna fila queda sin ese enlace. |
| Diseño de interfaz revisado (`N/A` si `srs:ui-required=false`) | Si `srs:ui-required=true`: el **tipo de solución** y si debe ser **responsiva** están definidos, y cada fila de la tabla de pantallas está en `Approved`, con sus observaciones ya reflejadas en los `FR-XXX` afectados. Ninguna pantalla puede quedar `Proposed` sin resolver. |
| Objetivos y métricas de éxito definidos (solo si nació como PRD) | Al menos un `OB-XX` con métrica directa o proxy. Un SRS creado directamente como SRS puede dejarlos «No definidos», pero se recomienda completarlos. |
| Criterios de aceptación (`AC-XXX`) completos | Todo `FR-XXX`/`NFR-XXX` tiene al menos un `AC-XXX` en la sección 12 con origen y criterio concreto — ver [Verificabilidad](#verificabilidad). Los ids son inmutables. |
| Método de verificación asignado | Todo `AC-XXX` de la sección 12 tiene método (`Inspección` / `Análisis` / `Demostración` / `Prueba`); ninguno queda `Pendiente`. |
| Riesgos identificados | La sección 13 existe con al menos una fila, o se dejó explícitamente «Ninguno identificado» — no se omite sin más. |
| Alcance y fuera de alcance claros | La sección 1.2 delimita qué cubre el requerimiento y qué queda explícitamente fuera. |
| Sin aclaraciones pendientes | Observaciones vacías o «Ninguna»; nada pendiente con usuario/producto. |
| Validación final (Ola 3) superada | El análisis de gaps, la revisión cruzada PO+UX+ARCH y la **validación con subagente sin contexto de sesión** (ver [`interview.md`](interview.md#ola-3-en-detalle-paso-11-de-flowmd)) se ejecutaron sobre el documento redactado, sin hallazgos pendientes: lo no resuelto vive en Observaciones y bloquea Ready vía el criterio anterior. |

El estado **Ready** de un SRS requiere todos los criterios sin excepción (los marcados `N/A` cuentan como satisfechos cuando la condición de exclusión aplica y está declarada). Si falta cualquiera, el SRS permanece en `status: Draft` con las lagunas documentadas en Observaciones — nunca se declara Ready «con reservas».
