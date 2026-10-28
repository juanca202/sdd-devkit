---
id: SRS-XXX
type: srs
status: Draft                         # Draft | Ready
created: YYYY-MM-DD
updated: YYYY-MM-DD
promoted_from: PRD-XXX                # solo si nació como PRD (mismo número) y se completó el bloque de ingeniería; omitir si no
promoted_at: YYYY-MM-DD               # fecha de la promoción; omitir junto con promoted_from
---
<!--
Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. Las claves marcadas «omitir» se
quitan enteras cuando no aplican. No repetir ningún campo del frontmatter como línea `**Campo:**` bajo el título.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.
Estructura alineada a ISO/IEC/IEEE 29148:2018 (outline de Software Requirements Specification), con las
secciones propias del harness (Stack tecnológico, Repositorios, Diseño de interfaz)
insertadas donde corresponde al flujo de este skill. Ver references/flow.md para el procedimiento
completo y references/quality-criteria.md para los criterios normativos de cada campo.

Este es el README.md de un SRS-XXX: responde «qué debe hacer el sistema exactamente, con qué calidad,
dónde y cómo se verifica». Su número sale del secuencial ÚNICO de requirements/ (compartido con RQ-XXX
y PRD-XXX). Un SRS puede nacer directamente, o por PROMOCIÓN de un PRD-XXX (prd-template.md, misma
numeración de secciones): en ese caso la carpeta se renombra con el MISMO número, los ids
FR/NFR/BR/AC/OB/SC se conservan y solo se completa el bloque de ingeniería (3, 4, 6 con umbral,
8.2-8.4, 9 entidades, 10 «cómo», método de verificación en 12, riesgos técnicos en 13).
-->

# SRS-XXX: {{título corto del requerimiento}}

## 1. Introducción

### 1.1 Propósito

{{qué problema resuelve este requerimiento y para quién; una a tres frases}}

### 1.2 Alcance del producto

{{qué cubre este requerimiento: producto o módulo afectado, límites del sistema}}

**Fuera de alcance:**

- {{funcionalidad, caso o decisión que queda explícitamente fuera; indicar dónde se aborda si aplica}}

### 1.3 Definiciones, acrónimos y abreviaturas

<!-- Sección opcional. Términos ambiguos o específicos del dominio van al glosario compartido; enlazarlo aquí en vez de redefinir. Eliminar si no aplica. -->
- **Glosario:** {{enlace a `docs/glossary.md`, si existe}}
- {{término o acrónimo}}: {{definición breve, solo si no está en el glosario}}

### 1.4 Objetivos y métricas de éxito

<!--
Obligatoria si el SRS nació como PRD (se hereda); recomendada si se creó directamente como SRS.
2-4 objetivos de negocio. Cada uno con una métrica medible y, si el negocio la tiene, un valor objetivo;
si no la tiene, una métrica proxy («reducir el tiempo del proceso X») es válida y se marca como tal.
-->
| ID | Objetivo de negocio | Métrica | Valor objetivo | Plazo |
| -- | ------------------- | ------- | -------------- | ----- |
| OB-01 | {{resultado que el negocio espera}} | {{cómo se mide; «proxy» si no hay medición directa}} | {{valor, o «Por definir (proxy)»}} | {{fecha / versión}} |

### 1.5 Referencias

<!--
Documentos o estándares EXTERNOS a los que este SRS remite (guías de estilo, contratos, normativa,
otras especificaciones) — no confundir con la sección 14 (Enlaces y archivos de apoyo), que enlaza los
archivos propios de esta carpeta (requerimiento original, investigación) y los wireframes de este SRS.
Sección opcional. Eliminar si no aplica.
-->
- {{título del documento/estándar}}: {{versión, fecha, enlace o ubicación}}

## 2. Descripción general del producto

<!-- Esta sección da contexto; no declara requisitos verificables — esos van en las secciones 6 en adelante. -->

### 2.1 Perspectiva del producto

{{contexto del sistema o producto en el que se inserta este requerimiento; sistemas con los que convive; si es parte de un sistema mayor, relación con ese sistema}}

### 2.2 Funciones del producto

{{resumen de alto nivel de lo que el requerimiento habilita, en 3-6 líneas; el detalle verificable va en Requisitos funcionales}}

### 2.3 Restricciones del producto

