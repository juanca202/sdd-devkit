# Caché de corrida `quality-check-run.json` (compartida)

Referencia transversal del plugin **SDD Devkit**. Es el **contrato entre el productor y los lectores**
de `.sdd-devkit/quality-check-run.json`: el resultado persistido de los checks deterministas de una
corrida de cierre, para no repetirlos cuando el código no cambió.

- **Productor único:** `quality-check`. Cuándo la escribe, cuándo no y cómo la reutiliza él mismo es
  procedimiento suyo y vive en su `references/execution.md` (sección «Caché de corrida de pruebas»).
- **Lectores:** `coverage-verify` (las suites de prueba), `arch-audit` (solo la entrada `architecture`)
  y el propio `quality-check`. Ninguno la reescribe.
- **Ruta fija:** `.sdd-devkit/quality-check-run.json` en la raíz del repositorio; no se versiona y se
  sobrescribe en cada corrida completa.
- **Clave de frescura:** el `FINGERPRINT` canónico — ver [`fingerprint.md`](fingerprint.md).

## Esquema

`schema: quality-check-run/v1` — **esta es la definición canónica y única**; los consumidores la referencian, no
la copian:

```json
{
  "schema": "quality-check-run/v1",
  "generatedBy": "quality-check",
  "timestamp": "2026-07-17T10:20:00-05:00",
  "invokedFrom": "US-004-checkout",
  "testingStandard": "docs/standards/testing.md",
  "git": { "branch": "feature/US-004-checkout", "commit": "abc1234", "workingTreeClean": true,
           "fingerprint": "<hash>" },
  "suites": [
    { "type": "architecture","command": "node scripts/arch/verify.mjs", "result": "PASS", "summary": "9 criterios, 0 violaciones" },
    { "type": "unit",        "command": "npm test",            "result": "PASS", "summary": "48 passed" },
    { "type": "coverage",    "command": "npm run coverage",    "result": "PASS", "summary": "line 82%" },
    { "type": "e2e",         "command": "npx playwright test", "result": "FAIL", "summary": "2 failed" },
    { "type": "integration-testing", "command": "npm run test:it",   "result": "PASS", "summary": "18 passed",
      "standard": "testing/integration-testing" },
    { "type": "contract-testing",    "command": "npm run test:pact", "result": "SKIPPED", "summary": "config rota",
      "standard": "testing/contract-testing" }
  ],
  "checks": [
    { "type": "typecheck", "command": "npx tsc --noEmit", "result": "PASS", "summary": "sin errores" },
    { "type": "lint",      "command": "npm run lint",     "result": "PASS", "summary": "0 errores, 0 warnings" },
    { "type": "build",     "command": "npm run build",    "result": "PASS", "summary": "build ok" }
  ]
}
```

Semántica de los campos:

- **`generatedBy`** — siempre `"quality-check"`. Un consumidor que lea otro valor debe **descartar la caché** y no reutilizarla: `quality-check` es el único productor autorizado.
- **`timestamp`** — momento de la corrida, para reportar procedencia al usuario. No es clave de frescura (esa es `git.fingerprint`).
- **`invokedFrom`** — trabajo desde el que se invocó la corrida (`US-XXX-slug`, `WI-XXX-slug`) o `null` si no aplica. Es **informativo**: la corrida es de la **rama consolidada**, que puede incluir varios trabajos, así que **no** debe usarse para filtrar resultados ni para decidir si la caché aplica a otro trabajo.
- **`testingStandard`** — ruta del estándar de testing del que salieron las suites configuradas, o `null` si el repo no tiene ninguno (en cuyo caso `suites[]` trae las dos fijas más `e2e` si el repo tiene config). Informativo: permite al consumidor distinguir «este repo no declara integración» de «no se leyó el estándar».
- **`git.fingerprint`** — única clave de frescura. Debe corresponder al estado del código **realmente probado** (recalcular tras cualquier corrección).
- **`suites[].type` = `architecture`** — la corrida del **runner de validaciones de arquitectura** del repo (`scripts/arch/verify.<ext>`). Slug canónico, como `unit`/`coverage`/`e2e`, pero **no garantizado**: se emite solo si el repo tiene runner. **No lleva `standard`**: la corrida es del runner completo, no de un estándar concreto, y el reparto por `CR-XXX` lo hace `arch-audit` leyendo la salida, no esta caché. Es la **única entrada de `suites[]` que no es una clase de prueba**: `coverage-verify` la ignora (no es cobertura funcional) y su consumidor es `arch-audit`.
- **`suites[].type`** — para las **fijas**, `unit` o `coverage` (slugs canónicos de `quality-check`): **siempre se emiten las dos**, y la que el repo no tiene va con `result: "N/A"`. `e2e` usa también un slug canónico pero **no está garantizada**: se emite solo si el repo tiene config e2e o el estándar la declara. Para las **configuradas**, el `ID` **tal cual lo declara el requisito** en el estándar de testing (`integration-testing`, `contract-testing`, `performance-testing`…): se emite **una entrada por requisito vigente**, y ninguna si el estándar no declara más. **No** emitir una entrada por una suite que el estándar no declara.
- **`suites[].standard`** — solo en las configuradas: referencia global al requisito del estándar, `<slug-del-estándar>/<ID-del-requisito>` (p. ej. `testing/integration-testing`). Ausente en las fijas y en un `e2e` que salga del catálogo de checks y no del estándar.
- **`suites[].result`** — `PASS` · `FAIL` · `SKIPPED` (correspondía pero no se pudo ejecutar) · `N/A` (no aplica al repo).
- **`checks[]`** (opcional) — los checks **estáticos** de una corrida completa: `typecheck`, `lint`, `build` y `sonar`, con la misma semántica de `command`/`result`/`summary` que `suites[]` (los que quedaron `N/A` se omiten, igual que en el informe). Los escribe **solo una corrida completa** de `quality-check` — nunca `tests-only` — y su único consumidor es **el propio `quality-check`**, para no re-ejecutar nada con caché fresca; `coverage-verify` y `arch-audit` los ignoran. Su ausencia significa que la corrida que escribió la caché no los ejecutó — no es un fallo: la siguiente corrida completa los ejecuta y los añade.

> **Solo `unit` y `coverage` están garantizadas.** Para **toda** otra entrada —`e2e` y `architecture` incluidas— la regla de consumo es la misma: buscarla en `suites[]` y, si no está, tratarla como algo que este repo no ejecuta. Nunca asumir su presencia ni deducir un fallo de su ausencia.

> **Cada consumidor lee solo lo suyo.** `coverage-verify` mapea las suites de prueba a la matriz de cobertura y **descarta `architecture`** —igual que ya descarta `coverage`—; `arch-audit` lee **solo** `architecture` y no mira las suites de prueba. Ninguno reescribe el archivo: el productor único sigue siendo `quality-check`.

## Frescura: cuándo un lector puede usarla

Recalcular el `FINGERPRINT` ([`fingerprint.md`](fingerprint.md)) y compararlo con `git.fingerprint`:

- **`schema` distinto de `quality-check-run/v1`, o `generatedBy` distinto de `"quality-check"`** → inservible.
- **`git.fingerprint` difiere, o el archivo no existe** → obsoleta/ausente.
- **Coincide, pero `suites[]` no cubre el conjunto vigente** (el estándar de testing cambió, o
  apareció/desapareció el runner de arquitectura) → obsoleta. El estándar de testing vive en `docs/`,
  que el fingerprint excluye deliberadamente: añadir, retirar o desactivar un requisito de pruebas **no**
  mueve la clave, así que esta comparación es la única comprobación de frescura que no depende del
  `FINGERPRINT`.
- **Coincide y cubre el conjunto vigente** → fresca: se usan sus resultados sin re-ejecutar.

Un lector que la encuentre inservible, obsoleta o ausente **no la regenera por su cuenta**: delega la
corrida en `quality-check`, que es quien la escribe. La clave no detecta cambios de entorno
(dependencias instaladas, red, servicios) ni el contenido de archivos que sigan sin trackear; si el
resultado pudiera depender de eso, tratar la caché como no concluyente. `workingTreeClean: false`
queda registrado como señal para el lector.
