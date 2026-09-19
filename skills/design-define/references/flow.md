# Flujo detallado, grilling, ejemplos y anti-patrones

Procedimiento paso a paso para **crear** y **actualizar** la carpeta técnica de una capability, el detalle del **grilling** por tipo de elemento, el **modo delegado**, checklist, ejemplos y handoffs. Los estándares de contenido por tipo viven en [`element-standards.md`](element-standards.md); la estructura, en las plantillas de `assets/` (`capability-readme-template.md`, `model-template.md`, `api-template.md`, `flow-template.md`, `diagram-template.md`).

---

## Validación antes de crear o editar

Antes de tocar archivos, verificar. Si algo falla, **no crear** — informar y resolver primero.

- **Capability resuelta:** listar las carpetas existentes en `docs/architecture/`. Si el elemento pedido encaja en una capability existente, el destino es **esa carpeta** (actualizar), aunque el usuario no la haya nombrado. Crear una capability nueva solo si ninguna existente cubre el dominio del elemento; ante la duda, preguntar mostrando las capabilities existentes como opciones.
- **Duplicado de elemento:** si la capability ya define un elemento equivalente en `models/`/`apis/`/`flows/`/`diagrams/` (mismo modelo, misma operación, mismo flujo), no crear uno nuevo: proponer **actualizar** el existente conservando su id. Dos ids para la misma cosa rompen las referencias de los consumidores.
- **Grupo de APIs resuelto:** para cada endpoint nuevo, buscar primero el `API-XXX` existente que cubra su entidad o funcionalidad y **añadirlo allí** como una operación más. Abrir un `API-XXX` nuevo solo si ningún grupo existente lo cubre; ante la duda, preguntar mostrando los grupos existentes como opciones. Un grupo con una sola operación porque se creó por endpoint es un error de agrupación, no un grupo.
- **Conflicto con la fuente:** si lo pedido contradice la US/TK/WI de origen o el código existente del repo, parar y reportarlo (al usuario en modo directo; en la respuesta final en modo delegado). La US prevalece sobre los documentos derivados; el documento técnico no se usa para «corregir» la historia por la puerta de atrás.

---

## Grilling por tipo de elemento

El objetivo del grilling es que el documento sea **referencia de implementación suficiente**: quien implemente la TK no debería tener que adivinar nada que este documento pudo haber fijado. Antes de redactar, contrastar el input recibido con lo que exige el estándar de cada tipo ([`element-standards.md`](element-standards.md)) y preguntar **solo las lagunas reales** — lo que ya está en el input, en el repo o en la US/TK/WI no se repregunta. Mecánica de tandas y formato de preguntas: sección «Cómo preguntar al usuario» del `SKILL.md`.

Lagunas típicas por tipo — usar como lista de contraste, no como cuestionario fijo:

**Modelos (`MD-XXX`)**
- Campos mencionados sin tipo concreto, o tipos ambiguos («número» → ¿entero, decimal, precisión?).
- Obligatoriedad no declarada, u obligatoriedad condicional sospechada pero no confirmada.
- Enums sin lista cerrada de valores; identificadores sin formato (¿UUID, secuencial, código de negocio?).
- Relaciones implícitas («la factura tiene líneas») sin cardinalidad ni dirección.
- ¿Entidad persistida o DTO? Si el input no lo aclara y cambia las validaciones, preguntar.

**APIs (`API-XXX`)**
- Agrupación no resuelta: ¿a qué entidad o funcionalidad pertenece el endpoint? ¿Existe ya un grupo que lo cubra o hay que abrir uno (y con qué nombre)?
- Endpoints del mismo recurso que el input no menciona pero el grupo hará obvios (¿hay listado, borrado, actualización parcial?): confirmarlos o dejarlos fuera del alcance explícitamente, no suponerlos.
- Ruta o método no especificados; versión del API si el proyecto versiona.
- Autenticación/permisos ausentes (nunca asumir «pública» por omisión).
- Errores: ¿qué condiciones de negocio devuelven error y con qué código? ¿Existe estructura de error estándar en el proyecto?
- Paginación, ordenación o filtros en operaciones de listado.
- Idempotencia en operaciones de escritura sensibles (reintentos de pagos, webhooks).