<!-- Sección opcional. Restricciones de negocio, de interfaces, de plataforma, de plazo o de cumplimiento normativo que limitan las opciones de implementación. Las restricciones normativas se detallan en la sección 10 (Cumplimiento normativo); aquí solo se nombran. Eliminar si no aplica. -->

- {{restricción; p. ej. presupuesto, fecha límite, compatibilidad con sistema legado, normativa aplicable (ver sección 10)}}

### 2.4 Características de los usuarios y escenarios de uso

- {{tipo de actor/usuario}}: {{rol, nivel técnico, frecuencia de uso — lo relevante para decisiones de diseño}}

<!--
Escenarios clave narrativos (qué intenta lograr cada actor, en qué contexto y cómo se ve el éxito) —
NO son historias de usuario ni AC. Se heredan del PRD si lo hubo; opcionales si ya existen US derivadas.
-->
| ID | Actor | Escenario | Resultado esperado | FR-XXX relacionados |
| -- | ----- | --------- | ------------------ | ------------------- |
| SC-01 | {{actor}} | {{situación y lo que hace, en 1-3 frases}} | {{cómo sabe el actor que lo logró}} | {{FR-XXX, …}} |

### 2.5 Supuestos y dependencias

<!-- Sección opcional. Eliminar si no aplica. -->

**Funcionalidad transversal asumida como existente o provista por el proyecto base**

<!--
Sección opcional — incluir solo si el requerimiento depende de capacidades comunes a la mayoría de
aplicativos (autenticación, control de roles/permisos, notificaciones, auditoría/logging, procesamiento
de pagos, almacenamiento de archivos, búsqueda, multi-tenancy, etc.). El agente INFIERE primero si cada
una ya existe/se reutiliza (proyecto base, servicio compartido, plataforma ya en uso) o si está en el
alcance de este SRS construirla — solo pregunta si la inferencia queda ambigua (ver flow.md, paso 3).
Una capacidad marcada "Ya existe / se reutiliza" NO tiene FR-XXX propio; una marcada "En el alcance de
este SRS" sí debe tener su FR-XXX correspondiente en la sección 5. Eliminar la tabla si no aplica.
-->
| Capacidad | Supuesto | Origen |
| --------- | -------- | ------ |
| {{p. ej. Autenticación}} | {{Ya existe / se reutiliza — no está en el alcance de este SRS | Está en el alcance de este SRS}} | {{proyecto base / servicio compartido / plataforma ya en uso / se construye en este requerimiento}} |

- {{otro supuesto asumido que, de no cumplirse, cambia el alcance}}
- {{dependencia con otro sistema, equipo o requerimiento}}

### 2.6 Requisitos diferidos a futuras versiones

<!-- Sección opcional. Requisitos identificados pero fuera del alcance de esta versión — normalmente los que quedaron con Prioridad "Baja" en las secciones 6-7. Eliminar si no aplica. -->
| Requisito | Motivo del diferimiento | Versión objetivo |
| --------- | ------------------------- | ------------------ |
| {{FR-XXX / NFR-XXX}} | {{por qué no entra en esta versión}} | {{si se conoce, o «Por definir»}} |

### 2.7 Fases de entrega

<!-- Sección opcional. Incluir si el negocio decidió qué va en la primera versión y qué después. -->
| Fase | Contenido (FR-XXX) | Criterio de salida | Fecha objetivo |
| ---- | ------------------ | ------------------ | -------------- |
| {{v1 / MVP}} | {{FR-001, FR-002, …}} | {{qué debe cumplirse para cerrar la fase}} | {{si se conoce}} |

## 3. Stack tecnológico

<!-- srs:stack-mode={{researched|decided}} -->
<!--
Marca oculta, igual criterio que la de Estado: claves y valores en inglés siempre. Refleja la
respuesta a la pregunta inicial del flujo (investigar vs. ya decidido).
-->
**Modo de resolución:** {{Investigado con /work-research | Definido por el usuario}}

<!-- Si el modo es "Investigado": -->
**Investigación:** {{enlace markdown a `research/RS-XXX-{slug}/README.md`}}

{{resumen de la recomendación: 3-5 líneas con la opción elegida y la razón principal; el detalle completo — alternativas evaluadas, trade-offs — vive en el RS-XXX enlazado, no se duplica aquí}}

