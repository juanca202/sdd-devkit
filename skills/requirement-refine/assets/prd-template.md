<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Este es el README.md de un PRD (Product Requirements Document, PRD-XXX): el documento con el que
NEGOCIO aprueba qué se va a construir y por qué, ANTES de decidir cómo. Lo leen el cliente, el PO y el
sponsor; su lenguaje es de problema, resultado y comportamiento observable, nunca de implementación.
Lo crea requirement-refine (tipo PRD) con los roles PO y UX de la entrevista; el rol ARCH no participa.
Vive en:
  <changesPath>/requirements/PRD-XXX-{nombre-corto}/README.md
y su número sale del secuencial ÚNICO de requirements/ (compartido con RQ-XXX y SRS-XXX).

MISMA NUMERACIÓN QUE EL SRS. Las secciones 1-15 coinciden una a una con srs-template.md, para que
PROMOVER el PRD a SRS sea completar, no reescribir: las secciones marcadas «solo SRS» (3, 4, 8.2-8.4,
9 a nivel de entidad, 10 «cómo», método de verificación de 12, riesgos técnicos de 13) se dejan con la
línea literal «Pendiente — se completa al promover a SRS» y NO se preguntan ni se infieren. Al promover,
la carpeta PRD-XXX-slug se renombra a SRS-XXX-slug con el MISMO número, el documento pasa a
srs-template.md y los ids FR/NFR/BR/AC/OB/SC se conservan.

Reglas de contenido:
  - Rigor igual que un SRS en lo que contiene: FR-XXX con RFC 2119, prioridad y estado; AC-XXX
    verificables en términos de negocio. Lo que el PRD recorta es el CONTEXTO DE IMPLEMENTACIÓN, no la
    calidad del requisito.
  - Sin stack, repositorios ni decisiones de diseño, aunque el insumo mencione tecnologías: una
    tecnología solo aparece como RESTRICCIÓN de negocio en 2.3 («debe convivir con el core bancario X»).
  - NFR-XXX cualitativos (sin cifra ni umbral) son válidos aquí y se cuantifican al promover.
  - Estado Ready = negocio aprobó alcance, prioridades y criterios (DoR del PRD en
    references/quality-criteria.md). Siempre con la primera línea de Observaciones diciendo qué falta
    para promover.
-->

# PRD-XXX: {{título corto del requerimiento}}

<!-- srs:status={{Draft|Ready}} -->
<!--
Marca oculta que se CONSERVA al publicar; claves y valores en inglés siempre (misma marca que el SRS:
el PRD es el mismo documento en una etapa anterior). La etiqueta visible va en el idioma resuelto.
-->
**Estado:** {{Draft | Ready}}
**Fecha de creación:** {{YYYY-MM-DD}}
**Última actualización:** {{YYYY-MM-DD}}
**Aprobación de negocio:** {{quién aprueba este PRD y en qué instancia (comité, cliente, sponsor); fecha si ya ocurrió, o «Pendiente»}}

## 1. Introducción

### 1.1 Problema y oportunidad

<!--
Situación actual, a quién le duele, con qué frecuencia o costo, y qué pasa si no se hace nada. Con
evidencia cuando exista (volúmenes, tiempos, quejas, pérdidas). Es la sección que justifica el PRD.
-->
{{situación actual y dolor: 3-8 líneas}}

**Evidencia:** {{datos, métricas actuales o fuentes que respaldan el problema; «Sin medición disponible» si no las hay}}

**Costo de no hacerlo:** {{qué se pierde o se arriesga si no se aborda}}

### 1.2 Alcance del producto

{{qué cubre este requerimiento: producto o módulo afectado, límites}}

**Fuera de alcance:**

- {{funcionalidad, caso o decisión que queda explícitamente fuera; indicar dónde se aborda si aplica}}

### 1.3 Definiciones, acrónimos y abreviaturas

<!-- Sección opcional. Términos del dominio van al glosario compartido; enlazarlo aquí. Eliminar si no aplica. -->
- **Glosario:** {{enlace a `docs/glossary.md`, si existe}}
- {{término o acrónimo}}: {{definición breve, solo si no está en el glosario}}

