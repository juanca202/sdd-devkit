# Archivado de artefactos de especificación (compartida)

Referencia transversal del plugin **SDD Devkit**. Es la **fuente única** de cómo se archiva un artefacto
(`SRS-XXX`, `US-XXX`, `WI-XXX`, `RS-XXX` suelto) y de las dos reglas que el resto del catálogo aplica sobre
lo ya archivado. Los `SKILL.md` la enlazan; no repiten el procedimiento.

> **Notación.** `<archivedPath>` es `specification.archivedPath` de `.sdd-devkit/settings.json` ya
> **resuelto** — por defecto `docs/specs/archived/` si el archivo o la clave no existen — y `<changesPath>`
> es `specification.changesPath` resuelto (por defecto `docs/specs/changes/`). Ver
> [`artifacts.md`](artifacts.md#layout-del-harness). Cualquier ruta literal `docs/specs/archived/…` que
> aparezca en el catálogo es solo el **valor por defecto** de esa notación: el skill lee `settings.json`
> antes de mover, buscar o escanear nada, y nunca asume el literal.

---

## Quién archiva y cuándo

**Archiva el skill que produce el artefacto**, a petición explícita del usuario con el modificador
**`archive <ID>`**. Ningún skill de cierre lo hace: `work-integrate` y `pr-create` **no archivan** —
siempre hay una revisión humana entre integrar y archivar, y ese momento lo elige el equipo, no el merge.

| Artefacto | Skill que archiva | Invocación |
|-----------|-------------------|------------|
| `SRS-XXX` | `requirement-refine` | `/requirement-refine archive SRS-003` · `/requirement-refine SRS-003 archive` |
| `US-XXX` (con sus `TK-XXX`, `test-cases/`, `research/`, `progress.md`, `criteria-coverage.md`, `assets/`) | `work-define` | `/work-define archive US-042` · `/work-define US-042 archive` |
| `WI-XXX` (todos los tipos, `bug` incluido) | `work-plan` | `/work-plan archive WI-007` · `/work-plan WI-007 archive` |
| `RS-XXX` suelto (`<changesPath>/research/`) | `work-research` | `/work-research archive RS-003` · `/work-research RS-003 archive` |

El modificador tiene **dos formas**, y el orden entre `archive` y el ID es indiferente:

| Forma | Alcance |
|-------|---------|
| `archive <ID> [<ID> …]` | **Los artefactos indicados**, estén como estén: el parte de estado informa si alguno está incompleto y se pide **una** confirmación por todo el lote. |
| `archive` (sin ID) | **Todos los artefactos de ese tipo que ya están completos** — la definición de «completo» es la de la tabla de abajo, con **ninguna** señal de incompleto. Los incompletos **no** se incluyen ni se ofrecen: se listan aparte en el reporte con su estado, y quien quiera archivar uno de ellos lo pide por ID. Si no hay ninguno completo, se informa y no se mueve nada. También aquí la confirmación es una sola, mostrando la lista completa. |

Lo que **no** se archiva: los `FT-XXX` (describen el sistema **actual**; si dejan de aplicar se marcan
`Obsolete`), los `TK-XXX`/`TC-XXX` por separado (viajan con su padre), las investigaciones **internas** de
un artefacto (van dentro de su carpeta), los informes de `docs/audits/`, y **cualquier artefacto de un
framework de terceros** (Speckit, OpenSpec, AgentOS…) que viva junto o dentro de la carpeta: se deja
exactamente donde está y se menciona en el reporte como contenido ajeno.

Se admiten varios IDs en una invocación (`archive US-042 US-043`) con **una sola confirmación** que lista
todo lo que se movería. **Sin modificador `archive` nunca se archiva nada**: un ID suelto es la entrada
habitual del skill (actualizar, planificar, sincronizar…).

---

## El estado no restringe, pero se valida y se informa

Archivar **no exige** que el artefacto esté implementado, integrado ni completo: es una decisión del
usuario. Lo que sí exige es que el usuario decida **viendo el estado real**. Antes de preguntar, el skill
lee el artefacto y compone un **parte de estado**:

| Artefacto | Qué se comprueba | Señal de «incompleto» |
|-----------|------------------|-----------------------|
| `SRS-XXX` | `Estado`; tabla «Historias de usuario derivadas» | `Draft`; FR/NFR sin US derivada |
| `US-XXX` | `Estado`; `progress.md` (marca `work:status` y la de cada `TK`); `criteria-coverage.md` (marca `coverage-verify:verdict`); `TK-XXX` en `Draft`; `test-cases/` con TC en `Draft` | `Draft`; sin `progress.md` o con unidades no `Done`; sin cobertura o `REJECTED`; rama `feature/US-XXX-*` aún sin integrar (`git branch --merged <base>` si la base es conocida) |
| `WI-XXX` | `Estado`; `progress.md`; `criteria-coverage.md`; tipo `bug` → línea `Resolución:` | Igual que la US; un `bug` con `Resolución: Abierto` o `En corrección` |
| `RS-XXX` suelto | Referencias vivas desde artefactos **activos** (misma búsqueda que el paso 2 del procedimiento) | ≥ 1 referencia viva |

Un artefacto es **completo** cuando ninguna de esas señales aparece; es el criterio que usa `archive` sin ID
para seleccionar. Con todo completo, el parte dice «completo» y se pide la confirmación igual. Con algo incompleto, el parte
lo enumera **sin juicio** y la pregunta lo hace explícito:

```
US-042 — Exportación CSV
  Estado: Ready · progress.md: TK-002 In Progress, TK-005 Pending · cobertura: sin criteria-coverage.md
  Rama feature/US-042-exportacion-csv: no integrada en develop

  <changesPath>/user-stories/US-042-exportacion-csv/
  → <archivedPath>/user-stories/US-042-exportacion-csv/
  Investigaciones sueltas sin referencias activas:
    RS-003-formatos-csv → <archivedPath>/research/

El trabajo no está completo. ¿Confirmas archivarlo de todos modos?
  Opciones: [Sí, archivar] / [No, dejarlo donde está]
```

Reglas de la confirmación:

- **Siempre se pregunta**, con la herramienta de preguntas estructuradas, mostrando antes exactamente qué
  se movería (carpeta e investigaciones huérfanas). La respuesta es **binaria**: todo lo listado o nada.
- **Sin canal de respuesta** (sesión desatendida): no se archiva y se dice en el reporte.
- Una petición explícita del usuario en el mismo turno («archívalo aunque esté en Draft») no sustituye la
  confirmación: el parte se muestra igual, la pregunta puede ser una sola.
- Un artefacto que **ya está** bajo `<archivedPath>` no es un error: se informa y no se toca nada.
- Nunca insistir tras una negativa ni volver a preguntar en la misma ejecución.

---

## Destinos

`<archivedPath>` espeja **siempre** la estructura de `<changesPath>`. Las subcarpetas no son configurables.

| Artefacto | Origen | Destino |
|-----------|--------|---------|
| Especificación de requisitos | `<changesPath>/requirements/SRS-XXX-{nombre-corto}/` | `<archivedPath>/requirements/SRS-XXX-{nombre-corto}/` |
| Historia de usuario | `<changesPath>/user-stories/US-XXX-{nombre-corto}/` | `<archivedPath>/user-stories/US-XXX-{nombre-corto}/` |
| Tarea de mantenimiento | `<changesPath>/work-items/WI-XXX-{kebab-case}/` | `<archivedPath>/work-items/WI-XXX-{kebab-case}/` |
| Investigación suelta | `<changesPath>/research/RS-XXX-{slug}/` | `<archivedPath>/research/RS-XXX-{slug}/` |

La carpeta se mueve **completa y tal cual**: `README.md`, `TK-XXX-*.md`, `progress.md`,
`test-cases-automation.md`, `criteria-coverage.md`, `test-cases/`, `research/` interno y `assets/`. No se
renombra, no se aplana, no se borra nada de dentro.

---

## Procedimiento

### 1 — Mover la carpeta del artefacto

```bash
mkdir -p "<archivedPath>/<subcarpeta>"
test ! -e "<archivedPath>/<subcarpeta>/<ID>-<slug>" \
  || { echo "el destino ya existe"; exit 1; }
git mv "<changesPath>/<subcarpeta>/<ID>-<slug>" "<archivedPath>/<subcarpeta>/<ID>-<slug>"
```

- **`git mv`, no `mv`**: deja el renombrado stageado y git lo detecta como *rename*, preservando historial.
- **El guard del destino no es adorno.** Un destino ya ocupado es señal de identificador duplicado o de un
  archivado previo incompleto; se para e informa, nunca se pisa.
- Origen inexistente con destino presente → ya estaba archivado: informar y seguir.
- En **multi-repo** las especificaciones viven en el repositorio de especificaciones: el `git mv` se ejecuta
  ahí, nunca en un submódulo.

### 2 — Archivar las investigaciones sueltas que quedan huérfanas

Un `RS-XXX` de `<changesPath>/research/` es compartible. Solo se archiva el que se queda sin ningún
artefacto **activo** que lo referencie:

1. **Recolectar candidatos:** identificadores `RS-XXX` citados en los archivos del artefacto recién movido
   que resuelvan a una carpeta en `<changesPath>/research/`.
2. **Contar referencias vivas** de cada candidato en `<changesPath>` y `<currentPath>`, excluyendo
   `<archivedPath>` y la carpeta del propio RS.
3. **0 referencias** → `git mv` a `<archivedPath>/research/RS-XXX-{slug}/` con el mismo guard; **≥ 1** → se
   queda, y el reporte dice quién lo referencia. Ante la duda (mención en texto libre sin enlace), cuenta
   como viva.

Al archivar un `RS-XXX` **directamente** (`/work-research archive RS-003`), el mismo conteo es el parte de
estado: con referencias vivas se informa y se pide confirmación igual.

### 3 — Reparar los enlaces afectados

Con los valores por defecto la carpeta **conserva su profundidad** (`<changesPath>/user-stories/US-…` →
`<archivedPath>/user-stories/US-…`), así que los enlaces que salen de `docs/specs/`
(`../../../../architecture/…`, `../../../../glossary.md`) siguen funcionando. Se rompen los enlaces **entre
artefactos**:

- **Salientes** — desde la carpeta movida hacia artefactos que **siguen activos**
  (`../../research/RS-001-…`, `../../requirements/SRS-002-…`): repuntarlos a través de `<changesPath>`
  (`../../../changes/research/RS-001-…`). Si `archivedPath` tiene distinta profundidad que
  `changesPath`, ajustar además los niveles de **todos** los enlaces que salen de la carpeta.
- **Entrantes** — desde artefactos activos hacia el recién archivado: repuntarlos a `<archivedPath>/…`. Si
  un artefacto activo depende de forma sustantiva del archivado, mencionarlo en el reporte.

Enlaces absolutos desde la raíz (`docs/specs/...`): actualizar el prefijo.

### 4 — Commitear

El `git mv` queda **stageado sin commitear**. Cerrar invocando **`/git-commit`** sobre esos cambios
(un solo cambio lógico: «archivar <ID>»), salvo que el usuario indique que commitea él. No ejecutar
`git add`/`git commit` directos ni revertir el `git mv` si `git-commit` se detiene: parar e informar.

---

## Reporte al usuario

```
📦 Archivado
   <changesPath>/user-stories/US-042-exportacion-csv/
   → <archivedPath>/user-stories/US-042-exportacion-csv/
   Estado al archivar: incompleto (TK-002 In Progress; sin criteria-coverage.md) — confirmado por el usuario
   Investigaciones sueltas:
     RS-003-formatos-csv → archivada (sin referencias activas)
     RS-007-limites-export → se queda (referenciada por US-051)
```

Omitir el bloque de investigaciones si no hubo. Si no se archivó:

```
📦 Archivado: omitido
   US-042 se queda en <changesPath>/user-stories/ (no confirmado por el usuario | sin canal de respuesta).
```

---

## Contrato para el resto del catálogo

Archivar mueve carpetas que **otros skills resuelven por ruta**. Estas dos reglas las aplica todo el
catálogo — `work-integrate` y `pr-create` incluidos, que ya no archivan pero sí leen — y son independientes.
Ambas resuelven `<archivedPath>` desde `settings.json` **antes** de buscar o escanear; nunca asumen el literal.

### Regla 1 — Fallback de lectura

**Quien busque la carpeta de un `SRS-XXX`, `US-XXX`, `WI-XXX` o `RS-XXX` y no la encuentre en `<changesPath>`
debe mirar en `<archivedPath>` antes de darla por inexistente.**

```
<changesPath>/user-stories/US-042-…/   →  <archivedPath>/user-stories/US-042-…/
<changesPath>/work-items/WI-007-…/     →  <archivedPath>/work-items/WI-007-…/
<changesPath>/research/RS-003-…/       →  <archivedPath>/research/RS-003-…/
<changesPath>/requirements/SRS-003-…/  →  <archivedPath>/requirements/SRS-003-…/
```

Lo que se encuentra ahí es un artefacto **archivado por decisión del usuario** — no necesariamente completo,
porque el estado no restringe el archivado. **Leerlo es siempre legítimo** (consulta, contexto, historial).
**Escribir dentro no lo es**: un skill que iba a añadir un `TK-XXX`, un `TC-XXX`, editar el `README.md` o
regenerar el `progress.md` **para y avisa**: «`US-042` está archivado; para retomarlo hay que
desarchivarlo primero». Desarchivar es mover la carpeta de vuelta a `<changesPath>` — decisión del usuario.

> **Nunca crear la carpeta en la ruta activa porque «no estaba».** Deja dos carpetas con el mismo
> identificador y el guard de destino lo descubre mucho después.

#### Las dos únicas excepciones a la prohibición de escribir

| Quién | Qué puede escribir | Por qué |
|-------|--------------------|---------|
| **`coverage-verify`** | Su `criteria-coverage.md`, dentro de la carpeta del artefacto | Es un **derivado** del artefacto, no trabajo nuevo; revalidar la cobertura de algo archivado es una consulta. |
| **`work-implement` en [modo corrección](../skills/work-implement/SKILL.md#modo-correccion-delegado-desde-quality-check)** | **Nada dentro de la carpeta.** Continúa el flujo en vez de parar; la nota de retrabajo va al informe de `quality-check`. | La corrección llega en el cierre, cuando el archivado puede haber ocurrido. |

> **Efecto sobre `coverage-verify`.** Su `SPEC_FINGERPRINT` incluye las rutas de la carpeta; el `git mv`
> las cambia, así que el `criteria-coverage.md` previo se regenera **una vez** tras archivar. Coste conocido.

**Estar en `<changesPath>` no significa «abierto».** Un trabajo integrado puede seguir allí hasta que
alguien lo archive; quien necesite saber si está cerrado mira su `progress.md`, su cobertura y su
historial, no su ubicación.

### Regla 2 — Los IDs archivados siguen ocupados

**Todo escaneo de «siguiente número libre» o «este ID está disponible» cubre `<changesPath>` y
`<archivedPath>`.** Un identificador no se libera al archivarse.

| Contador | Dónde se escanea | Skill |
|----------|------------------|-------|
| `SRS-XXX` | `<changesPath>/requirements/` **+** `<archivedPath>/requirements/` | `requirement-refine` |
| `US-XXX` | `<changesPath>/user-stories/` **+** `<archivedPath>/user-stories/` | `work-define` |
| `WI-XXX` | `<changesPath>/work-items/` **+** `<archivedPath>/work-items/` | `work-plan` |
| `RS-XXX` | `<changesPath>/research/` **+** `<archivedPath>/research/`, y el `research/` del artefacto | `work-research` |
| `TK-XXX` | El `US-XXX-…/` del padre | `work-plan` |
| `TC-XXX` | El `test-cases/` del padre | `test-define` |

`TK` y `TC` son por artefacto padre: si el padre está archivado, la Regla 1 ya obligó a parar. Lo que hay
que evitar es dar por vacía la ruta activa sin comprobar el archivo y **restablecer la numeración en `001`**.

---

## Anti-patrones

- Archivar desde `work-integrate` o `pr-create`, u ofrecerlo allí: el archivado es del skill que produce el
  artefacto y ocurre cuando el usuario lo pide.
- Archivar **sin preguntar**, o preguntar **sin mostrar** el parte de estado y lo que se movería.
- Incluir artefactos incompletos en un `archive` sin ID, o archivar por un ID suelto sin el modificador.
- **Negarse a archivar** porque el artefacto está en `Draft` o sin implementar: el estado se informa, no
  bloquea. Lo contrario también: archivar algo incompleto sin decirlo.
- Archivar por defecto sin canal de respuesta.
- Usar `mv` en vez de `git mv`; sobrescribir un destino existente; borrar, aplanar o comprimir la carpeta.
- Archivar un `RS-XXX` suelto que un artefacto activo aún referencia, sin informarlo.
- Arrastrar artefactos de frameworks de terceros al archivado.
- Archivar un `FT-XXX`, un `TK-XXX` o un `TC-XXX` sueltos.
- Asumir `docs/specs/archived/` como literal en vez de resolver `specification.archivedPath`.
- Commitear el `git mv` con `git add`/`git commit` directos en vez de `git-commit`.