<!-- Si el modo es "Definido por el usuario", tabla de decisiones por capa: -->
| Capa | Tecnología | Justificación |
| ---- | ---------- | -------------- |
| {{p. ej. Frontend}} | {{p. ej. React + TypeScript}} | {{por qué, si el usuario la dio; «decisión del equipo» si no se pidió justificación}} |
| {{p. ej. Backend}} | {{…}} | {{…}} |
| {{p. ej. Base de datos}} | {{…}} | {{…}} |
| {{p. ej. Infraestructura / despliegue}} | {{…}} | {{…}} |

**Decisiones pendientes:** {{vacío o «Ninguna» si el stack está completamente resuelto; de lo contrario, listar qué falta decidir}}

## 4. Repositorios e implementación

<!-- Repositorio(s) git donde se materializará el requerimiento: si cada uno es nuevo o existente, y si hay un proyecto base (starter, scaffold, boilerplate) del que partir cuando es nuevo. work-plan usa esta tabla para agrupar tareas por repositorio una vez existan las US. -->
| Repositorio | Tipo | Proyecto base | Notas |
| ----------- | ---- | -------------- | ----- |
| {{nombre del repositorio; p. ej. frontend-web, api-catalogo}} | {{Nuevo / Existente (con cambios)}} | {{si es Nuevo: enlace o nombre del starter/scaffold, o «Ninguno — desde cero». Si es Existente: «No aplica»}} | {{observaciones: rama base, convenciones a seguir, módulo o área del repo existente que se modifica}} |

## 5. Requisitos funcionales

<!--
Id secuencial FR-001, FR-002, … Cada fila indica su categoría, prioridad y el enunciado con palabra
clave RFC 2119 en MAYÚSCULAS en el idioma de preferencia.
Categorías: Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema
Detalle en ${PLUGIN_ROOT}/references/requirement-criteria.md (RFC 2119 y Categorías).
Prioridad: Esencial · Alta · Media · Baja — ver quality-criteria.md#prioridad. Estado: Proposed (inferido
por el agente, aún sin confirmación explícita) · Approved (el usuario ya lo confirmó) — ver
quality-criteria.md#estado-por-requisito.
Estos FR-XXX son de alto nivel: se descomponen en AC-XXX de una o más US al pasar por /work-define; no se
renumeran aunque una US termine cubriendo solo una parte de un FR. Su origen, dependencias y método de
verificación NO van en esta tabla — viven en la sección 12 (Verificación y trazabilidad), para no
duplicar el identificador en dos lugares con datos que se puedan desincronizar.
-->
| ID | Categoría | Prioridad | Estado | Enunciado |
| -- | --------- | --------- | ------ | --------- |
| FR-001 | {{categoría}} | {{Esencial / Alta / Media / Baja}} | {{Proposed / Approved}} | {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS; p. ej. «El sistema DEBE…»}} |
| FR-002 | {{…}} | {{…}} | {{…}} | {{…}} |

## 6. Requisitos no funcionales

<!--
Todo NFR-XXX lleva umbral o medida concreta. Si el SRS viene de un PRD, los NFR cualitativos heredados
se cuantifican aquí conservando su id; un NFR sin umbral es una laguna en un SRS.
Misma mecánica que Requisitos funcionales, id NFR-001, NFR-002, … Categorías ISO/IEC 25010, mismo
detalle que las categorías no funcionales de work-define (ver enlace arriba): Idoneidad funcional ·
Eficiencia de rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad ·
Portabilidad. «Disponibilidad» es una subcaracterística de Fiabilidad — no crear una categoría aparte.
«No aplica» es una respuesta válida si se justifica por qué esa característica no es relevante para
este requerimiento.
Consolidar aquí TODO requisito de seguridad — no dispersarlo en Restricciones (2.3) ni en Interfaces
(8): si una restricción o interfaz tiene una implicación de seguridad verificable, se redacta como
NFR-XXX (categoría Seguridad) y desde ahí se referencia, no al revés.
-->
| ID | Categoría | Prioridad | Estado | Enunciado |
| -- | --------- | --------- | ------ | --------- |
| NFR-001 | {{característica ISO 25010}} | {{Esencial / Alta / Media / Baja}} | {{Proposed / Approved}} | {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS}} |
| NFR-002 | {{…}} | {{…}} | {{…}} | {{…}} |

## 7. Reglas de negocio

