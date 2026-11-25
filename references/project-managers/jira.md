# Integración con Jira — base común (compartida)

Referencia transversal del plugin **SDD Devkit**. Contiene todo lo que es **igual para cualquier skill**
que hable con Jira: activación, configuración, verificación del MCP, clave del issue y número local,
construcción de la URL, límites de formato y el contrato de sincronización. Es el equivalente de
[`azure-devops.md`](azure-devops.md) para el `provider` `jira`: mismo contrato, otros nombres.

Cada skill que integra con Jira conserva su propia `references/jira.md` con **solo su delta**: qué tipo
de issue crea o lee, cómo lo ancla y qué campos usa.

| Skill | Delta |
|-------|-------|
| `work-plan` | Crea `Sub-task` (bajo la historia) para `TK-XXX`, `Task` para todo `WI-XXX` y `Bug` **únicamente** para un incidente `BUG-XXX`; con `sync` **baja** una `Sub-task`/`Task` (→ `TK`/`WI`) o un `Bug` (→ `BUG-XXX`), y con `sync … push` **sube** el documento local — [`skills/work-plan/references/jira.md`](../../skills/work-plan/references/jira.md) |
| `test-define` | Crea el caso de prueba en la **herramienta de pruebas** del proyecto (`testManagement`: Zephyr por defecto), enlazado a la historia; con `sync` **lee** los existentes (por TC o por historia padre), sin escribir. Un módulo por herramienta — [`skills/test-define/references/jira.md`](../../skills/test-define/references/jira.md) |
| `work-research` | **Solo lee**: obtiene, enruta y propaga — [`skills/work-research/references/jira.md`](../../skills/work-research/references/jira.md) |
| `requirement-refine` | **Solo baja**: con `sync <clave>` (o cuando `work-define sync` lo delega) descarga un `Epic` como `RQ-<n>` (instantánea de la épica en `references/`, `work_item` en el frontmatter); sin `push` — [`skills/requirement-refine/references/jira.md`](../../skills/requirement-refine/references/jira.md) |
| `work-define` | Al redactar **no escribe** en Jira (secuencial local). Con `sync <clave>` **baja** una `Story` como `US-<n>` local — la crea si falta, la actualiza si existe, y enlaza su épica como `requirement` (RQ descargado por `requirement-refine`); con `sync … push` **sube** la US local al issue — [`skills/work-define/references/jira.md`](../../skills/work-define/references/jira.md) |

> **Vocabulario.** Los `SKILL.md` y sus flujos hablan de «work item» y de `#id`. En Jira el work item es
> un **issue** y su identificador es la **clave** (`PAG-123`). Donde un flujo acepta `#id`, aquí se
> acepta `PAG-123`, `#123` o `123` (dentro del `project` configurado) y la URL `<host>/browse/PAG-123`.

## Dirección de la sincronización (`sync` y `push`)

`sync` es el **mismo contrato** en los skills que lo ofrecen (`work-define`, `work-plan`, `test-define` y `requirement-refine`), y cada uno enruta al `sync` de otro cuando el tipo del issue no es suyo (`Story` → `work-define`, `Sub-task`/`Task`/`Bug` → `work-plan`, caso de prueba → `test-define`, `Epic` → `requirement-refine`). `requirement-refine` solo ofrece la bajada: no tiene `push`.

| Forma | Dirección | Qué hace |
|-------|-----------|----------|
| `sync <clave \| URL \| <ID local>> […]` (**por defecto**) | **Bajada: Jira → repo** | Lee el issue y **crea** el documento local si no existe o lo **actualiza** si ya existe (diff por sección, se aplica solo lo confirmado, identificadores locales inmutables). **No escribe nada en Jira**: un cambio local que no esté en el tracker se conserva y se señala en el diff, pero no se sube. |
| `sync <ID local \| clave> […] push` (o «sube», «publica», «actualiza en Jira») | **Subida: repo → Jira**, solo a petición explícita | Lee el issue y el documento local, presenta **el diff en sentido inverso** y, con confirmación, escribe en Jira **solo lo confirmado**, con el mismo mapeo de campos que la creación (campo dedicado primero, Descripción como respaldo, mismos encabezados — contrato de reconstrucción íntegra). Si el documento local **no tiene** `work_item`, `push` ofrece **crearlo** en Jira con el tipo que corresponde al artefacto; el documento local **conserva su número** y solo se le añade `work_item`. |

