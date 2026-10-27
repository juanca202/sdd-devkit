# Resolución de la política de implementación

> **Ejecutar este bloque con Bash — no leerlo como prosa ni reimplementar su lógica a mano.** Es un
> script, no una explicación: correrlo y usar literalmente lo que imprime como la política ya resuelta.
> Razonar a mano sobre `.sdd-devkit/settings.json` en su lugar —aunque se llegue a la misma
> conclusión— reintroduce el margen de error de interpretación que el script existe para eliminar.

```!
node -e "
const fs = require('fs');
const path = require('path');

// settings.json es UNICO por solucion: vive solo en la raiz principal (repo unico, o repo de
// especificaciones en multi-repo), nunca dentro de un submodulo. Se localiza subiendo desde el cwd;
// si aparece mas de uno, gana el mas alto y se advierte del sobrante.
const settingsPath = (() => {
  const found = [];
  let dir = process.cwd();
  for (;;) {
    const candidate = path.join(dir, '.sdd-devkit', 'settings.json');
    if (fs.existsSync(candidate)) found.push(candidate);
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (found.length > 1) {
    console.log('ADVERTENCIA: hay mas de un .sdd-devkit/settings.json (' + found.join(' , ') + '). Solo es valido el de la raiz principal: ' + found[found.length - 1] + '. Los que estan dentro de submodulos deben eliminarse y no referenciarse.');
  }
  return found.length ? found[found.length - 1] : path.join(process.cwd(), '.sdd-devkit', 'settings.json');
})();

let impl = null;
if (fs.existsSync(settingsPath)) {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings && settings.implementation) impl = settings.implementation;
  } catch (e) {}
}

if (impl) {
  const confirm = impl.confirmByUnit;
  const uncommitted = impl.uncommittedChanges;
  const tree = impl.workTree;
  const treePath = impl.workTreePath;
  const max = impl.maxParallel === undefined ? 3 : impl.maxParallel;
  const handoff = impl.handoff;
  const scope = impl.scope || 'code';

  console.log('Politica de implementacion resuelta desde .sdd-devkit/settings.json:');

  if (confirm === 'never') {
    console.log('- confirmByUnit = never -> **NO pausar entre unidades**. No pedir confirmacion al terminar cada unidad: encadenar la siguiente. La confirmacion del plan de ejecucion inicial sigue siendo obligatoria.');
  } else {
    console.log('- confirmByUnit = always -> **una unidad por confirmacion**. Al terminar cada unidad, esperar confirmacion explicita del usuario antes de arrancar la siguiente.');
  }

  if (uncommitted === 'commit') {
    console.log('- uncommittedChanges = commit -> si hay cambios sin commitear al iniciar (o reanudar) la sesion, comitearlos primero (invocando git-commit) y continuar. No preguntar.');
  } else if (uncommitted === 'stash') {
    console.log('- uncommittedChanges = stash -> si hay cambios sin commitear al iniciar (o reanudar) la sesion, guardarlos con git stash (mensaje que identifique el motivo) y continuar. No preguntar. Avisar al usuario que quedaron en el stash.');
  } else {
    console.log('- uncommittedChanges = ask -> si hay cambios sin commitear al iniciar (o reanudar) la sesion, parar e informar al usuario; resolverlo antes de continuar (comitear, descartar o guardar en stash, segun decida).');
  }

  if (tree === 'always') {
    console.log('- workTree = always -> cada unidad se implementa en su propio git worktree. No preguntar. Primero se resuelve uncommittedChanges sobre el arbol principal (si hay cambios sin commitear) y, a partir de ahi, **el arbol principal no se toca**: ni checkout/switch a la rama del artefacto, ni merges en el. La rama del artefacto se crea y se usa desde su propio worktree; la rama del arbol principal es la misma al empezar y al terminar.');
  } else if (tree === 'never') {
    console.log('- workTree = never -> trabajar siempre en el arbol principal. No crear worktrees ni ofrecerlos.');
  } else {
    console.log('- workTree = ask -> preguntar UNA sola vez, al inicio de la ejecucion, si usar worktrees; aplicar la respuesta a todas las unidades.');
  }

  console.log('- workTreePath = ' + (treePath || '.worktrees/ (valor por defecto)') + ' -> raiz donde crear los worktrees, **relativa a la raiz del repositorio de codigo afectado** (si no es absoluta). Repo unico/monorepo: el repo principal. Multi-repo: CADA submodulo que la unidad toca, uno por repositorio afectado; el repositorio de especificaciones NUNCA se clona en un worktree.');

  if (max === -1) {
    console.log('- maxParallel = -1 -> sin limite de subagentes concurrentes.');
  } else {
    console.log('- maxParallel = ' + max + ' -> maximo ' + max + ' subagentes en paralelo. Si una ola tiene mas unidades independientes, despacharlas en lotes de ese tamano; al liberarse un cupo, entra la siguiente.');
  }


  if (handoff === 'always') {
    console.log('- handoff = always -> al cerrar el alcance implementado, invocar directamente el siguiente skill del ciclo (el primero de los handoffs salientes que aplique) sin presentar el menu de opciones.');
  } else {
    console.log('- handoff = ask -> al cerrar el alcance implementado, presentar las opciones de cierre con la herramienta de preguntas estructuradas y esperar la eleccion del usuario.');
  }

  if (scope === 'tests') {
    console.log('- scope = tests -> **sistema bajo prueba externo**: este repositorio contiene solo pruebas contra una aplicacion desplegada cuyo codigo NO esta aqui. Solo aplican los tipos TC-XXX y FT-XXX de work-implement (un TK/WI no se implementa en este repo). Reglas del modo: no hay codigo de produccion que corregir (una prueba en rojo contra el sistema es un hallazgo: se queda en rojo, nunca se marca skip/todo/fixme ni se corrige, y quality-check NO la ejecuta ni la cuenta en su veredicto — solo audita tipado, lint, build y unit del codigo propio del repo; coverage-verify lee su ejecucion de test-cases-automation.md), URLs y credenciales salen del .env via el modulo de configuracion del proyecto, no se crea ni se toca progress.md (el registro va a test-cases-automation.md del padre), la unidad de confirmacion y de commit es el ARTEFACTO PADRE (US/WI/FT) completo y no cada TC (varios padres => un commit por padre), y las e2e/API se ejecutan aisladas en cada iteracion. El modo afecta a TODO el catalogo, no solo a work-implement: no se disena ni implementa codigo funcional, work-define no crea TK, work-plan solo registra incidentes BUG-XXX (nunca WI), coverage-verify NO es puerta de cierre y pr-create / work-integrate NO lo invocan (se reporta N/A por politica; solo corre si el usuario lo pide a mano, como informe de cobertura AC<->TC del sistema bajo prueba), quality-check y code-review auditan solo el codigo propio del repo, y cualquier wireframe, diseno o documento de arquitectura del sistema bajo prueba se SOLICITA al usuario y se documenta tal cual, nunca se disena. Ver la seccion **Modo pruebas — contrato para el catalogo** de esta referencia y work-implement/references/test-cases.md § Modo pruebas.');
  } else {
    console.log('- scope = code -> el codigo bajo prueba vive en este repositorio (comportamiento por defecto). Sin cambios respecto al flujo habitual.');
  }
} else {
  console.log('No hay .sdd-devkit/settings.json con bloque \\'implementation\\'. Aplicar los valores por defecto del catalogo:');
  console.log('- **confirmByUnit = always**: una unidad por confirmacion; esperar confirmacion explicita entre unidades.');
  console.log('- **uncommittedChanges = ask**: parar e informar si hay cambios sin commitear al iniciar o reanudar.');
  console.log('- **workTree = ask**: preguntar una sola vez, al inicio, si usar worktrees (con respuesta afirmativa: primero uncommittedChanges sobre el arbol principal, y despues ya no se toca — ni checkout ni merges en el).');
  console.log('- **workTreePath = .worktrees/**: worktrees bajo .worktrees/ de la raiz del repositorio de codigo afectado (en multi-repo, de cada submodulo afectado; nunca del repositorio de especificaciones).');
  console.log('- **maxParallel = 3**: hasta 3 subagentes concurrentes.');
  console.log('- **handoff = ask**: presentar las opciones de cierre y esperar la eleccion del usuario.');
  console.log('- **scope = code**: el codigo bajo prueba vive en este repositorio. Si el repositorio NO tiene codigo de aplicacion y su .env o .env.example declara BASE_URL o API_BASE_URL, ver la deteccion de respaldo de la nota **Modo pruebas** de esta referencia antes de asumirlo.');
  console.log('**No decidir estos valores por cuenta propia** ni ofrecer escribirlos: arch-init es quien crea el archivo.');
}
"
```