<!--
Sección opcional. Incluir solo si el dominio impone restricciones, obligaciones o prohibiciones que
convenga declarar como reglas explícitas, independientes de un FR-XXX puntual. Eliminar si no aplica.
Cada regla lleva id secuencial BR-01, BR-02, … con enunciado RFC 2119 en MAYÚSCULAS.
-->
- **BR-01:** {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS}} → relacionado con {{FR-XXX}}

## 8. Interfaces externas

<!--
Desglose por tipo, por convención de ISO/IEC/IEEE 29148. Cada subsección es opcional; eliminar la que
no aplique en vez de dejarla vacía. Es existencia y propósito de la interfaz, no su contrato detallado
(endpoints, payloads, protocolos exactos) — eso lo redacta design-define (API-XXX) a nivel de US o TK.
-->

### 8.1 Interfaces de usuario

<!-- Canales de interacción humana: web, móvil, CLI, voz, kiosco, etc. Si hay UI propia, el detalle de pantallas vive en la sección 11 (Diseño de interfaz); aquí solo el canal y sus lineamientos generales. -->
- {{canal}}: {{lineamientos generales — guía de estilo a seguir, accesibilidad requerida, dispositivos soportados}}

### 8.2 Interfaces de hardware

<!-- Sección opcional. Dispositivos físicos con los que interactúa el software (sensores, impresoras, POS, lectores). «No aplica» si el requerimiento no interactúa con hardware específico. -->
- {{dispositivo}}: {{naturaleza de la interacción}}

### 8.3 Interfaces de software

<!-- Sistemas, APIs o componentes de terceros con los que se integra (nombre y versión si se conoce). A nivel de existencia — el contrato detallado lo redacta design-define. -->
- {{sistema o API externa}}: {{qué se espera de la integración, a alto nivel}}

### 8.4 Interfaces de comunicaciones

<!-- Sección opcional. Protocolos de red o formatos de mensajería (REST, GraphQL, gRPC, colas, webhooks, sockets). «No aplica» si no hay requisitos de comunicación propios más allá del stack ya elegido. -->
- {{protocolo o mecanismo}}: {{propósito, con quién se comunica}}

## 9. Requisitos de datos

<!--
Sección opcional — incluir si el requerimiento crea, modifica o retiene datos propios. Formaliza la
existencia de las entidades de datos, no su modelo detallado (campos, tipos, relaciones) — eso es
design-define (MD-XXX). «No aplica» si el requerimiento no maneja datos propios (p. ej. una integración
de solo lectura).
-->
| Entidad de datos | Descripción | Retención / privacidad | Volumen estimado |
| ------------------ | ------------ | ------------------------ | ------------------- |
| {{nombre de la entidad; p. ej. Factura, Perfil de proveedor}} | {{qué representa}} | {{cuánto tiempo se conserva; si contiene datos personales o sensibles}} | {{orden de magnitud esperado, si se conoce}} |

## 10. Cumplimiento normativo

<!--
Sección opcional — incluir si aplica alguna normativa, regulación o estándar externo (protección de
datos, facturación electrónica, accesibilidad, normativa del sector). «No aplica» si no hay normativa
identificada. Cada fila debe poder trazarse a un FR-XXX o NFR-XXX que la satisfaga — si no hay ninguno
todavía, es una laguna, no se deja la celda vacía sin más.
-->
| Normativa / estándar | Requisito relacionado | Cómo se cumple |
| ----------------------- | ------------------------ | ----------------- |
| {{nombre y, si aplica, artículo o cláusula}} | {{FR-XXX / NFR-XXX}} | {{mecanismo por el cual se satisface}} |

## 11. Diseño de interfaz (wireframes)

<!--
Sección opcional — incluir solo si el requerimiento involucra una interfaz de usuario propia. srs:ui-required
se infiere del objetivo funcional y los FR-XXX (solo se pregunta al usuario si la inferencia es ambigua) —
ver flow.md, paso 4. Eliminar la sección por completo (incluida la marca oculta) si no aplica — p. ej. un
servicio o API sin UI.
Cada fila enlaza a un wireframe generado y revisado por /design-define (vía subagente; es el dueño de la plantilla
wireframe-template.md y del lote de revisión), uno por pantalla, guardado en wireframes/WF-XXX-[pantalla-slug].md
(+ su .svg hermano) DENTRO DE LA CARPETA DE ESTE SRS — los wireframes son un recurso del SRS, nunca van en
docs/architecture/ (ver flow.md, paso 4, puntos 3-4). La ruta y el estado se copian tal cual de lo que devuelve design-define.
El SRS no se declara Ready mientras alguna pantalla siga
"Pendiente": las observaciones de la revisión deben quedar reflejadas aquí y en los FR-XXX afectados
antes de cerrar.
-->
<!-- srs:ui-required={{true|false}} -->
**¿Requiere diseño de interfaz?** {{Sí | No}}

