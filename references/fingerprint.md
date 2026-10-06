# Fingerprint canónico de la tubería de cierre (compartida)

Referencia transversal del plugin **SDD Devkit**. Es la **definición canónica y única** de la clave de
frescura `FINGERPRINT`: la calculan `quality-check`, `code-review` y `coverage-verify`, y la compara
`arch-audit` al leer la caché de corrida. Los skills que **ejecutan** la receta llevan una copia literal
del bloque `EXC`/`FINGERPRINT` en su propio flujo (para correrla sin abrir este archivo); la prueba
`scripts/validate-fingerprint.test.js` verifica que esas copias sean idénticas a la de aquí. **Si la
receta cambia, cambia aquí primero** y se propaga a las copias.

Clave de frescura compartida entre las **tres puertas del cierre**, cada una sobre su propio artefacto:
`quality-check-run.json` en `quality-check`, `criteria-coverage.md` en `coverage-verify` y
`docs/audits/code-review.md` en `code-review`. (`code-review` le
añade además el commit de la rama base, porque su unidad es un diff con dos lados; el `FINGERPRINT` en sí
es idéntico en las tres.) Hash reproducible del commit + working tree + cambios sin commitear **del
código y de la configuración visible** — es decir, de **todo aquello que puede cambiar el resultado de una
prueba o de una compilación, y de nada más**. Quedan fuera, para que escribirlos o editarlos **no desplace
la clave**: **toda carpeta oculta** (empieza por `.`, en la raíz o anidada), **todo `docs/`**, **toda la
documentación en texto** viva donde viva (`*.md`, `*.markdown`, `*.rst`, `*.adoc`, `LICENSE*`,
`CHANGELOG*`, `AUTHORS*`, `NOTICE*`, `CODEOWNERS`) y el **`.gitignore`**:

```bash
ROOT=$( git rev-parse --show-toplevel )
EXC=( ':(top,exclude,glob)**/.*/**'      ':(top,exclude,glob)**/docs/**' \
      ':(top,exclude,glob)**/*.md'        ':(top,exclude,glob)**/*.markdown' \
      ':(top,exclude,glob)**/*.rst'       ':(top,exclude,glob)**/*.adoc' \
      ':(top,exclude,glob)**/LICENSE*'    ':(top,exclude,glob)**/CHANGELOG*' \
      ':(top,exclude,glob)**/AUTHORS*'    ':(top,exclude,glob)**/NOTICE*' \
      ':(top,exclude,glob)**/CODEOWNERS'  ':(top,exclude,glob)**/.gitignore' )
FINGERPRINT=$( { git -C "$ROOT" ls-files -s              -- "${EXC[@]}"; \
                 git -C "$ROOT" status --porcelain -uall -- "${EXC[@]}"; \
                 git -C "$ROOT" diff                     -- "${EXC[@]}"; \
} | git hash-object --stdin )
```

Las tres piezas se reparten el estado: `ls-files -s` da el contenido **trackeado** (el SHA de cada blob del índice), `diff` los cambios **sin stagear** del árbol, y `status -uall` las rutas **sin trackear**. Juntas cubren el estado del código sin referenciar `HEAD` ni una sola vez, que es lo que hace la clave utilizable (ver la nota de abajo).

Cubre **código fuente, tests y manifiestos** — todo aquello de lo que dependen los resultados de las
herramientas. La caché es **fresca** si el `fingerprint` guardado coincide con el recalculado ahora; si
difiere, hubo cambios y es **obsoleta** (re-ejecutar).

> **Qué queda deliberadamente fuera, y qué implica.** La exclusión de `docs/` mantiene la clave estable
> frente a la documentación, pero también deja fuera **los criterios de aceptación** (`docs/specs/**/README.md`).
> Para `quality-check` da igual —una prueba no cambia de resultado porque se reescriba un criterio—, pero **sí
> importa en `coverage-verify` y en `code-review`**, cuyo veredicto depende de esos criterios: si se editan
> sin tocar el código, el informe se dará por fresco y hay que **revalidar a mano** (ver la nota de cada uno).
> Tampoco se cubren los cambios de **entorno** (dependencias instaladas, red, servicios) que no tocan el árbol.

