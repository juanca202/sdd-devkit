# Resolución de la política de implementación

> **Ejecutar este bloque con Bash — no leerlo como prosa ni reimplementar su lógica a mano.** Es un
> script, no una explicación: correrlo y usar literalmente lo que imprime como la política ya resuelta.
> Razonar a mano sobre `.sdd-devkit/settings.json` en su lugar —aunque se llegue a la misma
> conclusión— reintroduce el margen de error de interpretación que el script existe para eliminar.

```!
node -e "
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(process.cwd(), '.sdd-devkit', 'settings.json');

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
  const archive = impl.archiveMode || 'ask';
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

  console.log('- workTreePath = ' + (treePath ? treePath + ' -> raiz donde crear los worktrees (relativa a la raiz del repo si no es absoluta).' : '(sin definir) -> crear los worktrees en una ruta temporal fuera del arbol principal.'));

  if (max === -1) {
    console.log('- maxParallel = -1 -> sin limite de subagentes concurrentes.');
  } else {
    console.log('- maxParallel = ' + max + ' -> maximo ' + max + ' subagentes en paralelo. Si una ola tiene mas unidades independientes, despacharlas en lotes de ese tamano; al liberarse un cupo, entra la siguiente.');
  }

  console.log('- archiveMode = ' + archive + ' -> politica de archivado del artefacto al cerrarlo (la aplica el skill que archiva, no el que implementa): always = archivar sin preguntar; never = no archivar; ask = preguntar.');

  if (handoff === 'always') {
    console.log('- handoff = always -> al cerrar el alcance implementado, invocar directamente el siguiente skill del ciclo (el primero de los handoffs salientes que aplique) sin presentar el menu de opciones.');
  } else {
    console.log('- handoff = ask -> al cerrar el alcance implementado, presentar las opciones de cierre con la herramienta de preguntas estructuradas y esperar la eleccion del usuario.');
  }

  if (scope === 'tests') {
    console.log('- scope = tests -> **sistema bajo prueba externo**: este repositorio contiene solo pruebas contra una aplicacion desplegada cuyo codigo NO esta aqui. Solo aplican los tipos TC-XXX y FT-XXX de work-implement (un TK/WI no se implementa en este repo). Reglas del modo: no hay codigo de produccion que corregir (una prueba en rojo es un hallazgo), URLs y credenciales salen del .env via el modulo de configuracion del proyecto, no se crea ni se toca progress.md (el registro va a test-cases/automation.md del padre), y las e2e/API se ejecutan aisladas en cada iteracion. Ver work-implement/references/test-cases.md § Modo pruebas.');
  } else {
    console.log('- scope = code -> el codigo bajo prueba vive en este repositorio (comportamiento por defecto). Sin cambios respecto al flujo habitual.');
  }
} else {
  console.log('No hay .sdd-devkit/settings.json con bloque \\'implementation\\'. Aplicar los valores por defecto del catalogo:');
  console.log('- **confirmByUnit = always**: una unidad por confirmacion; esperar confirmacion explicita entre unidades.');
  console.log('- **uncommittedChanges = ask**: parar e informar si hay cambios sin commitear al iniciar o reanudar.');
  console.log('- **workTree = ask**: preguntar una sola vez, al inicio, si usar worktrees (con respuesta afirmativa: primero uncommittedChanges sobre el arbol principal, y despues ya no se toca — ni checkout ni merges en el).');
  console.log('- **workTreePath** sin definir: worktrees en una ruta temporal fuera del arbol principal.');
  console.log('- **maxParallel = 3**: hasta 3 subagentes concurrentes.');
  console.log('- **archiveMode = ask**: preguntar antes de archivar.');
  console.log('- **handoff = ask**: presentar las opciones de cierre y esperar la eleccion del usuario.');
  console.log('- **scope = code**: el codigo bajo prueba vive en este repositorio. Si el repositorio NO tiene codigo de aplicacion y su .env o .env.example declara BASE_URL o API_BASE_URL, ver la deteccion de respaldo de la nota **Modo pruebas** de esta referencia antes de asumirlo.');
  console.log('**No decidir estos valores por cuenta propia** ni ofrecer escribirlos: arch-init es quien crea el archivo.');
}
"
```

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