<!--
Si es Sí, definir el tipo de solución antes de generar los wireframes (ver flow.md, paso 4): se infiere
del requerimiento (menciones de "app móvil", "sitio web", "panel", el actor y su contexto de uso, el
stack o repositorio ya conocidos) y solo se pregunta si queda ambiguo. Condiciona la navegación de los
wireframes, incluido el `viewBox` de cada SVG (retrato para móvil, ancho para web/escritorio).
-->
**Tipo de solución:** {{Aplicación web / App nativa (iOS) / App nativa (Android) / App híbrida / Aplicación de escritorio}}

**¿Debe ser responsiva (adaptable a distintos tamaños de pantalla)?** {{Sí | No | No aplica — app nativa de un solo dispositivo}}

| Pantalla | Wireframe | Estado de revisión | Observaciones ya incorporadas |
| -------- | --------- | --------------------- | -------------------------------- |
| {{nombre de la pantalla}} | {{[WF-XXX](wireframes/WF-XXX-[pantalla-slug].md)}} | {{Proposed / Approved}} | {{resumen de los cambios pedidos y en qué FR-XXX quedaron reflejados; «Ninguna» si se aprobó sin cambios}} |

## 12. Verificación y trazabilidad

<!--
Una fila por cada FR-XXX/NFR-XXX (incluidos los que salieron de la revisión de wireframes). Método de
verificación: Inspección · Análisis · Demostración · Prueba — ver quality-criteria.md#métodos-de-verificación.
El agente PROPONE el método según la naturaleza del requisito y solo pregunta si es ambiguo, mismo
mecanismo que la inferencia de UI. Origen es de dónde salió el requisito (el requerimiento en bruto por
defecto; una referencia a un archivo específico de references/ si vino de una vuelta posterior). "Depende
de" es opcional — vacío o «Ninguna» si no hay dependencia entre requisitos.
Esta tabla NO registra qué US-XXX cubre cada requisito — eso vive en la sección 15 (Historias de usuario
derivadas), que se completa después del handoff y por eso no puede ir aquí.

CRITERIOS DE ACEPTACIÓN (AC-XXX). Cada criterio lleva id secuencial AC-001, AC-002, … global en el
documento (un FR/NFR puede tener varios AC; un AC pertenece a un solo FR/NFR). Son inmutables como los
FR: los nuevos toman el siguiente libre. Dos consumidores los usan tal cual:
  - test-define: genera TC-XXX de aceptación del requerimiento sobre estos AC (TCs en test-cases/ de
    esta carpeta, padre SRS-XXX) — sin pasar por un RQ.
  - work-define: los hereda como punto de partida de los AC de cada US, trazando cada AC de la US al
    AC-XXX de origen; los TC de una US cubren solo lo específico del incremento, no repiten estos.
Si el SRS viene de un PRD, los AC-XXX se heredan con su id y aquí se les fija el método y se afina el
criterio; ningún AC puede quedar con método «Pendiente» en un SRS.
-->
| ID | AC | Origen | Depende de | Método de verificación | Criterio de aceptación / verificación |
| -- | -- | ------ | ----------- | -------------------------- | --------------------------- |
| FR-001 | AC-001 | {{`references/raw-requirement.md` u otro archivo puntual}} | {{FR-XXX / «Ninguna»}} | {{Inspección / Análisis / Demostración / Prueba}} | {{condición observable que demuestra que el requisito se cumple}} |
| FR-001 | AC-002 | {{…}} | {{…}} | {{…}} | {{segundo criterio del mismo requisito, si lo hay}} |

<!-- test-define añade bajo esta tabla la línea «Casos de prueba:» por AC al generar TCs; no editarla a mano. -->

## 13. Riesgos