**Flujos (`FL-XXX`)**
- Disparador difuso («cuando corresponda») o resultado final no verificable.
- Ramas de decisión mencionadas sin criterio («si procede, se aprueba» → ¿quién decide y con qué regla?).
- Comportamiento ante fallo de cada paso externo (timeout de la pasarela, servicio caído): ¿reintento, compensación, aborto?
- Concurrencia u orden: ¿puede el flujo ejecutarse dos veces sobre la misma entidad?

**Diagramas (`DG-XXX`)**
- Tipo no especificado («haz un diagrama» → ¿clases, contexto, contenedores, componentes, estados?).
- Alcance difuso: ¿qué parte de la capability cubre y qué queda explícitamente fuera?
- Sistemas externos o actores mencionados sin la dirección o el propósito de la interacción.
- Tecnologías/protocolos sin confirmar en contenedores o componentes (no asumir el stack).
- Contradicciones con `MD-XXX`/`API-XXX`/`FL-XXX` existentes: ¿el diagrama refleja lo especificado o propone un cambio? Si propone un cambio, confirmarlo antes de dibujar.

Priorizar: preguntar primero lo que **bloquea la implementación** (tipos, contratos, ramas); lo cosmético o diferible puede quedar en Observaciones si el usuario prefiere no detallarlo aún.

---

## Flujo: Crear o actualizar

1. **Resolver capability y destino**
   - Listar `docs/architecture/` y aplicar la validación anterior. Resultado: carpeta existente a actualizar, o nombre kebab-case de la carpeta nueva (validar el nombre con el usuario si hay ambigüedad).
   - **Capability con estructura de una versión anterior del plugin** (un archivo suelto `docs/architecture/[capability].md` sin carpeta, una capability bajo `docs/specs/technical-docs/`, modelos/flujos/diagramas definidos dentro del README, **APIs definidas en el README en vez de en `apis/API-XXX-{slug}.md`**, un `API-XXX` por operación suelta, o APIs sin su ancla explícita): **no migrarla desde aquí** — detenerse, informar el hallazgo y sugerir `/plugin-migrate`, el único dueño de las normalizaciones del catálogo; retomar este flujo cuando la capability esté en la estructura vigente.