### 1.4 Objetivos y métricas de éxito

<!--
OBLIGATORIA. 2-4 objetivos de negocio. Cada uno con una métrica medible y, si el negocio la tiene, un
valor objetivo; si no la tiene, una métrica proxy («reducir el tiempo del proceso X») es válida y se
marca como tal. Sin al menos un OB-XX con métrica, el PRD no puede declararse Ready.
Ids OB-01, OB-02, … inmutables.
-->
| ID | Objetivo de negocio | Métrica | Valor objetivo | Plazo |
| -- | ------------------- | ------- | -------------- | ----- |
| OB-01 | {{resultado que el negocio espera}} | {{cómo se mide; «proxy» si no hay medición directa}} | {{valor, o «Por definir (proxy)»}} | {{fecha / versión}} |

### 1.5 Referencias

<!-- Documentos o estándares EXTERNOS (normativa, contratos, estudios, benchmarks). No confundir con la sección 14. Sección opcional. -->
- {{título del documento/estándar}}: {{versión, fecha, enlace o ubicación}}

## 2. Descripción general del producto

<!-- Contexto; no declara requisitos verificables — esos van en las secciones 5 en adelante. -->

### 2.1 Perspectiva del producto

{{contexto en el que se inserta: producto nuevo o módulo de uno existente; con qué procesos o sistemas del negocio convive, descritos por su función, no por su tecnología}}

### 2.2 Funciones del producto

{{resumen de alto nivel de lo que habilita, en 3-6 líneas; el detalle verificable va en Requisitos funcionales}}

### 2.3 Restricciones del producto

<!-- Restricciones DE NEGOCIO: presupuesto, plazo, normativa, convivencia obligada con un sistema o proceso existente (nombrado por su función), políticas internas. Una tecnología solo si es una imposición del negocio, nunca una elección. Sección opcional. -->
- {{restricción}}

### 2.4 Características de los usuarios y escenarios de uso

- {{tipo de actor/usuario}}: {{rol, contexto de uso, frecuencia, nivel de familiaridad — lo relevante para diseñar la experiencia}}

<!--
OBLIGATORIA. Escenarios clave narrativos: qué intenta lograr cada actor, en qué contexto y cómo se ve
el éxito. NO son historias de usuario ni criterios de aceptación; son el material del que work-define
deriva las US. Cada actor debe tener al menos un SC-XX. Ids SC-01, SC-02, … inmutables.
-->
| ID | Actor | Escenario | Resultado esperado | FR-XXX relacionados |
| -- | ----- | --------- | ------------------ | ------------------- |
| SC-01 | {{actor}} | {{situación y lo que hace, en 1-3 frases}} | {{cómo sabe el actor que lo logró}} | {{FR-XXX, …}} |

### 2.5 Supuestos y dependencias

<!-- Sección opcional. Eliminar si no aplica. -->

**Funcionalidad transversal asumida como existente**

<!--
Incluir solo si el requerimiento depende de capacidades comunes (autenticación, roles/permisos,
notificaciones, pagos, búsqueda, etc.). El agente INFIERE primero si cada una ya existe/se reutiliza o
si está en el alcance construirla — pregunta solo si queda duda (flow.md, paso 3). Una capacidad «Ya
existe / se reutiliza» NO tiene FR-XXX propio; una «En el alcance» sí lo tiene en la sección 5.
-->
| Capacidad | Supuesto | Origen |
| --------- | -------- | ------ |
| {{p. ej. Autenticación}} | {{Ya existe / se reutiliza | Está en el alcance de este PRD}} | {{plataforma ya en uso / servicio compartido / se construye en este requerimiento}} |

- {{otro supuesto que, de no cumplirse, cambia el alcance}}
- {{dependencia con otro proceso, área, proveedor o requerimiento}}

### 2.6 Requisitos diferidos a futuras versiones

<!-- Sección opcional. Lo identificado pero fuera de esta versión — normalmente Prioridad «Baja». -->
| Requisito | Motivo del diferimiento | Versión objetivo |
| --------- | ------------------------- | ------------------ |
| {{FR-XXX / NFR-XXX}} | {{por qué no entra}} | {{si se conoce, o «Por definir»}} |

