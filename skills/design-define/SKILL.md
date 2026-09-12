---
name: design-define
description: "Crear o actualizar documentación técnica (modelos de datos, APIs/endpoints, flujos/procesos, diagramas de clases/contexto/contenedores/componentes) en docs/architecture/, organizada por capability, para que sirva como referencia de implementación de historias de usuario (US-XXX), tareas técnicas (TK-XXX) y tareas de mantenimiento (WI-XXX). Activar cuando el usuario pida documentar o especificar un modelo, entidad, DTO, contrato de API, endpoint, flujo, proceso técnico o un diagrama (clases, C4, arquitectura de la capability); cuando pida «más detalle» sobre un elemento técnico sin especificación mencionado en una US, TK o WI; o cuando otro skill (work-define, work-plan) delegue la creación de la especificación técnica. También activar con «/design-define», «documento técnico», «technical doc», «especificación técnica» o «diseño técnico», aunque el usuario no nombre la capability."
license: MIT
---

# Skill: Documentación técnica por capability

Guía para **crear o actualizar** la documentación técnica en `docs/architecture/`. Cada **capability** (una capacidad del sistema: facturación, autenticación, catálogo…) tiene su **carpeta** `[capability]/` con un `README.md` que concentra el detalle —propósito, **APIs/endpoints** y **flujos/procesos**— y las subcarpetas `models/` y `diagrams/` con un archivo por **modelo de datos** y por **diagrama** (clases, contexto, contenedores, componentes…), enlazados desde el README. Todos los elementos llevan id identificable (`MD-XX`, `API-XX`, `FL-XX`, `DG-XX`) que las US, TK y WI enlazan como referencia de implementación.

> **Alcance:** este skill produce **especificación técnica**, no documentación funcional ni código. El valor de negocio y los criterios de aceptación viven en la US (`work-define`); el plan de implementación vive en las TK/WI (`work-plan`); las decisiones de arquitectura viven en ADRs (`docs/adr/`, nunca creados desde aquí). Un documento técnico describe **qué forma tienen** los modelos, contratos y flujos — no por qué se eligió una tecnología ni cómo se codifica.

Las plantillas canónicas están en `assets/`: `capability-readme-template.md` (el README de la capability), `model-template.md` (cada archivo de `models/`) y `diagram-template.md` (cada archivo de `diagrams/`) — léelas antes de escribir. Los estándares de cada tipo de elemento están en `references/element-standards.md`.

## Subagente

**Si el proyecto define el subagente `docs-specialist`, ejecutar este skill bajo ese subagente.** Si no existe en el proyecto:

- **Invocación directa por el usuario:** ejecutar el flujo normalmente, sin subagente.
- **Invocación desde otro skill** (`work-define`, `work-plan`): ejecutar este skill bajo un **subagente genérico** (el de propósito general que exponga el cliente). La delegación siempre ocurre en un subagente — con `docs-specialist` si existe, genérico si no — para aislar el contexto del skill llamador y que la respuesta final sea solo las referencias devueltas.

