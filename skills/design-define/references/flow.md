# Flujo detallado, grilling, ejemplos y anti-patrones

Procedimiento paso a paso para **crear** y **actualizar** la carpeta técnica de una capability, el detalle del **grilling** por tipo de elemento, el **modo delegado**, checklist, ejemplos y handoffs. Los estándares de contenido por tipo viven en [`element-standards.md`](element-standards.md); la estructura, en las plantillas de `assets/` (`capability-readme-template.md`, `model-template.md`, `diagram-template.md`).

---

## Validación antes de crear o editar

Antes de tocar archivos, verificar. Si algo falla, **no crear** — informar y resolver primero.

- **Capability resuelta:** listar las carpetas existentes en `docs/architecture/`. Si el elemento pedido encaja en una capability existente, el destino es **esa carpeta** (actualizar), aunque el usuario no la haya nombrado. Crear una capability nueva solo si ninguna existente cubre el dominio del elemento; ante la duda, preguntar mostrando las capabilities existentes como opciones.
- **Duplicado de elemento:** si la capability ya define un elemento equivalente (en el README o en `models/`/`diagrams/`) (mismo modelo, misma operación, mismo flujo), no crear uno nuevo: proponer **actualizar** el existente conservando su id. Dos ids para la misma cosa rompen las referencias de los consumidores.
- **Conflicto con la fuente:** si lo pedido contradice la US/TK/WI de origen o el código existente del repo, parar y reportarlo (al usuario en modo directo; en la respuesta final en modo delegado). La US prevalece sobre los documentos derivados; el documento técnico no se usa para «corregir» la historia por la puerta de atrás.

---

## Grilling por tipo de elemento

El objetivo del grilling es que el documento sea **referencia de implementación suficiente**: quien implemente la TK no debería tener que adivinar nada que este documento pudo haber fijado. Antes de redactar, contrastar el input recibido con lo que exige el estándar de cada tipo ([`element-standards.md`](element-standards.md)) y preguntar **solo las lagunas reales** — lo que ya está en el input, en el repo o en la US/TK/WI no se repregunta. Mecánica de tandas y formato de preguntas: sección «Cómo preguntar al usuario» del `SKILL.md`.

Lagunas típicas por tipo — usar como lista de contraste, no como cuestionario fijo:

**Modelos (`MD-XX`)**
- Campos mencionados sin tipo concreto, o tipos ambiguos («número» → ¿entero, decimal, precisión?).
- Obligatoriedad no declarada, u obligatoriedad condicional sospechada pero no confirmada.
- Enums sin lista cerrada de valores; identificadores sin formato (¿UUID, secuencial, código de negocio?).
- Relaciones implícitas («la factura tiene líneas») sin cardinalidad ni dirección.
- ¿Entidad persistida o DTO? Si el input no lo aclara y cambia las validaciones, preguntar.

**APIs (`API-XX`)**
- Ruta o método no especificados; versión del API si el proyecto versiona.
- Autenticación/permisos ausentes (nunca asumir «pública» por omisión).
- Errores: ¿qué condiciones de negocio devuelven error y con qué código? ¿Existe estructura de error estándar en el proyecto?
- Paginación, ordenación o filtros en operaciones de listado.
- Idempotencia en operaciones de escritura sensibles (reintentos de pagos, webhooks).

**Flujos (`FL-XX`)**
- Disparador difuso («cuando corresponda») o resultado final no verificable.
- Ramas de decisión mencionadas sin criterio («si procede, se aprueba» → ¿quién decide y con qué regla?).
- Comportamiento ante fallo de cada paso externo (timeout de la pasarela, servicio caído): ¿reintento, compensación, aborto?
- Concurrencia u orden: ¿puede el flujo ejecutarse dos veces sobre la misma entidad?

