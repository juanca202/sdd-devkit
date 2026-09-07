# Pruebas acotadas al cambio: como se ejecutan

Referencia de `work-implement`. Concreta la regla del `SKILL.md` ([Uso escalonado de pruebas](../SKILL.md#uso-escalonado-de-pruebas-optimizacion)): mientras se implementa, **ninguna orden de prueba, lint, typecheck o build abarca mas que lo que la unidad toco**. La bateria completa del repositorio es de `quality-check`, en el cierre.

## La regla en tres niveles

| Momento | Que se ejecuta | Que NO se ejecuta |
|---------|----------------|-------------------|
| **Red / Green** (cada vuelta del ciclo TDD) | **Solo el archivo de test que se acaba de escribir o tocar**, y dentro de el, si el runner lo permite, solo el caso en curso. | El resto de tests del paquete, aunque sea rapido. |
| **Refactor** y **cierre de la unidad** (Paso 3.3 de la referencia del tipo) | Los tests **unitarios y de integracion de los archivos/paquete afectados** por la unidad — los que cubren lo que cambio y los que importan lo que cambio. Lint sobre los archivos tocados; typecheck y build del **paquete/proyecto** afectado. | La suite completa del nivel (`npm test` a secas, `pytest` a secas), la bateria del repo, las e2e. |
| **Cierre de la implementacion** (Paso 4, o Integracion en modo paralelo) | Lo anterior sobre el conjunto de unidades integradas, mas **una sola corrida** de las e2e que apliquen al alcance. | La bateria completa: eso es `quality-check`. |

**Como se determina «lo afectado»:** los archivos que la unidad creo o modifico (los mismos que van al campo `Archivos` de `progress.md`), sus tests directos, y los tests que **importan o dependen** de esos archivos. En un monorepo, el paquete que los contiene — no los demas paquetes. Cuando no se pueda acotar con certeza, acotar al **paquete** afectado, nunca ampliar al repositorio entero.

**Typecheck y build no siempre se acotan por archivo** (`tsc` sobre un archivo suelto ignora el `tsconfig`; un build compila el proyecto). Ahi el alcance es el **paquete/proyecto** de la unidad: en un repo simple es el proyecto entero, y esta bien — es una compilacion, no la suite de pruebas. Lo que nunca se hace es correr el build de todos los paquetes de un monorepo por una unidad que toco uno.

## Filtros por runner

Copiar el patron del stack del repo; la orden exacta sale de los scripts del manifiesto y de la configuracion del runner, no de esta tabla.

| Stack / runner | Un archivo o caso (Red/Green) | Archivos o paquete afectados (cierre de unidad) |
|----------------|-------------------------------|-------------------------------------------------|
| Jest | `npx jest path/to/file.test.ts -t "nombre del caso"` | `npx jest path/to/dir/ --findRelatedTests src/a.ts src/b.ts` |
| Vitest | `npx vitest run path/to/file.test.ts -t "nombre"` | `npx vitest run path/to/dir/` · `npx vitest related src/a.ts src/b.ts` |
| Mocha | `npx mocha path/to/file.test.js -g "nombre"` | `npx mocha "src/modulo/**/*.test.js"` |
| Playwright / Cypress (e2e) | **No se ejecutan en iteracion.** | Solo en el cierre: `npx playwright test tests/e2e/checkout.spec.ts` (los specs del alcance, no la carpeta entera). |
| pytest | `pytest tests/test_modulo.py::test_caso` | `pytest tests/test_modulo.py tests/test_otro.py` · `pytest tests/modulo/` |
| Go | `go test ./pkg/modulo -run TestCaso` | `go test ./pkg/modulo/...` |
| JUnit / Maven | `mvn -pl modulo -Dtest=ClaseTest#metodo test` | `mvn -pl modulo -Dtest='ClaseTest,OtraTest' test` |
| Gradle | `gradle :modulo:test --tests "paquete.ClaseTest.metodo"` | `gradle :modulo:test --tests "paquete.*"` |
| .NET | `dotnet test --filter "FullyQualifiedName~ClaseTest.Metodo"` | `dotnet test src/Modulo.Tests --filter "FullyQualifiedName~Modulo"` |
| Rust | `cargo test -p crate nombre_del_test` | `cargo test -p crate modulo::` |
| PHPUnit | `vendor/bin/phpunit tests/ModuloTest.php --filter testCaso` | `vendor/bin/phpunit tests/Modulo/` |
| Flutter / Dart | `flutter test test/modulo_test.dart --name "caso"` | `flutter test test/modulo/` |
| Swift (XCTest) | `xcodebuild test -only-testing:Target/Clase/metodo …` | `xcodebuild test -only-testing:Target/Clase …` |

**Lint:** pasar los archivos tocados como argumentos (`eslint src/a.ts src/b.ts`, `ruff check src/modulo/`, `golangci-lint run ./pkg/modulo/...`), no la raiz.

## Anti-patrones

- `npm test`, `pytest`, `go test ./...`, `mvn test`, `dotnet test` **a secas** durante la implementacion: es la bateria completa con otro nombre.
- «Como la suite es rapida, la corro entera»: la regla no depende de la duracion. El motivo es que el resultado de la bateria completa lo produce y cachea `quality-check` en el cierre; una corrida completa aqui no es evidencia que nadie consuma, y en modo paralelo colisiona con los demas worktrees.
- Ampliar el alcance porque un test lejano fallo: si un test fuera del alcance falla, no es de esta unidad — se anota en `progress.md` y lo decide el usuario o lo recoge `quality-check`. No se persigue desde aqui.
- Correr e2e «para estar seguros» en una iteracion: solo una vez, en el cierre.
