# Estándares de definición por tipo de elemento

Cómo se define cada tipo de elemento de una capability. La estructura exacta de secciones y tablas está en las plantillas de `assets/` (`capability-readme-template.md` para el README índice; `model-template.md`, `api-template.md`, `flow-template.md` y `diagram-template.md` para los archivos de `models/`, `apis/`, `flows/` y `diagrams/`); este archivo explica las reglas, los criterios de calidad y da un ejemplo completo por tipo.

Reglas comunes a todos los tipos:

- **Id estable por tipo:** `MD-XXX`, `API-XXX`, `FL-XXX`, `DG-XXX` (y `WF-XXX` para los wireframes, ver abajo), secuencial dentro de la capability (la secuencia es única aunque los elementos vivan en archivos distintos). No renumerar nunca: otros artefactos enlazan por ancla o por nombre de archivo. Si un elemento deja de aplicar, marcarlo `(Obsoleto)` en el título y explicar en qué fue reemplazado, en lugar de borrarlo, mientras existan consumidores que lo referencien.
- **Dónde vive cada tipo:** cada modelo (`MD-XXX`), cada **grupo de APIs** (`API-XXX`), cada flujo (`FL-XXX`) y cada diagrama (`DG-XXX`) en su propio archivo bajo `models/`, `apis/`, `flows/` y `diagrams/`, **nombrado con el estándar `MD-XXX-{slug}` / `API-XXX-{slug}` / `FL-XXX-{slug}` / `DG-XXX-{slug}`** (`models/MD-001-factura.md`, `apis/API-001-facturas.md`, `flows/FL-001-emision-factura.md`, `diagrams/DG-001-contexto.md`; slug kebab-case del nombre, fijado al crear el elemento) y enlazado desde la tabla índice correspondiente del README. Renombrar el elemento no renombra el archivo: el id es el contrato, igual que en las carpetas `US-XXX-[nombre-corto]`. Su referencia externa es la ruta del archivo, sin ancla. **El `README.md` es el índice de la capability: no define elementos.**
- **Ancla explícita de operación, derivada de método + ruta** (dentro de un archivo de `apis/`). Un `API-XXX` contiene varias operaciones; cada una lleva **inmediatamente antes** de su encabezado una línea con su ancla, y el encabezado es `### \`MÉTODO /ruta\` — Nombre`:

  ```markdown
  <a id="post-invoices"></a>
  ### `POST /api/v1/invoices` — Crear factura
  ```

  La regla del ancla es mecánica, en dos pasos:

  1. **Descartar el prefijo de versión** de la ruta: los segmentos iniciales `api` y `vN` (`v1`, `v2`, `v10`) se eliminan. `/api/v1/invoices/{id}` → `invoices/{id}`.
  2. **Slug:** método y resto de la ruta en minúsculas, todo carácter no alfanumérico convertido a guion, sin guiones repetidos ni al inicio o al final.

  `GET /api/v1/invoices/{id}` → `get-invoices-id` · `POST /api/v2/invoices` → `post-invoices` · `POST /auth/login` → `post-auth-login`.

  Es derivable por cualquiera que conozca el endpoint, idéntica en todo renderizador, estable ante un cambio de nombre de la operación y **estable ante un cambio de versión del API**: al pasar de `v1` a `v2` el ancla no cambia, así que los enlaces entrantes de US/TK/WI siguen apuntando al mismo sitio. La versión sí figura, íntegra, en el encabezado de la operación y en la ruta base del grupo — el ancla es la dirección, no el contrato. **No es opcional ni cosmética:** ver [Por qué el ancla no se deriva del título](#por-qué-el-ancla-no-se-deriva-del-título).

  La referencia que consumen US/TK/WI es la **ruta del archivo** (`apis/API-001-facturas.md`) cuando el consumidor necesita el grupo, y la ruta **con ancla de operación** (`apis/API-001-facturas.md#post-invoices`) cuando necesita un endpoint concreto.
- **Referencias cruzadas por id:** cuando un elemento usa otro (una API recibe un modelo, un flujo invoca una API), citarlo por su id (`MD-001`, `API-002`) con la ruta relativa desde el archivo donde se cita — desde el README a un modelo, `[MD-001](models/MD-001-factura.md)`; desde un archivo de `apis/` a un modelo, `[MD-001](../models/MD-001-factura.md)`; desde un flujo a un endpoint, `[API-001](../apis/API-001-facturas.md#post-invoices)`; entre operaciones del mismo archivo de APIs, ancla local (`[GET /api/v1/invoices/{id}](#get-invoices-id)`); entre capabilities, ruta relativa (`[MD-001 de facturación](../../facturacion/models/MD-001-factura.md)` o `[API-001 de facturación](../../facturacion/apis/API-001-facturas.md)`).
- **No inventar:** todo tipo, código de error, regla o rama de flujo que no venga del input, del código del repo o de la US/TK/WI de origen se pregunta (grilling) o queda en Observaciones. Un dato plausible pero no confirmado es peor que una laguna documentada.
- **Idioma de los identificadores** (detalle de la excepción declarada en la sección «Resolución de idioma» de `SKILL.md`): los nombres de campos, rutas y payloads se escriben como existirán en el código. Resolver así, deteniéndose en el primer paso que aplique:
  1. Si ya existen modelos/DTOs/endpoints en el repo (código o documentos técnicos previos), seguir **su** convención de idioma tal cual está, aunque sea español — no imponer inglés sobre un código que ya usa español.
  2. Si es el primer elemento técnico del proyecto (sin precedente en el repo) y el idioma no es evidente del contexto, **preguntarlo explícitamente** en el grilling inicial (p. ej. «¿los nombres de campo van en español o en inglés?») en vez de asumir inglés por defecto — es una decisión recurrente en proyectos hispanohablantes y asumirla sin preguntar genera documentos inconsistentes con lo que el equipo termina escribiendo.
  3. Sin precedente y sin poder preguntar (ver "Sin canal de respuesta disponible" en `flow.md`): usar inglés como default y dejar constancia en Observaciones de que la convención de idioma de campos quedó asumida, no confirmada.

  Las descripciones (prosa) van siempre en el idioma de preferencia resuelto para el documento, sin importar el idioma elegido para los nombres de campo.

---

## Por qué el ancla no se deriva del título

El ancla que un renderizador genera solo desde el título de la operación (`### Crear factura`) **no sirve como contrato de enlace**, por tres motivos independientes:

1. **El consumidor no la puede construir.** Quien escribe la referencia —`work-define` o `work-plan` redactando la sección Referencias de una US/TK/WI— conoce el **id** y el **endpoint** (método y ruta), no el slug del nombre. Tiene que adivinarlo, y cualquier fallo produce un enlace que apunta a nada. Es el fallo más frecuente de esta convención.
2. **Depende del renderizador.** Los slugs derivados **no** están estandarizados. `### Aprobación de crédito` genera `#aprobacion-de-credito` en unos motores (que transliteran la tilde) y `#aprobación-de-crédito` en otros (que la conservan). El mismo documento, dos anclas distintas según dónde se lea: el enlace funciona en la web del repo y falla en el editor, o al revés. La puntuación y el backtick del método agravan lo mismo — `### \`POST /invoices\` — Emitir factura (SRI/ATS)` colapsa de formas distintas en cada motor, imposible de anticipar.
3. **Rompe al renombrar.** El método y la ruta son estables por diseño (cambiarlos es romper el contrato del API); el nombre de la operación no. Corregir «Crear factura» por «Emitir factura» invalidaría **todos** los enlaces entrantes, que es justo lo que la estabilidad del contrato pretendía evitar.

El ancla explícita `<a id="post-invoices"></a>` resuelve los tres: es derivable mecánicamente del método y la ruta, idéntica en cualquier renderizador porque no se calcula a partir de prosa, y sobrevive a cualquier cambio de nombre de la operación. `<a id>` es HTML admitido por GitHub, GitLab, Bitbucket y Azure Repos; **no** usar la sintaxis `{#post-invoices}` de kramdown/pandoc, que GitHub no interpreta y deja visible como texto dentro del título. Los archivos de `models/`, `apis/`, `flows/` y `diagrams/` aplican la misma doctrina en su parte estable: el id manda y el slug se congela al crear — `MD-001-factura.md` no se renombra aunque el modelo pase a llamarse «Factura de venta», y nunca es solo `factura.md`; `API-001-facturas.md` tampoco se renombra al rebautizar el grupo.

> El ancla derivada del título sigue existiendo, no se pierde nada. Pero la **referencia canónica es la explícita**, y es la única que se cita.

---

## Modelos de datos (MD-XXX)

Un `MD-XXX` describe una entidad, DTO o esquema: su tabla de campos, validaciones y relaciones.

Reglas:

- **Tipos concretos**, no genéricos: `string (UUID v4)`, `decimal(12,2)`, `date (ISO 8601)` — no «texto» ni «número». Si el proyecto tiene tipos propios o enums, citarlos por nombre y listar los valores permitidos en Validaciones.
- **Validaciones verificables:** rangos, formatos (regex si aplica), unicidad, obligatoriedad condicional («requerido si `type = credit`»). Es la columna que las TK y los test cases consumen; una validación vaga («debe ser válido») no sirve.
- **Relaciones explícitas** con cardinalidad: `Factura 1—N LineaFactura (MD-002)`. Incluir diagrama `erDiagram` de Mermaid solo cuando hay dos o más modelos relacionados; con un modelo aislado el diagrama no aporta.
- Distinguir en la descripción si el modelo es **entidad persistida**, **DTO de transporte** o **proyección/vista**, porque condiciona qué validaciones aplican y dónde.

**Ejemplo:**

Archivo `models/MD-001-factura.md`:

# MD-001: Factura

Entidad persistida que representa una factura emitida a un cliente.

| Campo | Tipo | Requerido | Descripción | Validaciones / restricciones |
| ----- | ---- | --------- | ----------- | ---------------------------- |
| id | string (UUID v4) | Sí | Identificador único | Generado por el sistema; inmutable |
| customerId | string (UUID v4) | Sí | Cliente facturado | Debe existir en la capability clientes |
| status | enum | Sí | Estado de la factura | `draft` \| `issued` \| `paid` \| `voided` |
| total | decimal(12,2) | Sí | Total con impuestos | ≥ 0; suma de líneas + impuestos |
| issuedAt | datetime (ISO 8601, UTC) | No | Fecha de emisión | Requerido si `status ≠ draft` |

**Relaciones:** Factura 1—N LineaFactura (`[MD-002](MD-002-linea-factura.md)`)

---

## APIs / Endpoints (API-XXX)

Un `API-XXX` es un **grupo de endpoints de una misma entidad o funcionalidad**, con el contrato completo de cada operación: método+ruta, autenticación, request, responses y ejemplos. Vive en su propio archivo (`apis/API-XXX-{slug}.md`, plantilla `api-template.md`), con su fila en la tabla índice «APIs / Endpoints» del README.

Reglas:

- **Un grupo por elemento, no una operación por elemento.** El criterio de agrupación es la **entidad** (todo el CRUD de un recurso y sus endpoints relacionados: `POST /projects`, `GET /projects`, `GET /projects/{id}`, `PATCH /projects/{id}`, `DELETE /projects/{id}`, `POST /projects/{id}/archive`, `GET /projects/{id}/members`) o la **funcionalidad** cuando no hay una entidad clara (`POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `POST /auth/forgot-password`). Un endpoint pertenece a **un solo** grupo: si manipula un recurso, va con ese recurso; si sirve a un proceso transversal, va con ese proceso.
- **Nombre del grupo en plural cuando es una entidad** (`Proyectos`, `Facturas`), en sustantivo de la funcionalidad cuando no lo es (`Autenticación`, `Reportes`). El slug del archivo se congela al crear el grupo.
- **Antes de crear un grupo nuevo, revisar los existentes.** Un endpoint de proyecto no abre `API-004: Archivar proyecto`: se añade a `API-001-proyectos.md` como una operación más, y el grupo conserva su id. Abrir un grupo por operación reproduce el problema que esta convención resuelve.
- **Cabecera del grupo:** alcance, prefijo de ruta común, autenticación por defecto y modelos relacionados — lo que se repetiría en cada operación se declara una vez arriba, y cada operación solo lo sobrescribe si difiere. Tras la cabecera, la **tabla de operaciones** del grupo (ancla, método+ruta, nombre, descripción) precede a los contratos.
- **Ancla de operación obligatoria** en la línea anterior a cada `###`, derivada de método+ruta (ver reglas comunes arriba). Es lo que permite citar un endpoint concreto desde una US/TK/WI o desde un `FL-XXX`.
- **Request y response tipados contra los modelos:** si el body es un modelo ya definido, referenciar `MD-XXX` en lugar de repetir la tabla de campos; definir inline solo lo que no exista como modelo (y valorar promoverlo a `MD-XXX` si lo consume más de una operación).
- **Responses exhaustivas:** el caso de éxito y **cada** error esperable con su código y condición (validación 400/422, autorización 401/403, no encontrado 404, conflicto 409…). Usar la estructura de error estándar del proyecto si existe; si no existe, preguntarla — no inventarla.
- **Ejemplos JSON realistas** para éxito y al menos un error, con valores coherentes con las validaciones de los `MD-XXX`.
- **Autenticación y permisos** siempre declarados, aunque sea «Pública»: la omisión es ambigua. Si el grupo declara una por defecto, cada operación indica «Hereda la del grupo» o la suya propia — en blanco no.
- **Operación obsoleta:** marcarla `(Obsoleto)` en su encabezado explicando el reemplazo, sin quitar su ancla mientras tenga consumidores. Un grupo entero obsoleto se marca en su `# API-XXX: Nombre (Obsoleto)`.

**Ejemplo:**

Archivo `apis/API-001-facturas.md`:

# API-001: Facturas

- **Alcance:** ciclo de vida de la factura (creación, consulta, emisión y anulación). No cubre la conciliación de cobros (ver `[FL-002](../flows/FL-002-conciliacion.md)`).
- **Base:** `/api/v1/invoices`
- **Autenticación por defecto:** Bearer JWT; rol `billing:read`
- **Modelos relacionados:** `[MD-001](../models/MD-001-factura.md)`, `[MD-002](../models/MD-002-linea-factura.md)`

## Operaciones

| Ancla | Método y ruta | Operación | Descripción |
| ----- | ------------- | --------- | ----------- |
| [#post-invoices](#post-invoices) | `POST /api/v1/invoices` | Crear factura | Crea una factura en estado `draft` |
| [#get-invoices-id](#get-invoices-id) | `GET /api/v1/invoices/{id}` | Consultar factura | Devuelve una factura por id |

---

<a id="post-invoices"></a>
### `POST /api/v1/invoices` — Crear factura

- **Autenticación:** Bearer JWT; rol `billing:write`
- **Descripción:** Crea una factura en estado `draft` a partir de sus líneas.

**Request**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
| --------- | --------- | ---- | --------- | ----------- |
| customerId | body | string (UUID v4) | Sí | Cliente a facturar |
| lines | body | LineaFactura[] (MD-002) | Sí | Mínimo 1 línea |

```json
{ "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "lines": [{ "productId": "…", "quantity": 2 }] }
```

**Responses**

| Código | Condición | Cuerpo |
| ------ | --------- | ------ |
| 201 | Factura creada | Factura (MD-001) |
| 422 | `lines` vacío o cliente inexistente | Error estándar del proyecto |
| 403 | Sin rol `billing:write` | Error estándar del proyecto |

<a id="get-invoices-id"></a>
### `GET /api/v1/invoices/{id}` — Consultar factura

- **Autenticación:** Hereda la del grupo
- **Descripción:** Devuelve la factura solicitada con sus líneas.

**Request**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
| --------- | --------- | ---- | --------- | ----------- |
| id | path | string (UUID v4) | Sí | Identificador de la factura |

**Responses**

| Código | Condición | Cuerpo |
| ------ | --------- | ------ |
| 200 | Factura encontrada | Factura (MD-001) |
| 404 | No existe una factura con ese id | Error estándar del proyecto |

---

## Flujos / Procesos (FL-XXX)

Un `FL-XXX` describe un proceso de negocio o técnico: disparador, participantes, pasos, diagrama y manejo de errores. Vive en su propio archivo (`flows/FL-XXX-{slug}.md`, plantilla `flow-template.md`), con su fila en la tabla índice del README.

Reglas:

- **Disparador y resultado siempre explícitos:** un flujo sin estado final verificable no es implementable ni testeable.
- **Diagrama Mermaid obligatorio.** Elegir el tipo por la naturaleza del flujo: `sequenceDiagram` cuando importa la interacción entre componentes/sistemas; `flowchart` cuando importan decisiones y ramas. Uno solo, el que mejor comunique — no ambos por defecto.
- **Pasos numerados con actor/componente explícito** en cada paso («El servicio de facturación valida…», no «se valida…»). Los pasos que invocan un endpoint o tocan un modelo lo citan por su grupo y operación (`API-001` → `POST /api/v1/invoices`) o por su id de modelo (`MD-001`).
- **Cada rama del diagrama aparece en los pasos o en Manejo de errores.** Un rombo del flowchart sin rama documentada es una laguna: preguntarla o registrarla en Observaciones.
- **Manejo de errores por paso:** qué puede fallar y el comportamiento esperado (reintento, compensación, mensaje al usuario, aborto). Es la parte que más lagunas suele tener — foco del grilling.

**Ejemplo (diagrama):**

```mermaid
sequenceDiagram
  actor U as Usuario
  participant F as Servicio Facturación
  participant P as Pasarela Pagos
  U->>F: Emitir factura (API-001 · POST /api/v1/invoices/{id}/issue)
  F->>F: Validar estado draft (MD-001)
  F->>P: Registrar cobro
  alt Cobro aceptado
    P-->>F: OK
    F-->>U: Factura issued
  else Cobro rechazado
    P-->>F: Rechazo
    F-->>U: Error con motivo (sin cambio de estado)
  end
```

---

## Diagramas (DG-XXX)

Un `DG-XXX` es un diagrama estructural o de arquitectura de la capability: clases, contexto (C4 nivel 1), contenedores (C4 nivel 2), componentes (C4 nivel 3), despliegue o estados. Se diferencia de los diagramas embebidos en otros elementos (el ER de un `MD-XXX`, la secuencia de un `FL-XXX`): un `DG-XXX` es un elemento **propio y enlazable**, con valor de referencia por sí mismo.

Reglas:

- **Tipo y alcance siempre declarados.** El tipo determina la notación; el alcance evita diagramas «de todo» que no responden ninguna pregunta concreta. Un buen `DG-XXX` responde una pregunta de implementación: ¿qué clases forman el dominio?, ¿con qué sistemas se integra la capability?, ¿en qué contenedores corre?
- **Mermaid como notación por defecto:** `classDiagram` para clases, `C4Context`/`C4Container`/`C4Component` para los niveles C4, `stateDiagram-v2` para estados, `flowchart` para despliegue si `C4Deployment` no aporta. Si el diagrama existe como archivo exportado (draw.io, PlantUML renderizado, imagen), guardarlo en `docs/architecture/[capability]/assets/` y enlazarlo desde el archivo del elemento — pero preferir Mermaid porque vive en el propio archivo y se versiona con él.
- **Nivel de detalle por tipo:** en clases, atributos y relaciones con cardinalidad, métodos solo si son parte del contrato del dominio; en contexto, sistemas externos y actores con la dirección de cada interacción; en contenedores/componentes, tecnología entre corchetes y el protocolo de cada flecha. Una flecha sin etiqueta es una laguna.
- **Coherencia con los demás elementos:** las clases del `DG-XXX` de clases deben corresponderse con los `MD-XXX` (citarlos en Notas); las interacciones del contexto con los endpoints de los `API-XXX` o los `FL-XXX` que las materializan. Un diagrama que contradice las tablas es peor que ningún diagrama — al actualizar un `MD-XXX`/`API-XXX`/`FL-XXX`, revisar los `DG-XXX` que los citan.
- **Un diagrama por elemento.** Si hacen falta el contexto y los contenedores, son `DG-001` y `DG-002`, cada uno enlazable por separado.

**Ejemplo:**

Archivo `diagrams/DG-001-contexto.md`:

# DG-001: Contexto de la capability facturación

- **Tipo:** Contexto (C4)
- **Alcance:** sistemas y actores que interactúan con facturación; no incluye el detalle interno de los servicios.

```mermaid
C4Context
  Person(cajero, "Cajero", "Emite facturas desde el punto de venta")
  System(facturacion, "Facturación", "Emisión y gestión de facturas")
  System_Ext(sri, "SRI", "Autoridad tributaria — autorización de comprobantes")
  System_Ext(pagos, "Pasarela de pagos", "Cobro de facturas")
  Rel(cajero, facturacion, "Emite factura", "API-001")
  Rel(facturacion, sri, "Solicita autorización", "FL-001")
  Rel(facturacion, pagos, "Registra cobro", "FL-001")
```

**Notas**

- La interacción con la pasarela se detalla en `[FL-001](../flows/FL-001-emision-factura.md)`; el contrato de emisión en `[API-001 · POST /api/v1/invoices/{id}/issue](../apis/API-001-facturas.md#post-invoices-id-issue)`.

---

## Wireframes (WF-XXX) — mismo estándar, otro productor

Un `WF-XXX` es el wireframe de una pantalla: un documento `wireframes/WF-XXX-{slug}.md` (objetivo, componentes, estados, historial de revisión) y su SVG hermano `wireframes/WF-XXX-{slug}.svg` (mockup en escala de grises, baja/media fidelidad), con fila en la tabla índice «Wireframes» del README. Sigue las mismas reglas de id estable, slug fijado al crear, referencia por ruta de archivo sin ancla y «sin fila en el índice = huérfano» que `MD`/`API`/`FL`/`DG`. Plantilla: `assets/wireframe-template.md`.

La diferencia es **quién lo produce**: `requirement-refine` (paso 4 de su flujo, desde un `SRS-XXX`) o `work-define` (desde una `US-XXX` que toca UI y no hereda wireframes), porque el wireframe se valida con el usuario en lenguaje de experiencia, no de implementación. `design-define` **no crea, renumera ni revisa** wireframes: los lee como insumo (una pantalla aprobada suele anticipar el `FL-XXX` y las `API-XXX` que la sirven), los cita por id en Notas cuando un flujo o un endpoint los materializa, y conserva sus filas al reescribir el README. Su estado de revisión (`Pendiente` / `Revisado con cambios` / `Aprobado`) lo gobierna el artefacto de origen (SRS o US), no la capability.

---

## ¿Y lo que no encaja en estos cuatro tipos?

Eventos de dominio, colas, jobs programados o integraciones con terceros pueden documentarse como el tipo más cercano (un contrato de evento suele caber como `MD-XXX` de payload + `FL-XXX` de proceso; un conjunto de webhooks salientes cabe como un `API-XXX` agrupado por funcionalidad). Si el proyecto necesita un tipo propio con frecuencia, proponer al usuario extender esta convención — no improvisar formatos distintos en cada documento.