2. **Leer lo existente**
   - Si la carpeta existe, leer su `README.md` completo y los archivos de `models/`, `apis/`, `flows/` y `diagrams/`: ids ya usados por tipo (los nuevos continúan la secuencia, estén donde estén), grupos de APIs existentes y las operaciones que ya contienen, elementos equivalentes y Observaciones abiertas. Leer también `wireframes/` si existe — son insumo de UI ya validado (ver [Wireframes](element-standards.md#wireframes-wf-xxx--mismo-estándar-otro-productor)), pero **no se crean ni se editan desde este skill**; al reescribir el README conservar intacta su tabla índice «Wireframes».
   - Revisar la US/TK/WI de origen (si la hay) y el código del repo cuando el elemento describa algo ya implementado — el código existente es fuente, no se contradice sin avisar.
3. **Grilling**
   - Contrastar el input con los estándares y lanzar la(s) tanda(s) de preguntas por las lagunas reales. Con las respuestas (o con las lagunas asumidas como pendientes), continuar.
   - **Sin canal de respuesta disponible** (modo directo en una sesión desatendida/programada, o modo delegado cuyo subagente no puede interactuar): no inventar ninguna respuesta — documentar cada laguna en Observaciones citando el elemento afectado y continuar con lo que sí está confirmado. Mismo criterio en ambos modos; solo cambia dónde queda visible (respuesta final del subagente en delegado, resumen al usuario en directo — ver [Modos de invocación](../SKILL.md#modos-de-invocación) en `SKILL.md`).
4. **Redactar**
   - Capability nueva: crear la carpeta y su `README.md` con `assets/capability-readme-template.md` como molde (Propósito, secciones de elementos que apliquen, Observaciones). `models/`, `flows/` y `diagrams/` se crean solo cuando hay un primer elemento que guardar. No copiar las plantillas al repo del producto; son moldes. Si la carpeta ya existía con solo `README.md` + `wireframes/` (la creó `requirement-refine` o `work-define` por un wireframe), completar ese README con las secciones que apliquen sin tocar la de Wireframes.
   - Cada elemento según su estándar en [`element-standards.md`](element-standards.md), con id siguiente de su secuencia. **Cada modelo, cada grupo de APIs, cada flujo y cada diagrama** va en su propio archivo (`models/MD-XXX-{slug}.md` con `assets/model-template.md`, `apis/API-XXX-{slug}.md` con `assets/api-template.md`, `flows/FL-XXX-{slug}.md` con `assets/flow-template.md`, `diagrams/DG-XXX-{slug}.md` con `assets/diagram-template.md`), nombrado con su id y el slug kebab-case del nombre — fijado al crear el elemento —, **y con su fila en la tabla índice correspondiente del README** enlazando el archivo — crear el elemento y su fila de índice en la misma pasada, nunca uno sin el otro. El README no lleva contratos: es el índice.
   - **Los endpoints se colocan en su grupo:** los que pertenecen a un `API-XXX` existente se añaden a ese archivo (actualizando su tabla de operaciones y la columna «Operaciones» del índice del README, sin cambiar el id del grupo); solo los que no encajan en ninguno abren un grupo nuevo. Dentro del archivo, cada operación lleva su **ancla explícita de método+ruta, sin el prefijo de versión** (`POST /api/v1/projects` → `#post-projects`), en la línea anterior al `###` — obligatoria: es lo que permite a una US/TK/WI citar un endpoint concreto (ver [Por qué el ancla no se deriva del título](element-standards.md#por-qué-el-ancla-no-se-deriva-del-título)).
   - En actualizaciones: no renumerar ids existentes; los elementos obsoletos se marcan `(Obsoleto)`, no se borran mientras tengan consumidores.
   - Lagunas no resueltas → Observaciones, citando el elemento afectado.
5. **Cerrar la capability**
   - Actualizar en el `README.md` la fecha de «Última actualización» (y «Fecha de creación» si la capability es nueva), también cuando el cambio fue solo en `models/`, `apis/`, `flows/` o `diagrams/` — incluido añadir una operación a un grupo de APIs ya existente.
   - Glosario (`docs/glossary.md`): entrada breve si aparecen términos de dominio nuevos.
6. **Enlazar y cerrar**
   - **Modo delegado:** devolver al skill llamador la lista de referencias — para cada elemento: id, título y su referencia ya formada, que es **la ruta de su archivo** (p. ej. `docs/architecture/facturacion/models/MD-003-nota-de-credito.md`, `docs/architecture/facturacion/apis/API-001-facturas.md` o `flows/FL-001-emision-factura.md`); cuando lo que el artefacto consume es un **endpoint concreto**, la ruta del archivo del grupo **con su ancla de operación** (`docs/architecture/facturacion/apis/API-001-facturas.md#post-invoices`) — más las lagunas que quedaron en Observaciones. El skill llamador decide cómo insertarlas en su artefacto. **Nunca devolver un ancla derivada del título** (`#crear-factura`), una ruta al README con ancla de API (`README.md#api-001`, estructura anterior) ni un archivo fuera del estándar `MD-XXX-{slug}` / `API-XXX-{slug}` (`models/factura.md`, sin id; o renombrado tras un cambio de nombre): el llamador los copiaría literalmente y el enlace apuntaría a nada.
   - **Modo directo:** mostrar el resumen de elementos creados/actualizados y, si hay una US/TK/WI relacionada en contexto, **ofrecer** agregar las referencias a su sección Referencias (no editarla sin confirmación). Si quedaron Observaciones, ofrecer las preguntas que las cerrarían.

---

## Modo delegado (invocación desde otro skill)

Cuando `work-define` o `work-plan` delegan mediante subagente:

- **Entrada esperada:** capability (o pista para inferirla), elementos a especificar con todo el contexto que el llamador tenga (texto de la US/TK/WI, reglas de negocio, restricciones), ruta del artefacto de origen e idioma resuelto si el llamador ya lo conoce.
- El flujo es el mismo (validar → leer → grilling → redactar → enlazar). El grilling se dirige al usuario a través de la herramienta de preguntas estructuradas; si el entorno del subagente no permite interacción, **no inventar**: documentar cada laguna en Observaciones y reportarla en la respuesta final.
- **Respuesta final del subagente** (es dato para el llamador, no prosa para el humano):

```
capability: facturacion
carpeta: docs/architecture/facturacion/
elementos:
  - MD-003: Nota de crédito → docs/architecture/facturacion/models/MD-003-nota-de-credito.md
  - API-002: Notas de crédito → docs/architecture/facturacion/apis/API-002-notas-de-credito.md
      · POST /api/v1/credit-notes → docs/architecture/facturacion/apis/API-002-notas-de-credito.md#post-credit-notes
pendientes:
  - API-002 (POST /api/v1/credit-notes): estructura de error estándar sin confirmar (Observaciones)
```

- Este skill **no edita** la US/TK/WI del llamador: entregar las referencias y que el skill dueño del artefacto las inserte, respetando sus propias reglas de formato.

---

## Checklist antes de dar por terminado

**Ubicación y estructura:**

- Una sola carpeta para la capability; nombre kebab-case correcto
- Plantillas respetadas; en el README solo las secciones de elementos que aplican
- El README no contiene contratos de API ni definiciones de modelos, flujos o diagramas: solo propósito, tablas índice y Observaciones; ids secuenciales por tipo sin renumeraciones
- Cada modelo en `models/MD-XXX-{slug}.md`, cada grupo de APIs en `apis/API-XXX-{slug}.md`, cada flujo en `flows/FL-XXX-{slug}.md` y cada diagrama en `diagrams/DG-XXX-{slug}.md` (id + slug fijado al crear), con su fila en la tabla índice del README enlazando el archivo — sin elementos huérfanos
- Cada `API-XXX` agrupa por entidad o funcionalidad: ningún endpoint del mismo recurso quedó en un grupo aparte, y ningún grupo nuevo duplica uno existente
- Cada operación dentro de un archivo de `apis/` lleva su ancla explícita de método+ruta y figura en la tabla de operaciones del grupo
- **Ninguna referencia entregada o escrita usa un ancla derivada del título ni un archivo fuera del estándar**: anclas de operación `#<método-ruta>` y archivos `MD-XXX-{slug}.md` / `API-XXX-{slug}.md` / `FL-XXX-{slug}.md` / `DG-XXX-{slug}.md`
- Si el archivo de APIs ya existía sin anclas, las operaciones tocadas en esta pasada las tienen

**Contenido:**

- Cada elemento cumple su estándar (tipos concretos, responses exhaustivas, ramas cubiertas — ver [`element-standards.md`](element-standards.md))
- Referencias cruzadas por id válidas: ruta relativa al archivo del elemento, más el ancla de operación cuando se cita un endpoint concreto
- Nada inventado: todo dato no confirmado está en Observaciones, no camuflado como definición

**Cierre:**

- Fechas de creación y última actualización al día
- Referencias entregadas (modo delegado) u ofrecidas (modo directo)

---

## Ejemplos

**Ejemplo 1 — Delegación desde work-define**

- *Entrada:* `work-define` está creando la US-012 «emitir nota de crédito», que menciona un modelo y un endpoint nuevos; delega vía subagente con el texto de la US.
- *Comportamiento:* design-define detecta que existe la carpeta `facturacion/`, continúa las secuencias (MD-003, API-002), hace una tanda de grilling (tipos del modelo, códigos de error, a qué grupo pertenece el endpoint), redacta el modelo en `facturacion/models/MD-003-nota-de-credito.md` y el grupo en `facturacion/apis/API-002-notas-de-credito.md` (cada uno con su fila en el índice del README), y devuelve las referencias ya formadas (`facturacion/models/MD-003-nota-de-credito.md`, `facturacion/apis/API-002-notas-de-credito.md#post-credit-notes`). `work-define` las agrega a Referencias de la US tal cual, sin recomponer nada.

**Ejemplo 2 — Detalle solicitado durante planificación**

- *Entrada:* Durante `work-plan`, la TK-021 menciona «el flujo de conciliación» sin especificación; el usuario pide «dame más detalle de ese flujo».
- *Comportamiento:* design-define (vía subagente) pregunta disparador, ramas y manejo de errores; crea `flows/FL-002-conciliacion.md` en la capability correspondiente (con su fila en el índice del README) y devuelve la ruta del archivo para la sección Referencias de la TK.

**Ejemplo 3 — Pedido directo con capability ambigua**

- *Entrada:* «Documenta el modelo de usuario.»
- *Comportamiento:* Hay `autenticacion/` y `perfiles/`; el agente pregunta con opciones a cuál pertenece (o si es una capability nueva) antes de crear nada. Luego grilling de campos y redacción.

**Ejemplo 4 — Elemento ya existente**

- *Entrada:* «Especifica la API de crear factura», pero `facturacion/apis/API-001-facturas.md` ya define `POST /api/v1/invoices`.
- *Comportamiento:* No crea un grupo ni una operación duplicada; muestra la existente y pregunta si desea actualizarla. Los cambios conservan el id del grupo y el ancla de la operación, y actualizan la fecha de última actualización.

**Ejemplo 5 — Endpoint nuevo de un recurso ya documentado**

- *Entrada:* «Documenta el endpoint de archivar proyecto».
- *Comportamiento:* Existe `proyectos/apis/API-001-proyectos.md` con el CRUD del recurso. No abre `API-004`: añade `POST /api/v1/projects/{id}/archive` como una operación más de `API-001`, con su ancla `#post-projects-id-archive`, actualiza la tabla de operaciones del archivo y la columna «Operaciones» del índice del README, y devuelve `proyectos/apis/API-001-proyectos.md#post-projects-id-archive`.

**Ejemplo 6 — Grupo nuevo por funcionalidad**

- *Entrada:* «Especifica login, logout y recuperación de contraseña».
- *Comportamiento:* No son un CRUD de una entidad sino una funcionalidad; ningún grupo existente los cubre. Crea `autenticacion/apis/API-001-autenticacion.md` con las tres operaciones (`POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/forgot-password`), cada una con su ancla, y una fila de índice en el README.

---

## Anti-patrones

- **Narrar el flujo interno**: anunciar que se resuelve el idioma o la política, que se lee `settings.json`, que se carga una referencia, o ir enumerando los pasos en voz alta. Al usuario se le comunica el resultado, las preguntas que el flujo exija y lo que quede pendiente — no la maquinaria.
- Inventar tipos, códigos de error, validaciones o ramas de flujo que nadie confirmó, en lugar de preguntar o dejar la laguna en Observaciones.
- Crear una carpeta por historia de usuario o por tarea: la unidad es la **capability**, precisamente para que varias US/TK/WI consuman los mismos elementos.
- Renumerar o borrar elementos con consumidores; los ids son contratos de enlace.
- Duplicar la tabla de campos de un modelo dentro de una API en vez de referenciar su `MD-XXX`.
- Crear un `API-XXX` por endpoint (`API-001: Crear proyecto`, `API-002: Listar proyectos`) en vez de un grupo por entidad o funcionalidad, o dispersar operaciones del mismo recurso en varios grupos.
- Dejar los contratos de API dentro del `README.md` de la capability: el README es el índice.
- Poner valor de negocio, criterios de aceptación o planes de implementación en el documento técnico: eso pertenece a la US (`work-define`) o a la TK/WI (`work-plan`).
- Crear o modificar ADRs desde este skill; si falta una decisión de arquitectura, sugerirla al usuario y registrar la dependencia en Observaciones.
- En modo delegado, editar directamente la US/TK/WI del llamador en lugar de devolver las referencias.
- Copiar las plantillas de `assets/` al repo del producto en lugar de usarlas como moldes.
- Definir un modelo, un grupo de APIs, un flujo o un diagrama dentro del README (o nombrar su archivo por el título) en vez de crearlo en `models/`/`apis/`/`flows/`/`diagrams/` con el id como nombre y enlazarlo desde el índice.
- Lanzar preguntas como prosa libre existiendo herramienta de preguntas estructuradas, o descubrir lagunas turno a turno en vez de agruparlas en tandas.

---

## Handoffs del ciclo

Posición: **transversal** al pipeline `work-define` → `work-plan` → `work-implement`; produce la referencia técnica que esos skills consumen.

| | |
|--|--|
| **Entrada** | Pedido directo del usuario, o delegación vía subagente desde `work-define` (US que define modelos/APIs/flujos) o `work-plan` (TK/WI con definiciones técnicas sin especificación). |
| **Salida** | Carpeta `docs/architecture/[capability]/` creada o actualizada — `README.md` como índice, y `models/`, `apis/`, `flows/`, `diagrams/` con un archivo por elemento enlazado desde los índices —; lista de referencias ya formadas (ruta de archivo, más ancla de operación cuando se cita un endpoint) entregada al llamador o al usuario. |
| **Hacia work-define / work-plan** | El skill llamador inserta las referencias en la sección Referencias de su artefacto (US, TK o WI). Este skill nunca edita esos artefactos. |
| **Hacia work-implement** | Las TK/WI en Ready referencian los elementos de esta capability como fuente de implementación; la fecha de última actualización del README permite detectar si la capability cambió después de redactada la TK/WI. |
| **Conflicto con la US** | Si al especificar se descubre que la US es inconsistente o incompleta, reportarlo; la corrección de la US se hace con `work-define`, nunca desde aquí. |