<!-- Sección opcional. Riesgos identificados sobre los requisitos, supuestos o restricciones ya cerrados — no se espera a que el stack esté resuelto para abrir esta sección, pero puede ampliarse después con riesgos técnicos una vez resuelto (sección 3). Eliminar si no se identificó ninguno. -->
| ID | Riesgo | Probabilidad | Impacto | Mitigación | Relacionado con |
| -- | ------ | -------------- | ------- | ----------- | ------------------ |
| R-01 | {{descripción del riesgo}} | {{Alta / Media / Baja}} | {{Alto / Medio / Bajo}} | {{cómo se reduce o gestiona}} | {{FR-XXX / NFR-XXX / Stack / Supuesto}} |

## 14. Enlaces y archivos de apoyo

<!-- Archivos propios de esta carpeta del SRS — no confundir con la sección 1.5 (referencias a documentos o estándares externos). Solo enlaces a recursos ya almacenados; nunca pegar archivos, imágenes ni descripciones directamente aquí. -->
- **Requerimiento original:** {{enlace markdown a `references/[archivo]`, dentro de esta misma carpeta}}
- **Investigación de stack:** {{enlace a `research/RS-XXX-{slug}/README.md`, si se investigó}}
- **Wireframes:** {{[`wireframes/`](wireframes/), si el requerimiento tiene UI — el detalle por pantalla está en la sección 11}}
- {{añadir entradas adicionales o indicar «Ninguna por ahora»}}

## 15. Historias de usuario derivadas

<!-- Se completa después del handoff a /work-define, a medida que el requerimiento se descompone. Vacía al crear el SRS; si viene de un PRD, se hereda tal cual. -->
| US-XXX | Título | FR-XXX cubiertos |
| ------ | ------ | ----------------- |
| {{US-XXX}} | {{título}} | {{FR-001, FR-003, …}} |

## Observaciones

- {{decisiones pendientes de stack, repositorios o proyecto base}}
- {{lagunas funcionales o no funcionales sin cerrar}}
- {{wireframes pendientes de revisión o con cambios aún sin trasladar a los FR-XXX}}
- {{requisitos sin método de verificación asignado, o de origen no identificado}}
- {{aclaraciones pendientes del usuario o de producto}}
- {{otras notas relevantes}}

## Validación

### Definition of Ready (DoR)

<!-- Detalle de cada criterio en references/quality-criteria.md#definition-of-ready-dor-del-srs. -->
| Criterio DoR | Estado | Notas |
| ------------ | ------ | ----- |
| Stack tecnológico resuelto | {{Met / Not Met / Partial}} | {{explicación}} |
| Repositorios y proyecto base definidos | {{Met / Not Met / Partial}} | {{explicación}} |
| Objetivos y métricas de éxito definidos | {{Met / Not Met / Partial / N/A}} | {{obligatorio si nació como PRD; N/A admitido si se creó directamente como SRS}} |
| Requisitos funcionales completos y priorizados | {{Met / Not Met / Partial}} | {{explicación}} |
| Requisitos no funcionales revisados, priorizados y con umbral | {{Met / Not Met / Partial / N/A}} | {{explicación; cubre explícitamente Seguridad, Rendimiento, Fiabilidad y Disponibilidad}} |
| Interfaces externas revisadas | {{Met / Not Met / Partial / N/A}} | {{explicación; usuario, hardware, software, comunicaciones}} |
| Requisitos de datos formalizados | {{Met / Not Met / Partial / N/A}} | {{explicación}} |
| Cumplimiento normativo trazado | {{Met / Not Met / Partial / N/A}} | {{explicación}} |
| Diseño de interfaz revisado | {{Met / Not Met / Partial / N/A}} | {{explicación; No aplica si el requerimiento no tiene UI propia}} |
| Criterios de aceptación (AC-XXX) completos | {{Met / Not Met / Partial}} | {{todo FR-XXX/NFR-XXX con al menos un AC-XXX verificable y origen}} |
| Método de verificación asignado | {{Met / Not Met / Partial}} | {{todo AC-XXX con método; ninguno «Pendiente»}} |
| Riesgos identificados | {{Met / Not Met / Partial}} | {{explicación; «Ninguno» es una respuesta válida}} |
| Alcance y fuera de alcance claros | {{Met / Not Met / Partial}} | {{explicación}} |
| Sin aclaraciones pendientes | {{Met / Not Met / Partial}} | {{vacío o «Ninguna» en Observaciones; nada pendiente con usuario/producto}} |
| Validación final (Ola 3) superada | {{Met / Not Met / Partial}} | {{gaps, revisión cruzada PO+UX+ARCH y validación con subagente sin contexto ejecutadas sin hallazgos pendientes}} |