> **Nombre único de la clave.** En todo el repo esta variable se llama `FINGERPRINT` y su valor persistido
> es `git.fingerprint`. No usar alias (`FP`, `HASH`) en ningún skill: el mismo valor debe ser reconocible
> a simple vista cuando un skill delega en otro.
>
> **El criterio de exclusión es uno solo: ¿puede este archivo cambiar el resultado de una prueba o de una
> compilación?** Si no, se excluye; si sí —o si hay duda—, se queda dentro. Los pathspecs, grupo a grupo:
>
> | Pathspec | Qué saca de la clave |
> |----------|----------------------|
> | `':(top,exclude,glob)**/.*/**'` | El contenido de **cualquier carpeta oculta**, en la raíz o anidada: `.sdd-devkit/` (donde vive `quality-check-run.json`), y de paso `.git/`, `.github/`, `.venv/`, `.cache/`, `.idea/`… El `**/` inicial cubre los dos niveles con un solo patrón. **Los archivos ocultos de la raíz (`.eslintrc.json`, `.env`, `.npmrc`, `.babelrc`) NO se excluyen**: son configuración que sí puede cambiar el resultado de un check. |
> | `':(top,exclude,glob)**/docs/**'` | **Cualquier `docs/`, en la raíz o dentro de un módulo**: el informe vigente (`quality-check.md`, `code-review.md`), las copias con marca de tiempo de `save-report`, los informes de `arch-audit`, los `criteria-coverage.md` que viven junto a su artefacto y el resto de documentación. El `**/` inicial es lo que cubre el caso monorepo: `:(top,exclude)docs` a secas excluiría **solo** el `docs/` de la raíz, y en una corrida lanzada desde `packages/api/` el informe se escribe en `packages/api/docs/audits/` — que seguiría dentro de la clave y la desplazaría en cada corrida. |
> | `**/*.md` · `**/*.markdown` · `**/*.rst` · `**/*.adoc` | **Toda la documentación en texto, viva donde viva**: el `README.md` de la raíz, un `NOTES.md` dentro de `src/`, un `criteria-coverage.md` de un artefacto externo al plugin escrito fuera de `docs/`. Un `.md` no compila ni se ejecuta; editarlo no puede cambiar el resultado de una prueba. **`*.mdx` NO se excluye**: MDX es código (importa componentes y se compila). Tampoco `*.txt`: `requirements.txt` y `CMakeLists.txt` son manifiestos. |
> | `**/LICENSE*` · `**/CHANGELOG*` · `**/AUTHORS*` · `**/NOTICE*` · `**/CODEOWNERS` | Los archivos de acompañamiento sin extensión o con extensión libre, que ningún build lee. |
> | `**/.gitignore` | Solo afecta a qué versiona git, no a qué se compila ni se prueba. Y es el archivo que `quality-check` edita al normalizar la caché: dentro de la clave, la primera corrida en un repo la desplazaba a sí misma. |
>
> Así ningún artefacto que produce la propia tubería puede desplazar la clave de frescura —correr
> `arch-audit` no invalida un `criteria-coverage.md`, ni escribir un informe invalida el `quality-check-run.json`—, y
> **tampoco lo hace la edición de documentación**: retocar el `README.md`, el `CHANGELOG.md` o un criterio
> de aceptación mantiene fresca la corrida de pruebas, que es lo que se espera de una clave que solo debe
> moverse cuando cambia el código.
>
> **Caso límite asumido: sitios de documentación.** En un repo cuyo build *compila* los `.md` (Docusaurus,
> VitePress, MkDocs), editar un `.md` sí puede romper el build y la clave no lo verá. Es una decisión
> deliberada —la regla general vale más que ese caso— y tiene salida: el modificador `no-cache` de este
> skill fuerza la re-ejecución.
>
> **Nada de `HEAD` — y es deliberado.** La receta **no** referencia `HEAD` en ningún punto, porque `HEAD` no
> admite pathspec: cualquier commit lo mueve, incluidos los que solo tocan rutas excluidas. Con `git rev-parse HEAD`
> en la receta, el commit de los propios artefactos que hace el cierre (`work-integrate` paso 8, `pr-create`
> paso 6) caducaba **las tres claves a la vez** y obligaba a re-ejecutar toda la batería de pruebas — la
> idempotencia no sobrevivía al flujo que la usa. `ls-files -s` da la misma señal (el SHA de cada blob
> trackeado) **respetando los pathspecs**, y de paso funciona en un repo **sin ningún commit**, donde
> `git rev-parse HEAD` aborta con `fatal: bad revision`.
>
> **`git -C "$ROOT"` no es cosmético.** `status` y `diff` imprimen rutas **relativas al directorio de trabajo**:
> el mismo árbol da hashes distintos según desde dónde se lance la corrida. Anclando los tres comandos a la raíz,
> el `FINGERPRINT` es idéntico desde la raíz o desde `packages/api/`, que es lo que permite compararlo entre
> corridas y entre skills.
>
> **La magia `top` tampoco es opcional.** `:(top,…)` ancla el pathspec a la **raíz del repositorio**; sin ella,
> git lo resolvería relativo al directorio de trabajo y las exclusiones se desplazarían con el cwd.
>
> **`-uall` tampoco es opcional.** Sin él, `git status --porcelain` **colapsa** los directorios sin trackear a
> una sola entrada (`?? docs/`) y las exclusiones de dentro no llegan a aplicarse — el caso típico es la
> primera corrida en un repo, donde nada de esto está aún versionado. Con `-uall` git lista archivo por
> archivo y los pathspecs filtran de verdad. Aun así, el contenido de un archivo que **permanezca** sin
> trackear no entra en la clave: solo su ruta. Si el resultado pudiera depender de un archivo nuevo aún sin
> añadir a git, tratar la caché como no concluyente.
>
> **La clave es conservadora, nunca laxa.** Commitear cambios de **código** sí la mueve, aunque el árbol
> resultante sea idéntico al que se probó: `status` distingue un cambio stageado de uno ya commiteado. Eso
> provoca alguna revalidación de más, que es el error barato; el caro —dar por fresca una caché que ya no
> corresponde— no puede ocurrir por esta vía.