Este skill es frecuentemente **invocado por otros skills mediante un subagente** (`work-define` al detectar que una US define flujos, modelos o APIs; `work-plan` cuando una TK/WI menciona elementos técnicos sin especificación). En ese modo, ver [Modo delegado](#modos-de-invocación).

---

## Mapa de referencias

Carga el archivo correspondiente cuando vayas a ejecutar la tarea; el detalle íntegro vive en `references/`.

| Necesitas… | Archivo |
| ---------- | ------- |
| Flujo paso a paso de **crear** y **actualizar**, grilling de preguntas, validación antes de crear, modo delegado, checklist, ejemplos, anti-patrones y handoffs | [`references/flow.md`](references/flow.md) |
| Estándares de definición de **modelos de datos** (`MD-XX`), **APIs/endpoints** (`API-XX`), **flujos/procesos** (`FL-XX`) y **diagramas** (`DG-XX`: clases, contexto, contenedores, componentes): tablas, diagramas Mermaid, ejemplos | [`references/element-standards.md`](references/element-standards.md) |
| Estructura de la carpeta de capability (README, modelos, diagramas) | `assets/capability-readme-template.md` · `assets/model-template.md` · `assets/diagram-template.md` |


### Referencias compartidas del plugin

Reglas transversales del catálogo; viven en la raíz del plugin, no en este skill.

- [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md): **Idioma** — resolución obligatoria del idioma de artefactos, documentos y mensajes. *Lectura obligatoria antes de ejecutar el skill.*
- [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md): **Artefactos** — rutas del harness, identificadores, archivado. *Al resolver una ruta o calcular un ID.*

---

## Rutas de las referencias compartidas

`${PLUGIN_ROOT}` es la **raíz del plugin instalado** (la carpeta que contiene `skills/`, `agents/` y `references/`), y toda referencia compartida de este skill se escribe como `${PLUGIN_ROOT}/references/<archivo>.md`. Para resolverla, ejecutar `PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-}"; [ -n "$PLUGIN_ROOT" ] && PLUGIN_ROOT="$(cd "$PLUGIN_ROOT" 2>/dev/null && pwd)"; echo "PLUGIN_ROOT=$PLUGIN_ROOT"` — siempre imprime un valor: si trae ruta, usarla; si imprime vacío, usar la carpeta desde la que se cargó este archivo, dos niveles arriba. El destino de cada enlace markdown (`../../references/…`) existe solo para navegar el repositorio en GitHub o en un editor: **no** resolverlo desde el directorio de trabajo. **Nunca buscar `references/` en el proyecto**: un `<proyecto>/references/language.md` que no existe no es un archivo que falte, es una ruta mal resuelta — corregir la raíz y volver a leer, sin preguntar al usuario ni saltarse la lectura.

## Resolución de idioma

Antes de ejecutar este skill, DEBES leer [`${PLUGIN_ROOT}/references/language.md`](../../references/language.md).

Las reglas de `language.md` son obligatorias y tienen prioridad para determinar el idioma de todos los artefactos, documentos y mensajes generados por este skill.

No continúes hasta haber leído y aplicado `language.md`.

**Excepción deliberada:** los nombres de campos, rutas y payloads **no** siguen el idioma resuelto — siguen la convención del código existente (ver [`references/element-standards.md`](references/element-standards.md)).

---

## Ubicación de archivos

Layout completo del harness e identificadores: [`${PLUGIN_ROOT}/references/artifacts.md`](../../references/artifacts.md).

Lo propio de este skill:

| Artefacto | Ruta |
| --------- | ---- |
| Carpeta de capability (**salida**) | `docs/architecture/[capability]/` |
| Detalle de la capability (propósito, APIs, flujos, índices, observaciones) | `docs/architecture/[capability]/README.md` |
| Modelos de datos (un archivo por modelo) | `docs/architecture/[capability]/models/md-XX.md` |
| Diagramas (un archivo por diagrama) | `docs/architecture/[capability]/diagrams/dg-XX.md` |
| Archivos de apoyo (imágenes, esquemas exportados) | `docs/architecture/[capability]/assets/` |
| Glosario (opcional) | `docs/glossary.md` |

### Convenciones

- **Una carpeta por capability.** Si la carpeta de la capability ya existe, se **actualiza** (se añaden o modifican elementos); nunca crear una segunda carpeta para la misma capability.
- Nombre de la carpeta: capability en minúsculas, kebab-case, sin artículos ni palabras vacías. Ejemplos: `facturacion/`, `gestion-recetas/`, `autenticacion/`.
- Cada elemento lleva id secuencial **por tipo**, único en el ámbito de la capability: modelos `MD-01, MD-02, …`; APIs `API-01, API-02, …`; flujos `FL-01, FL-02, …`; diagramas `DG-01, DG-02, …`. No renumerar elementos existentes: los ids son estables porque otras historias y tareas ya pueden enlazarlos.
- **APIs y flujos viven en el `README.md`** como encabezados `###` con el formato `### API-01: Nombre`, precedidos de su **ancla explícita** `<a id="api-01"></a>` en la línea inmediatamente anterior. Su referencia es `docs/architecture/facturacion/README.md#api-01` — **el id en minúsculas, sin el nombre**. Nunca un ancla derivada del título (`#api-01-crear-factura`): depende del renderizador y se rompe al renombrar el elemento. Ver [Por qué el ancla no se deriva del título](references/element-standards.md#por-qué-el-ancla-no-se-deriva-del-título).
- **Modelos y diagramas viven cada uno en su propio archivo**, en `models/` y `diagrams/`, **nombrado por su id en minúsculas** — `models/md-01.md`, `diagrams/dg-02.md` — nunca por el nombre del elemento (misma doctrina que las anclas: el id es estable, el nombre puede cambiar). Su referencia es la ruta del archivo, sin ancla: `docs/architecture/facturacion/models/md-01.md`. El nombre humano vive en el `# {{ID}}: Nombre` del propio archivo y en las **tablas índice** del README («Modelos de datos» y «Diagramas»), que enlazan cada archivo — un modelo o diagrama sin fila en su índice es un elemento huérfano.
- El `README.md` lleva **fecha de creación** y **última actualización** de la capability. Las lagunas abiertas se registran en **Observaciones** del README, citando el elemento afectado esté donde esté.

---

## Modos de invocación

| Modo | Quién invoca | Entrada típica | Salida esperada |
| ---- | ------------ | -------------- | --------------- |
| **Directo** | El usuario | «Documenta el modelo de factura», «especifica la API de pagos», «dame más detalle del flujo de aprobación de la TK-004» | Carpeta de capability creada/actualizada + resumen al usuario + oferta de enlazarla desde la US/TK/WI relacionada |
| **Delegado** | `work-define` o `work-plan` vía subagente | Contexto de la US/TK/WI + los elementos técnicos a especificar | Carpeta creada/actualizada y, **como respuesta final del subagente, la lista de referencias** — para API/FL la ruta del README con ancla `#<id>`; para MD/DG la ruta de su archivo en `models/`/`diagrams/` — para que el skill llamador las agregue a la sección Referencias del artefacto |

En modo delegado, el grilling de preguntas se dirige igualmente al usuario (el subagente hereda la herramienta de preguntas estructuradas); si el entorno no permite preguntar, documentar las lagunas en Observaciones y reportarlas en la respuesta final en lugar de inventar. **En modo directo**, si el entorno tampoco permite preguntar (p. ej. sesión desatendida/programada sin nadie que responda en el momento), aplicar el mismo criterio: no inventar, documentar cada laguna en Observaciones citando el elemento afectado, y destacarlas de forma prominente al principio del resumen final — a diferencia del modo delegado, aquí no hay un skill llamador que las recoja, así que es el propio resumen al usuario el único lugar donde quedan visibles.

---

## Cómo preguntar al usuario (grilling)

Mecanismo, ritmo y fallback compartidos: [`${PLUGIN_ROOT}/references/asking.md`](../../references/asking.md).

Cada vez que este skill o sus referencias digan *preguntar*, *pedir*, *confirmar*, *validar* o *sugerir* algo al usuario, asume ese mecanismo; no se repite allí.

**Recopilación inicial (antes de redactar):** si hay más de tres lagunas, encadenar tandas hasta agotarlas o hasta que el usuario indique que lo restante quede como Observación.

**No repreguntar** lo que ya está respondido en la US/TK/WI de origen o en el documento técnico existente.

El detalle de **qué preguntar por tipo de elemento** (campos sin tipo, códigos de error sin definir, ramas de flujo ambiguas…) está en [`references/flow.md`](references/flow.md#grilling-por-tipo-de-elemento).

---

## Información requerida antes de redactar

**No inventar nada** — si un dato no es explícito ni inferible del repo, preguntar al usuario (o reportarlo como laguna, en cualquier modo, cuando el entorno no permite preguntar — ver [Modos de invocación](#modos-de-invocación)).

| Dato | Cómo obtenerlo | Si no está disponible |
| ---- | -------------- | --------------------- |
| **Capability** a la que pertenece el elemento | Indicada por el usuario/skill llamador, o inferible de la US/TK/WI y de los documentos existentes en `architecture/` | Preguntar; proponer opciones a partir de los documentos existentes antes de crear una capability nueva |
| **Tipo(s) de elemento** (modelo, API, flujo, diagrama) | Del pedido o del contenido de la US/TK/WI | Preguntar |
| **Contenido de cada elemento** (campos, contratos, pasos) | Del input recibido, del código existente del repo, o de la US/TK/WI de origen | Grilling de preguntas; lo irresoluble queda en Observaciones |
| **Artefacto(s) que lo consumirán** (US/TK/WI) | Del contexto o del skill llamador | Opcional en modo directo; si existe, ofrecer enlazar la referencia al terminar |

---

## Flujo (resumen)

El procedimiento completo está en [`references/flow.md`](references/flow.md). Síntesis:

- **Crear/actualizar:** resolver capability → leer la carpeta existente si la hay (README y archivos de `models/` y `diagrams/`) → detectar lagunas y hacer el grilling → redactar con las plantillas de `assets/` y los estándares de `references/element-standards.md`: APIs/flujos en el README, cada modelo y diagrama en su archivo, enlazado desde los índices del README → asignar ids estables → actualizar la fecha de última actualización → glosario si aplica.
- **Enlazar:** en modo delegado, devolver las referencias (`README.md#<id>` para API/FL; ruta del archivo para MD/DG) al skill llamador; en modo directo, ofrecer agregar la referencia a la sección Referencias de la US/TK/WI relacionada.
- **Cierre:** si quedaron lagunas en Observaciones, ofrecerle al usuario las preguntas que las cerrarían (misma mecánica de grilling).

---

## Mensaje al usuario

Solo resultados y lo que el usuario debe saber o decidir. No incluir razonamiento interno ni narración del trabajo en curso («leí la US», «creé el archivo»). Si hay pendientes, listarlos agrupados por elemento (`MD-XX`, `API-XX`, `FL-XX`, `DG-XX`). En modo delegado, la respuesta final del subagente es **datos para el skill llamador** (rutas y anclas `#<id>`), no prosa para el humano.