### 2.7 Fases de entrega

<!-- Sección opcional. Incluir si el negocio ya decidió qué va en la primera versión y qué después. -->
| Fase | Contenido (FR-XXX) | Criterio de salida | Fecha objetivo |
| ---- | ------------------ | ------------------ | -------------- |
| {{v1 / MVP}} | {{FR-001, FR-002, …}} | {{qué debe cumplirse para cerrar la fase}} | {{si se conoce}} |

## 3. Stack tecnológico

Pendiente — se completa al promover a SRS.

## 4. Repositorios e implementación

Pendiente — se completa al promover a SRS.

## 5. Requisitos funcionales

<!--
Id secuencial FR-001, FR-002, … con categoría, prioridad, estado y enunciado RFC 2119 en MAYÚSCULAS.
Categorías: Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema
Detalle en ${PLUGIN_ROOT}/references/requirement-criteria.md. Prioridad: Esencial · Alta · Media · Baja
(quality-criteria.md#prioridad). Estado: Proposed · Approved (quality-criteria.md#estado-por-requisito).
Capacidades, no pantallas ni tablas: «El sistema DEBE permitir al socio disputar un cargo», no «un botón
Disputar en la pantalla de movimientos». Sus AC-XXX viven en la sección 12.
-->
| ID | Categoría | Prioridad | Estado | Enunciado |
| -- | --------- | --------- | ------ | --------- |
| FR-001 | {{categoría}} | {{Esencial / Alta / Media / Baja}} | {{Proposed / Approved}} | {{enunciado RFC 2119 en MAYÚSCULAS}} |
| FR-002 | {{…}} | {{…}} | {{…}} | {{…}} |

## 6. Requisitos no funcionales (expectativas de calidad)

<!--
Expectativas de calidad del NEGOCIO, cualitativas: sin cifra ni umbral («debe responder con agilidad
en horario de atención», «los datos del socio deben estar protegidos», «disponible cuando el call
center opera»). Id NFR-001, NFR-002, …, categoría ISO/IEC 25010 (Idoneidad funcional · Eficiencia de
rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad · Portabilidad),
Estado Proposed. Al promover a SRS, el rol ARCH las cuantifica conservando el id. Un NFR sin umbral es
válido aquí y es laguna en un SRS. Consolidar aquí toda expectativa de seguridad.
-->
| ID | Categoría | Prioridad | Estado | Expectativa |
| -- | --------- | --------- | ------ | ----------- |
| NFR-001 | {{característica ISO 25010}} | {{Esencial / Alta / Media / Baja}} | {{Proposed}} | {{enunciado RFC 2119 en MAYÚSCULAS, cualitativo}} |

## 7. Reglas de negocio

<!-- Sección opcional. Restricciones, obligaciones o prohibiciones del dominio, independientes de un FR puntual. Id BR-01, BR-02, …, RFC 2119 en MAYÚSCULAS. -->
- **BR-01:** {{enunciado RFC 2119 en MAYÚSCULAS}} → relacionado con {{FR-XXX}}

## 8. Interfaces externas

### 8.1 Interfaces de usuario

<!-- Canales por los que el usuario interactúa (web, móvil, kiosco, voz, correo…) y sus lineamientos generales (accesibilidad, dispositivos, guía de estilo). El detalle de pantallas va en la sección 11. -->
- {{canal}}: {{lineamientos generales}}

### 8.2 Interfaces de hardware

Pendiente — se completa al promover a SRS.

### 8.3 Interfaces de software

Pendiente — se completa al promover a SRS. {{Opcional: nombrar por su función los sistemas con los que el negocio exige integrarse — «el core de tarjetas», «el gestor de campañas» — sin contrato ni tecnología.}}

### 8.4 Interfaces de comunicaciones

Pendiente — se completa al promover a SRS.

## 9. Requisitos de datos (obligaciones de negocio)

<!--
Solo lo que el NEGOCIO exige sobre los datos: qué datos sensibles o personales maneja, cuánto tiempo
deben conservarse, quién puede verlos, qué debe auditarse. Entidades, volumen y modelo son «solo SRS».
«No aplica» si el requerimiento no maneja datos propios.
-->
| Dato o conjunto de datos | Sensibilidad | Obligación de negocio | Relacionado con |
| ------------------------ | ------------ | --------------------- | --------------- |
| {{p. ej. datos de contacto del socio}} | {{personal / sensible / interno / público}} | {{retención exigida, quién accede, qué se audita}} | {{FR-XXX / NFR-XXX / normativa}} |

Entidades, volumen y modelo: Pendiente — se completa al promover a SRS.

## 10. Cumplimiento normativo

<!-- QUÉ normativa aplica y a qué FR/dato afecta. CÓMO se cumple es «solo SRS». «No aplica» si no hay normativa identificada. -->
| Normativa / estándar | Qué exige, en una línea | Afecta a |
| -------------------- | ----------------------- | -------- |
| {{nombre y, si aplica, artículo o cláusula}} | {{obligación concreta}} | {{FR-XXX / NFR-XXX / dato de la sección 9}} |

Cómo se cumple cada una: Pendiente — se completa al promover a SRS.

## 11. Diseño de interfaz (wireframes)

<!--
Sección opcional — solo si el requerimiento tiene interfaz de usuario propia; eliminar por completo
(incluida la marca oculta) si no. Igual que en el SRS: el tipo de solución se infiere (se pregunta solo
si es ambiguo), los wireframes los genera y revisa /design-define vía subagente en wireframes/ DENTRO
DE ESTA CARPETA, y la ruta y el estado se copian tal cual de lo que devuelve. El PRD no se declara Ready
con una pantalla en Proposed. Al promover, la carpeta wireframes/ viaja con el documento.
-->
<!-- srs:ui-required={{true|false}} -->
**¿Requiere diseño de interfaz?** {{Sí | No}}

**Tipo de solución:** {{Aplicación web / App nativa (iOS) / App nativa (Android) / App híbrida / Aplicación de escritorio}}

**¿Debe ser responsiva?** {{Sí | No | No aplica}}

| Pantalla | Wireframe | Estado de revisión | Observaciones ya incorporadas |
| -------- | --------- | ------------------ | ----------------------------- |
| {{nombre}} | {{[WF-XXX](wireframes/WF-XXX-[pantalla-slug].md)}} | {{Proposed / Approved}} | {{cambios pedidos y en qué FR-XXX quedaron; «Ninguna»}} |

## 12. Criterios de aceptación y trazabilidad

<!--
Una fila por criterio de aceptación. Id AC-001, AC-002, … secuencial global en el documento (un FR/NFR
puede tener varios AC; un AC pertenece a un solo FR/NFR), INMUTABLES. El criterio se redacta en
términos de negocio, observables y verificables («el socio recibe la confirmación de la disputa en la
misma sesión»), nunca con términos vagos sin medida.
Origen: de dónde salió el requisito (references/raw-requirement.md por defecto). «Depende de» opcional.
Método de verificación: SIEMPRE «Pendiente» en un PRD — lo fija el rol ARCH al promover, sin cambiar el id.
Consumidores: test-define genera TC-XXX de aceptación sobre estos AC (en test-cases/ de esta carpeta,
padre PRD-XXX; al promover, el padre pasa a SRS-XXX); work-define los hereda citando el AC de origen en
cada AC de la US. test-define añade bajo esta tabla la línea «Casos de prueba:» por AC; no editarla a mano.
-->
| ID | AC | Origen | Depende de | Método de verificación | Criterio de aceptación |
| -- | -- | ------ | ---------- | ---------------------- | ---------------------- |
| FR-001 | AC-001 | {{`references/raw-requirement.md` u otro archivo}} | {{FR-XXX / «Ninguna»}} | Pendiente | {{condición observable, en lenguaje de negocio}} |
| FR-001 | AC-002 | {{…}} | {{…}} | Pendiente | {{segundo criterio del mismo requisito, si lo hay}} |

## 13. Riesgos de producto

<!-- Riesgos de adopción, negocio, regulatorios o de alcance, con probabilidad/impacto/mitigación. Los técnicos se añaden al promover a SRS, en la misma tabla. «Ninguno identificado» es válido; no omitir la sección. -->
| ID | Riesgo | Probabilidad | Impacto | Mitigación | Relacionado con |
| -- | ------ | ------------ | ------- | ---------- | --------------- |
| R-01 | {{descripción}} | {{Alta / Media / Baja}} | {{Alto / Medio / Bajo}} | {{cómo se reduce o gestiona}} | {{FR-XXX / NFR-XXX / OB-XX / Supuesto}} |

## 14. Enlaces y archivos de apoyo

<!-- Archivos propios de esta carpeta. Solo enlaces a recursos ya almacenados; nunca pegar archivos ni imágenes aquí. -->
- **Requerimiento original:** {{enlace markdown a `references/[archivo]`}}
- **Wireframes:** {{[`wireframes/`](wireframes/), si tiene UI}}
- **RQ relacionado:** {{enlace a `RQ-XXX` si este requerimiento se certificó antes como requerimiento externo, o «Ninguno»}}
- {{otras entradas, o «Ninguna por ahora»}}

## 15. Historias de usuario derivadas

<!-- La completa /work-define. Vacía al crear el PRD. Las US derivadas de un PRD quedan con repositorios por confirmar hasta la promoción. -->
| US-XXX | Título | FR-XXX cubiertos |
| ------ | ------ | ---------------- |
| {{US-XXX}} | {{título}} | {{FR-001, FR-003, …}} |

## Observaciones

- **Para promover a SRS falta:** {{siempre explícito, aunque el PRD esté Ready: stack, repositorios, umbrales de NFR, interfaces 8.2-8.4, entidades de datos, cómo se cumple la normativa, método de verificación de los AC, riesgos técnicos — y lo que el negocio haya dejado para ingeniería}}
- {{lagunas de producto sin cerrar}}
- {{wireframes pendientes de revisión o con cambios sin trasladar a los FR-XXX}}
- {{aclaraciones pendientes del negocio}}

## Validación

### Definition of Ready (DoR) del PRD

<!-- Detalle de cada criterio en references/quality-criteria.md#definition-of-ready-dor-del-prd. -->
| Criterio DoR | Estado | Notas |
| ------------ | ------ | ----- |
| Problema y evidencia descritos (1.1) | {{Met / Not Met / Partial}} | {{}} |
| Objetivos y métricas de éxito definidos (1.4) | {{Met / Not Met / Partial}} | {{al menos un OB-XX con métrica directa o proxy}} |
| Alcance y fuera de alcance claros (1.2) | {{Met / Not Met / Partial}} | {{}} |
| Actores y escenarios de uso (2.4) | {{Met / Not Met / Partial}} | {{cada actor con al menos un SC-XX}} |
| Requisitos funcionales completos y priorizados (5) | {{Met / Not Met / Partial}} | {{todos Approved}} |
| Expectativas de calidad revisadas (6) | {{Met / Not Met / Partial / N/A}} | {{cualitativas; cubre Seguridad, Rendimiento, Fiabilidad/Disponibilidad}} |
| Interfaz de usuario y wireframes revisados (8.1, 11) | {{Met / Not Met / Partial / N/A}} | {{N/A si no hay UI}} |
| Obligaciones de datos identificadas (9) | {{Met / Not Met / Partial / N/A}} | {{}} |
| Normativa aplicable identificada (10) | {{Met / Not Met / Partial / N/A}} | {{}} |
| Criterios de aceptación completos (12) | {{Met / Not Met / Partial}} | {{todo FR/NFR con al menos un AC-XXX verificable}} |
| Riesgos de producto identificados (13) | {{Met / Not Met / Partial}} | {{«Ninguno» es válido}} |
| Sin aclaraciones pendientes de negocio | {{Met / Not Met / Partial}} | {{la línea «Para promover a SRS falta» no cuenta}} |
| Validación final (Ola 3, PO+UX) superada | {{Met / Not Met / Partial}} | {{gaps, revisión cruzada y subagente sin contexto}} |
| Aprobación de negocio registrada | {{Met / Not Met}} | {{quién y cuándo, en la cabecera}} |