> **Raíz del worktree: siempre el repositorio de código afectado, nunca el de especificaciones.**
> `implementation.workTreePath` (por defecto `.worktrees/`) es **relativa a la raíz del repositorio que se
> va a modificar**, no al directorio desde el que se invoca el skill ni a la raíz de la solución:
>
> - **Repo único / monorepo:** el repositorio principal es el afectado; el worktree se crea bajo
>   `<raíz-del-repo>/<workTreePath>/<artefacto>`.
> - **Multi-repo (repo de especificaciones + submódulos):** el afectado es **cada submódulo** que la unidad
>   toca (campo `Repositorio` del `TK-XXX`/`WI-XXX`; para `TC-XXX`/`FT-XXX`, el del artefacto padre). El
>   worktree se crea **desde ese submódulo** — `git -C <submódulo> worktree add <submódulo>/<workTreePath>/<artefacto> …` —,
>   uno por cada repositorio afectado si la unidad toca varios. El repositorio de especificaciones **nunca
>   se clona en un worktree**: sus artefactos (`README.md`, `TK-XXX`, `progress.md`, `test-cases-automation.md`)
>   se editan directamente en su árbol y se commitean allí por separado.
> - Una ruta **absoluta** en `workTreePath` se usa tal cual, pero sigue creándose un worktree por repositorio
>   afectado (`<workTreePath>/<repo>/<artefacto>`), nunca uno de la solución completa.