Reglas comunes a ambas direcciones:

- **Nunca sin modificador.** Una clave o una URL suelta no sincroniza en ningún sentido; se pregunta qué se espera.
- **Conflicto** (el issue y el documento cambiaron ambos, o difieren en una misma sección): se muestra sección a sección y el usuario decide cuál prevalece; nunca se resuelve en silencio ni se fusiona texto.
- **`push` nunca cambia la clave, el tipo ni el padre** del issue, ni crea un segundo issue para un documento que ya tiene `work_item`. **El estado no se toca**: ningún skill ejecuta transiciones del flujo de trabajo salvo petición expresa.
- **El número de la clave es el número local** en todo lo que nace de una bajada (ver [La clave de Jira manda](#la-clave-de-jira-manda-sobre-el-secuencial-local)); en un `push` que crea el issue, el número local no cambia.
- **Degradación sin MCP**: la bajada pide el contenido pegado; la subida se limita a mostrar lo que habría que copiar en Jira y lo informa.
- **Archivado**: ni `sync` ni `push` escriben dentro de un documento archivado (Regla 1 de `archive.md`); un `push` de un documento archivado es legítimo (sube lo que hay) si el usuario lo pide.

## Activación y configuración

Esta referencia se lee **únicamente** cuando [`../project-management.md`](../project-management.md)
resolvió la integración como **activada** con `provider: jira`. Ese archivo es la única fuente de la
activación y de los datos de conexión; aquí no se vuelve a resolver nada ni se pregunta al usuario.

| Valor resuelto | Uso en Jira |
|----------------|-------------|
| `host` | URL base del sitio (p. ej. `https://mi-organizacion.atlassian.net`, o la de una instancia Data Center). Construye la URL del issue y, si el MCP lo pide, identifica el sitio. |
| `workspace` | **Sitio u organización** de Atlassian (el subdominio en Cloud). Se usa para elegir el sitio cuando el MCP tiene acceso a varios; nunca se pregunta. |
| `project` | **Clave del proyecto** (p. ej. `PAG`). Es el proyecto donde se crean los issues y el prefijo de sus claves. |
| `testManagement` | **Herramienta de casos de prueba** (`zephyr` por defecto, `issue-type`). Jira no los trae de serie; solo la consume `test-define`, que lee el módulo correspondiente. |

**Sprint, componentes, versión, asignado y etiquetas** no son configurables: omitirlos al crear el issue
y dejar que Jira aplique los valores por defecto del proyecto. Si la pantalla de creación del proyecto
**exige** un campo que el documento no tiene, no inventar el valor: mostrar el campo y preguntar.

Todo el detalle propio de Jira —herramienta MCP, nombres de campos, tipos de issue, límites de formato—
vive en archivos de referencia de Jira; **ni los `SKILL.md` ni sus archivos de flujo o de tipo de plan
deben contener nada específico de Jira**.

## Paso común — Verificar disponibilidad del MCP

Comprobar si existe una herramienta MCP de Jira disponible en el cliente actual (p. ej. el MCP de
Atlassian, `mcp_atlassian_*`, `jira_*` o similar).

- **MCP disponible** → continuar con el flujo específico del skill.
- **MCP no disponible** → **notificar al usuario y continuar**; nunca detener el flujo:

  ```
  ⚠️ El repo está vinculado a Jira pero el MCP no está conectado.
  <qué ocurre en su lugar: se usará ID secuencial local / no puedo leer el issue <clave>>.
  Para habilitar la sincronización, conecta el MCP de Jira desde el menú de herramientas.
  ```

  - Los skills que **crean** artefactos (`work-plan`, `test-define`) continúan con **ID secuencial
    local** (ver [`../artifacts.md`](../artifacts.md#identificadores-y-numeración)).
  - Los skills que **leen** (`work-research`) piden al usuario que aporte el contenido manualmente.

## Casos de prueba: fuera de Jira

Jira no tiene casos de prueba de serie: los gestiona una herramienta aparte, declarada en
`testManagement`. Cómo se crean, se leen y se identifican depende de esa herramienta y vive en los
módulos de `test-define` ([`skills/test-define/references/jira.md`](../../skills/test-define/references/jira.md)).
Para el resto de skills basta con esto:

- Un identificador de **caso de prueba** (con Zephyr, una clave `PAG-T123`; con `issue-type`, un issue del
  tipo de prueba) se enruta a `/test-define sync` o al flujo «Analizar test case» de `work-research`.
- Un `TC-XXX` local lleva en `work_item.system` el nombre de la herramienta (`Zephyr`), no `Jira`, cuando
  el caso no es un issue.
- Si la herramienta de pruebas no está disponible (su MCP no está conectado), los casos de prueba
  degradan por su cuenta; el resto de la integración con Jira sigue funcionando.

## Vínculo con el issue

Cuando el artefacto se sincroniza con Jira, registrar el vínculo en el campo `work_item` del
encabezado del documento local, con la **clave completa**:

```
work_item:
  system: Jira
  id: <clave>          # p. ej. PAG-123
  url: <url-al-issue>
```

Usar la URL que devuelva el MCP, o construirla como `<host>/browse/<clave>`.

## La clave de Jira manda sobre el secuencial local

Cuando el MCP está disponible, el issue **se crea primero en Jira** y la **parte numérica de su clave**
sustituye al secuencial calculado de los archivos locales:

- Formato del nombre: `<PREFIJO>-<n>-[slug]` — **sin padding de ceros** y **sin el prefijo del proyecto**.
  Ejemplo: clave `PAG-1847` → `US-1847-pago-con-tarjeta/`, `TK-1847-modelo-dominio.md`,
  `WI-1847-upgrade-spring-boot/`, `BUG-1847-alta-cliente-acepta-email-invalido/`,
  `TC-1847-login-credenciales-validas-happy.md`, `RQ-1847-pagos-digitales/`.
- **El check de ID disponible se hace igualmente:** verificar que no exista ya `<PREFIJO>-<n>-*` en la
  carpeta destino antes de crear el archivo, con el alcance que define
  [`../artifacts.md`](../artifacts.md#identificadores-y-numeración) para ese prefijo.
- **Issues de otro proyecto.** En Jira el número solo es único **dentro de un proyecto**. Un issue de un
  proyecto distinto del `project` configurado (típico en épicas compartidas) usa igualmente su número,
  pero la comparación de «ya existe» se hace por `work_item.id` (la clave completa): si `<PREFIJO>-<n>-*`
  existe con **otra** clave, **parar y preguntar**; no renumerar ninguno de los dos.

## Límites de formato

- **Resumen (`summary`): máximo 255 caracteres.** Si el título natural del artefacto lo supera, usar una
  versión abreviada que conserve el sentido y **mantener el título completo en el documento local**.
- **Descripción:** Jira Cloud la guarda en ADF (Atlassian Document Format) y Data Center en wiki markup;
  el MCP puede devolverla ya convertida. Al leerla, normalizar a markdown sin perder listas numeradas,
  tablas ni bloques de código; al escribirla, conservar los encabezados del `.md`.
- **Campos personalizados:** se resuelven **por nombre** en el proyecto (p. ej. «Acceptance Criteria»,
  «Story Points»), nunca por un `customfield_NNNNN` escrito a mano: el número cambia en cada instancia.

## Contrato de sincronización: reconstrucción íntegra

El documento local debe poder **reconstruirse completo** a partir del issue si el archivo se pierde.
Por tanto, al crear o actualizar un issue:

1. **Campo dedicado primero.** Si el proyecto tiene un campo específico para una sección (un campo
   «Acceptance Criteria» / «Criterios de aceptación», `environment` para el ambiente de un `Bug`, el campo
   de pasos de la app de pruebas si el MCP lo expone), volcar ahí esa sección.
2. **Descripción como respaldo.** Si el campo dedicado no existe en ese proyecto —lo habitual en Jira,
   que no trae criterios de aceptación ni pasos como campos estándar—, incluir la sección **dentro de
   Descripción** en lugar de omitirla.
3. **Nunca omitir secciones.** El resto del documento va en Descripción, serializado con los **mismos
   encabezados** que el `.md` local, aunque el resultado sea una Descripción larga.
4. **Vinculación al padre: best-effort.** Si no se puede resolver el issue padre, omitir la vinculación
   **sin bloquear** la creación. *(Excepciones: una `Sub-task` no existe sin padre —ver el delta de
   `work-plan`—, y en `test-define` el enlace del caso de prueba a su historia no es opcional.)*

## Los tipos de issue y los estados dependen del proyecto

- **Tipos.** Los nombres son configurables y se traducen (`Story`/`Historia`, `Task`/`Tarea`,
  `Bug`/`Error`, `Sub-task`/`Subtarea`, `Epic`). Identificar el tipo por su **nivel de jerarquía**
  (`issuetype.hierarchyLevel`: `1` épica, `0` estándar, `-1` subtarea) además del nombre. Si el tipo
  devuelto o requerido no encaja con lo esperado, **no adivinar**: mostrárselo al usuario y preguntar.
- **Jerarquía.** Épica → historia/tarea/bug → subtarea. El padre se lee del campo `parent` (o del campo
  «Epic Link» en proyectos antiguos). No hay nivel `Feature`; un nivel por encima de la épica
  (iniciativa) es solo contexto.
- **Estados.** Cada proyecto define su flujo de trabajo, así que el nombre del estado no es fiable:
  usar la **categoría** (`statusCategory`: `To Do`, `In Progress`, `Done`) y, para un issue cerrado, el
  campo `resolution`. El estado **solo orienta** el `status` local; nunca se copia ni se escribe.
- **Relaciones.** Los vínculos entre issues (`issuelinks`) tienen tipo y sentido (`blocks` / `is blocked
  by`, `relates to`, `duplicates`, y `tests` / `is tested by` si hay app de pruebas). Si el tipo de
  vínculo que un delta pide no existe en la instancia, usar `relates to` y decirlo.

## Anti-patrones comunes

- Crear el archivo local con ID secuencial cuando el repo está vinculado a Jira **y** el MCP está
  disponible — siempre crear en Jira primero y usar el número de su clave.
- Guardar en `work_item.id` solo el número, sin el prefijo del proyecto; o usar la clave completa como
  número del archivo (`US-PAG-123`).
- Omitir el campo `work_item` cuando el artefacto fue creado o leído vía MCP.
- Bloquear la creación porque no se pudo vincular el padre — es best-effort (salvo las dos excepciones).
- Ejecutar una transición de estado, asignar el issue, o fijar sprint, componentes o versión sin que el
  usuario lo pida.
- Escribir un `customfield_NNNNN` literal, o dar por existente un campo «Acceptance Criteria» sin
  comprobarlo en el proyecto.
- Usar un resumen de más de 255 caracteres en lugar de una versión abreviada.
- Enviar a Jira solo un resumen y omitir el resto de las secciones del `.md` — rompe la reconstrucción
  íntegra.
- Detener el flujo porque el MCP no está conectado, en vez de degradar a ID secuencial local o a insumos
  aportados por el usuario.
- Poner detalle específico de Jira dentro de un `SKILL.md`.
- Perder la clave en un *handoff* entre skills y provocar un issue duplicado.