**Diagramas (`DG-XX`)**
- Tipo no especificado («haz un diagrama» → ¿clases, contexto, contenedores, componentes, estados?).
- Alcance difuso: ¿qué parte de la capability cubre y qué queda explícitamente fuera?
- Sistemas externos o actores mencionados sin la dirección o el propósito de la interacción.
- Tecnologías/protocolos sin confirmar en contenedores o componentes (no asumir el stack).
- Contradicciones con `MD-XX`/`API-XX`/`FL-XX` existentes: ¿el diagrama refleja lo especificado o propone un cambio? Si propone un cambio, confirmarlo antes de dibujar.

Priorizar: preguntar primero lo que **bloquea la implementación** (tipos, contratos, ramas); lo cosmético o diferible puede quedar en Observaciones si el usuario prefiere no detallarlo aún.

---

## Flujo: Crear o actualizar

1. **Resolver capability y destino**
   - Listar `docs/architecture/` y aplicar la validación anterior. Resultado: carpeta existente a actualizar, o nombre kebab-case de la carpeta nueva (validar el nombre con el usuario si hay ambigüedad).
   - **Capability en formato preexistente** (un archivo suelto `docs/architecture/[capability].md` sin carpeta, o una capability bajo la ruta antigua `docs/specs/technical-docs/`): migrarla a la carpeta `docs/architecture/[capability]/` en esta misma pasada — mover el detalle a `[capability]/README.md`, extraer cada modelo y diagrama a su archivo en `models/`/`diagrams/` conservando ids, y avisar en el resumen final que las rutas de las referencias existentes cambiaron, listando el mapeo viejo → nuevo para que el usuario actualice los artefactos que las citan.
2. **Leer lo existente**
   - Si la carpeta existe, leer su `README.md` completo y los archivos de `models/` y `diagrams/`: ids ya usados por tipo (los nuevos continúan la secuencia, estén donde estén), elementos equivalentes y Observaciones abiertas.
   - Revisar la US/TK/WI de origen (si la hay) y el código del repo cuando el elemento describa algo ya implementado — el código existente es fuente, no se contradice sin avisar.