> **Una peticion explicita del usuario gana.** Si en el turno el usuario pide algo incompatible con lo
> resuelto ("de corrido", "sin preguntar", "una por una", "sin worktrees"), se respeta esa peticion para
> **esa** ejecucion y no se modifica `settings.json`.

> **Modo pruebas (`scope: tests`) — detección de respaldo.** La clave manda: si `implementation.scope` existe,
> se aplica tal cual y no se infiere nada. Si **no** existe (o no hay `settings.json`) y el repositorio cumple
> **las dos** condiciones — no contiene código de aplicación propio (solo pruebas, configuración y docs) **y** su
> `.env` o `.env.example` declara `BASE_URL` o `API_BASE_URL` —, `work-implement` **pregunta una sola vez** si se
> trata de un proyecto de pruebas contra un sistema externo y, con respuesta afirmativa, aplica el modo pruebas en
> esa ejecución y ofrece persistir `"scope": "tests"` en `.sdd-devkit/settings.json` (única excepción a «no
> ofrecer escribir la política»; si el archivo no existe, la persistencia la hace `arch-init`). Con respuesta
> negativa, o si falta cualquiera de las dos condiciones, se aplica `code` sin volver a preguntar en la sesión.
> Nunca leer ni mostrar los **valores** del `.env`: la detección mira solo los nombres de variable.

> **Modo delegado.** Cuando el skill se ejecuta invocado por otro skill (subagente), la politica ya
> resuelta se le pasa en la delegacion: en ese modo no se vuelve a resolver ni se pregunta nada.

> **`handoff` solo decide si se pregunta, no a dónde va.** El "siguiente skill del ciclo" sigue siendo el
> que ya determina la regla de handoff de cada referencia (`work-integrate` para cerrar/mergear,
> `pr-create` para un PR, u otro según el tipo de unidad). `always` salta directamente a ese destino sin
> mostrar el menú de opciones; `ask` sigue mostrándolo, como hoy.

> **Esta resolución es interna: no se narra.** Leer y aplicar este bloque es fontanería del skill, no
> trabajo que el usuario haya pedido. **No anunciarlo** («voy a resolver el idioma y la política», «ya leí
> la configuración», «ahora identifico el artefacto»), ni describir los pasos del flujo mientras se
> ejecutan. Lo que se le dice al usuario es el **resultado** —lo que se produjo, lo que debe decidir y lo
> que queda pendiente—, más las preguntas que el propio flujo exija. Si un valor resuelto cambia lo que el
> usuario va a ver, se menciona **al reportar**, no al resolverlo.

## Modo pruebas (`implementation.scope: tests`) — contrato para el catálogo

Un repositorio con `scope: tests` **no es un proyecto de implementación**: existe exclusivamente para
**automatizar pruebas** contra un sistema desplegado cuyo código vive en otro lugar (el *sistema bajo
prueba*). Esa frontera reordena el catálogo entero. La regla general es una sola — **en este repositorio no
se diseña ni se implementa código funcional, ni del sistema bajo prueba ni «de apoyo»; solo pruebas y lo
que las sostiene (runner, clientes, page objects, fixtures, configuración)** — y cada skill la aplica así:

| Skill | En modo pruebas |
|---|---|
| `arch-init` | Clasifica el proyecto y escribe `"scope": "tests"`. Handoff del Paso 5.3 hacia `requirement-refine` (tipo RQ, cuando hay un requerimiento que probar) o `work-define sync`, nunca hacia `work-plan` ni hacia `requirement-refine` como arranque de desarrollo. |
| `arch-discover` · `arch-audit` · `arch-manage` | Describen, auditan y gestionan **la arquitectura del repositorio de pruebas** (estructura de specs, page objects, configuración, estándares). La arquitectura del **sistema bajo prueba** (modelos, diagramas, flujos, contratos de API) **no se diseña ni se infiere**: si hace falta para escribir pruebas, se **solicita al usuario** y se documenta **tal cual la entrega** en `docs/` como material de referencia, marcando su origen. |
| `design-define` | **No produce wireframes ni diseño de alta fidelidad.** Si una prueba visual o E2E necesita conocer la UI, se piden al usuario los wireframes/diseños existentes (o acceso al Figma / al sistema desplegado vía MCP) y se referencian; nunca se dibujan ni se proponen. |
| `requirement-refine` | Único punto de entrada de requerimientos también aquí. Con `scope: tests` y un documento definido por un tercero, su Paso 0 fija **`RQ-XXX` sin preguntar**: `AC-XXX` trazados a la fuente y Cobertura de la fuente, **como insumo para `test-define`**. No produce PRD/SRS salvo que el usuario lo elija explícitamente, y en ese caso advierte que de ahí no sale trabajo de implementación en este repo. |
| `work-define` | Crea o sincroniza `US-XXX` con sus `AC-XXX` **como fuente de los casos de prueba**. **No crea `TK-XXX`**: no hay tareas de implementación que planificar. Al quedar `Ready`, el único handoff es `test-define`. |
| `work-research` | Investiga **cómo probar** (herramientas, estrategias de automatización, datos de prueba, acceso al sistema). **No investiga soluciones técnicas ni de diseño del sistema bajo prueba**; si el usuario las necesita, se le remite al repositorio de la aplicación. |
| `work-plan` | **Solo crea incidentes `BUG-XXX`** (`<changesPath>/incidents/`): el reporte de un hallazgo detectado por un `TC-XXX`, con la plantilla `incident-tests-template.md`. Nunca `WI-XXX` de ningún tipo (`bug-fix`, `refactor`, `spike`, `test-improvement`…) ni tareas de historias. La remediación se planifica en el repositorio de la aplicación. |
| `test-define` | Único skill que **diseña** en este repo: los `TC-XXX`. Tipos admitidos `Manual` / `API Test` / `Visual Test` / `E2E` (nunca `Unit` ni `Integration`). |
| `work-implement` | Solo tipos `TC-XXX` / `FT-XXX`: traduce casos de prueba a código. Una prueba en rojo contra el sistema **se queda en rojo** y se registra como hallazgo; no se corrige producción ni se relaja la prueba. Registro en `test-cases-automation.md` (sin `progress.md`). Detalle en `work-implement/references/test-cases.md § Modo pruebas`. |
| `quality-check` | Audita **solo el código propio del repositorio** (tipado, lint, build, unit de helpers). Los specs contra el sistema externo son el producto, no suites a ejecutar: `N/A` en su veredicto. **Sí es puerta de cierre** del repo propio. |
| `code-review` | Revisa **solo el código propio del repositorio** (specs, page objects, helpers, configuración): fidelidad al `TC-XXX`, aislamiento, manejo de credenciales desde `.env`, estabilidad. No evalúa ni propone cambios al sistema bajo prueba. **Sí es puerta de cierre** del repo propio. |
| `coverage-verify` | **No es puerta de cierre y el cierre no lo invoca.** Lo que trazaría es la cobertura **AC-XXX ↔ TC-XXX del sistema bajo prueba** —valida la aplicación probada, no este repositorio—, así que `pr-create` y `work-integrate` **no lo ejecutan** y lo reportan `N/A` por política (igual que en un PR de promoción). Solo corre **a mano, a petición expresa del usuario**, como informe de cobertura, leyendo la ejecución de `test-cases-automation.md` (un `FAIL` fiel al TC cuenta como criterio cubierto con hallazgo). |
| `pr-create` · `work-integrate` | Cierre del repo propio con **dos** puertas: `quality-check` + `code-review`. `coverage-verify` **no se invoca** (`N/A`, motivo «repositorio solo de pruebas»). Unidad `Done` a verificar: el artefacto padre en `test-cases-automation.md`. |

> **Qué hacer cuando algo exige diseñar.** Si una tarea en este repositorio solo puede completarse
> diseñando o implementando algo del sistema bajo prueba (un endpoint que falta, una pantalla que no
> existe, un modelo que hay que suponer), **parar**, explicar la frontera y ofrecer: (a) pedir al usuario el
> artefacto o la información que falta y documentarla tal cual; (b) registrar el hueco como hallazgo
> (incidente `BUG-XXX`, o nota en `Hallazgos` de `test-cases-automation.md`); (c) remitir al repositorio
> de la aplicación. Nunca la opción «lo diseño yo».