3. **Grilling**
   - Contrastar el input con los estándares y lanzar la(s) tanda(s) de preguntas por las lagunas reales. Con las respuestas (o con las lagunas asumidas como pendientes), continuar.
   - **Sin canal de respuesta disponible** (modo directo en una sesión desatendida/programada, o modo delegado cuyo subagente no puede interactuar): no inventar ninguna respuesta — documentar cada laguna en Observaciones citando el elemento afectado y continuar con lo que sí está confirmado. Mismo criterio en ambos modos; solo cambia dónde queda visible (respuesta final del subagente en delegado, resumen al usuario en directo — ver [Modos de invocación](../SKILL.md#modos-de-invocación) en `SKILL.md`).
4. **Redactar**
   - Capability nueva: crear la carpeta y su `README.md` con `assets/capability-readme-template.md` como molde (Propósito, secciones de elementos que apliquen, Observaciones). `models/` y `diagrams/` se crean solo cuando hay un primer elemento que guardar. No copiar las plantillas al repo del producto; son moldes.
   - Cada elemento según su estándar en [`element-standards.md`](element-standards.md), con id siguiente de su secuencia. **APIs y flujos** van en el README como `### ID: Nombre` con **ancla explícita `<a id="<id-en-minúsculas>"></a>` en la línea anterior** — obligatoria: es el contrato de enlace con las US/TK/WI (ver [Por qué el ancla no se deriva del título](element-standards.md#por-qué-el-ancla-no-se-deriva-del-título)). **Cada modelo y cada diagrama** va en su propio archivo (`models/md-XX.md` con `assets/model-template.md`, `diagrams/dg-XX.md` con `assets/diagram-template.md`), nombrado por su id en minúsculas, **y con su fila en la tabla índice correspondiente del README** enlazando el archivo — crear el elemento y su fila de índice en la misma pasada, nunca uno sin el otro.
   - En actualizaciones: no renumerar ids existentes; los elementos obsoletos se marcan `(Obsoleto)`, no se borran mientras tengan consumidores.
   - **Al actualizar un README cuyos elementos no tienen ancla, añadir la que falte a los que se toquen** (los que se crean o modifican en esta pasada). No hace falta un barrido del documento completo, pero sí dejar anclado todo lo que se edite: un elemento modificado cuya referencia se devuelve al llamador tiene que ser enlazable. Si al hacerlo se detecta que otros elementos del README siguen sin ancla, mencionarlo en el resumen final para que el usuario decida si completarlos.
   - Lagunas no resueltas → Observaciones, citando el elemento afectado.
5. **Cerrar la capability**
   - Actualizar en el `README.md` la fecha de «Última actualización» (y «Fecha de creación» si la capability es nueva), también cuando el cambio fue solo en `models/` o `diagrams/`.
   - Glosario (`docs/glossary.md`): entrada breve si aparecen términos de dominio nuevos.
6. **Enlazar y cerrar**
   - **Modo delegado:** devolver al skill llamador la lista de referencias — para cada elemento: id, título y su referencia ya formada: para API/FL, la ruta del README con ancla **siempre `#<id en minúsculas>`** (p. ej. `docs/architecture/facturacion/README.md#api-01`); para MD/DG, la ruta de su archivo (p. ej. `docs/architecture/facturacion/models/md-03.md`) — más las lagunas que quedaron en Observaciones. El skill llamador decide cómo insertarlas en su artefacto. **Nunca devolver un ancla derivada del título** (`#api-01-crear-factura`) ni un nombre de archivo derivado del título (`models/factura.md`): el llamador los copiaría literalmente y el enlace apuntaría a nada.
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
  - MD-03: Nota de crédito → docs/architecture/facturacion/models/md-03.md
  - API-04: Emitir nota de crédito → docs/architecture/facturacion/README.md#api-04
pendientes:
  - API-04: estructura de error estándar sin confirmar (Observaciones)
```

- Este skill **no edita** la US/TK/WI del llamador: entregar las referencias y que el skill dueño del artefacto las inserte, respetando sus propias reglas de formato.

---

## Checklist antes de dar por terminado

**Ubicación y estructura:**

- Una sola carpeta para la capability; nombre kebab-case correcto
- Plantillas respetadas; en el README solo las secciones de elementos que aplican
- APIs/flujos en el README como `### ID: Nombre`, cada uno precedido de su ancla explícita `<a id="<id>"></a>`; ids secuenciales por tipo sin renumeraciones
- Cada modelo en `models/<id>.md` y cada diagrama en `diagrams/<id>.md` (archivo nombrado por el id en minúsculas), con su fila en la tabla índice del README enlazando el archivo — sin elementos huérfanos
- **Ninguna referencia entregada o escrita usa un ancla o un nombre de archivo derivados del título**: anclas `#<id en minúsculas>` y archivos `<id>.md`
- Si el README ya existía sin anclas, los elementos tocados en esta pasada las tienen

**Contenido:**

- Cada elemento cumple su estándar (tipos concretos, responses exhaustivas, ramas cubiertas — ver [`element-standards.md`](element-standards.md))
- Referencias cruzadas por id válidas: ancla local `#<id>` dentro de la capability, ruta relativa + `#<id>` entre capabilities
- Nada inventado: todo dato no confirmado está en Observaciones, no camuflado como definición

**Cierre:**

- Fechas de creación y última actualización al día
- Referencias entregadas (modo delegado) u ofrecidas (modo directo)

---

## Ejemplos

**Ejemplo 1 — Delegación desde work-define**

- *Entrada:* `work-define` está creando la US-012 «emitir nota de crédito», que menciona un modelo y un endpoint nuevos; delega vía subagente con el texto de la US.
- *Comportamiento:* design-define detecta que existe la carpeta `facturacion/`, continúa las secuencias (MD-03, API-04), hace una tanda de grilling (tipos del modelo, códigos de error), redacta el modelo en `facturacion/models/md-03.md` (con su fila en el índice del README) y la API en el README, y devuelve las referencias ya formadas (`facturacion/models/md-03.md`, `facturacion/README.md#api-04`). `work-define` las agrega a Referencias de la US tal cual, sin recomponer nada.

**Ejemplo 2 — Detalle solicitado durante planificación**

- *Entrada:* Durante `work-plan`, la TK-021 menciona «el flujo de conciliación» sin especificación; el usuario pide «dame más detalle de ese flujo».
- *Comportamiento:* design-define (vía subagente) pregunta disparador, ramas y manejo de errores; crea `FL-02` en la capability correspondiente y devuelve la referencia para la sección Referencias de la TK.

**Ejemplo 3 — Pedido directo con capability ambigua**

- *Entrada:* «Documenta el modelo de usuario.»
- *Comportamiento:* Hay `autenticacion/` y `perfiles/`; el agente pregunta con opciones a cuál pertenece (o si es una capability nueva) antes de crear nada. Luego grilling de campos y redacción.

**Ejemplo 4 — Elemento ya existente**

- *Entrada:* «Especifica la API de crear factura», pero el README de `facturacion/` ya tiene `API-01: Crear factura`.
- *Comportamiento:* No crea `API-05` duplicado; muestra el existente y pregunta si desea actualizarlo. Los cambios conservan el id y actualizan la fecha de última actualización.

---

## Anti-patrones

- **Narrar el flujo interno**: anunciar que se resuelve el idioma o la política, que se lee `settings.json`, que se carga una referencia, o ir enumerando los pasos en voz alta. Al usuario se le comunica el resultado, las preguntas que el flujo exija y lo que quede pendiente — no la maquinaria.
- Inventar tipos, códigos de error, validaciones o ramas de flujo que nadie confirmó, en lugar de preguntar o dejar la laguna en Observaciones.
- Crear una carpeta por historia de usuario o por tarea: la unidad es la **capability**, precisamente para que varias US/TK/WI consuman los mismos elementos.
- Renumerar o borrar elementos con consumidores; los ids son contratos de enlace.
- Duplicar la tabla de campos de un modelo dentro de una API en vez de referenciar su `MD-XX`.
- Poner valor de negocio, criterios de aceptación o planes de implementación en el documento técnico: eso pertenece a la US (`work-define`) o a la TK/WI (`work-plan`).
- Crear o modificar ADRs desde este skill; si falta una decisión de arquitectura, sugerirla al usuario y registrar la dependencia en Observaciones.
- En modo delegado, editar directamente la US/TK/WI del llamador en lugar de devolver las referencias.
- Copiar las plantillas de `assets/` al repo del producto en lugar de usarlas como moldes.
- Definir un modelo o un diagrama dentro del README (o nombrar su archivo por el título) en vez de crearlo en `models/`/`diagrams/` con el id como nombre y enlazarlo desde el índice.
- Lanzar preguntas como prosa libre existiendo herramienta de preguntas estructuradas, o descubrir lagunas turno a turno en vez de agruparlas en tandas.

---

## Handoffs del ciclo

Posición: **transversal** al pipeline `work-define` → `work-plan` → `work-implement`; produce la referencia técnica que esos skills consumen.

| | |
|--|--|
| **Entrada** | Pedido directo del usuario, o delegación vía subagente desde `work-define` (US que define modelos/APIs/flujos) o `work-plan` (TK/WI con definiciones técnicas sin especificación). |
| **Salida** | Carpeta `docs/architecture/[capability]/` creada o actualizada — `README.md` con APIs/flujos anclados por `#<id>`, `models/` y `diagrams/` con un archivo por elemento enlazado desde los índices —; lista de referencias ya formadas (README con ancla, o ruta de archivo) entregada al llamador o al usuario. |
| **Hacia work-define / work-plan** | El skill llamador inserta las referencias en la sección Referencias de su artefacto (US, TK o WI). Este skill nunca edita esos artefactos. |
| **Hacia work-implement** | Las TK/WI en Ready referencian los elementos de esta capability como fuente de implementación; la fecha de última actualización del README permite detectar si la capability cambió después de redactada la TK/WI. |
| **Conflicto con la US** | Si al especificar se descubre que la US es inconsistente o incompleta, reportarlo; la corrección de la US se hace con `work-define`, nunca desde aquí. |
