# Reutilización del reporte: claves de frescura y Paso 0

Detalle de la sección [Reutilización del reporte (idempotencia)](../SKILL.md#reutilización-del-reporte-idempotencia)
de `SKILL.md`: contexto de ejecución, cálculo de las dos claves de frescura y comportamiento del Paso 0.
**Leerlo completo antes de ejecutar el Paso 0.**

> **Contexto de ejecución.** Como `quality-check`, este skill es una **compuerta de cierre** (al integrar o
> antes del PR), no corre por tarea ni durante la implementación. La frescura se evalúa sobre la rama
> **consolidada** del cierre. En el pipeline típico de cierre `pr-create` corre `quality-check` **primero**
> (produce `quality-check-run.json` fresco) y luego `coverage-verify`, que reutiliza esa corrida — sin doble
> ejecución de pruebas; y si el código tampoco cambió desde el último `criteria-coverage.md`, este Paso 0 lo
> devuelve sin regenerarlo.

**Clave de frescura — dos hashes, porque el reporte depende de dos cosas distintas.**

| Clave | Qué cubre | Cómo se calcula |
|-------|-----------|-----------------|
| `FINGERPRINT` | **El código y los tests.** El fingerprint canónico de la tubería, idéntico al de `quality-check` y `code-review`: excluye toda carpeta oculta, cualquier `docs/`, toda la documentación en texto (`*.md`, `*.rst`, `*.adoc`, `LICENSE*`, `CHANGELOG*`…) y el `.gitignore`, para que ni escribir un archivo generado ni editar documentación invalide la caché: **solo se mueve cuando cambia el código**. Receta exacta en [`${PLUGIN_ROOT}/references/fingerprint.md`](../../../references/fingerprint.md). | Sobre todo el árbol, menos las exclusiones |
| `SPEC_FINGERPRINT` | **Los criterios y los casos de prueba** del artefacto que se valida: su `README.md` y su carpeta `test-cases/`. Viven bajo `docs/specs/`, que el `FINGERPRINT` excluye — sin esta segunda clave, reescribir un criterio no invalidaría nada. | Sobre la **carpeta del artefacto**, excluyendo su propio `criteria-coverage.md` |

`bash
NO_REPORT=":(exclude)${ARTEFACTO%/}/criteria-coverage.md"
SPEC_FINGERPRINT=$( { git -C "$ROOT" ls-files -s              -- "$ARTEFACTO" "$NO_REPORT"; \
                      git -C "$ROOT" status --porcelain -uall -- "$ARTEFACTO" "$NO_REPORT"; \
                      git -C "$ROOT" diff                     -- "$ARTEFACTO" "$NO_REPORT"; \
                    } | git hash-object --stdin )
`

donde `$ARTEFACTO` es la carpeta del trabajo (`<changesPath>/user-stories/US-042-…/`) o, si el artefacto es un archivo suelto, su ruta. Se reutiliza el reporte **solo si coinciden los dos**.

> **La exclusión del propio reporte no es opcional.** El `criteria-coverage.md` vive **dentro** de `$ARTEFACTO`: sin `$NO_REPORT`, escribirlo en el Paso 7 movería el `SPEC_FINGERPRINT`, la marca de pie guardaría el hash de *antes* de escribir, y ninguna corrida posterior coincidiría — la idempotencia no se dispararía **nunca**. La clave cubre las **entradas** del reporte, no su salida; es el mismo motivo por el que el `FINGERPRINT` excluye `**/criteria-coverage.md`.
>
> **Y tiene que ser una ruta literal interpolando `$ARTEFACTO`, no un glob.** `':(exclude,glob)**/criteria-coverage.md'` junto a un pathspec **positivo** hace que git excluya **todo**: las tres órdenes devuelven vacío, la clave queda fija en el hash del blob vacío, y entonces la idempotencia se dispara siempre y un criterio editado nunca invalida el reporte. El `EXC` del `FINGERPRINT` puede usar globs porque ahí no hay pathspec positivo.

> **Por qué dos claves y no una.** Meter `docs/` entero en el `FINGERPRINT` haría que escribir cualquier informe invalidara las tres cachés — el problema que las exclusiones resuelven. Acotar la segunda clave a **la carpeta del artefacto** captura exactamente lo que este reporte traza, sin arrastrar el resto de la documentación. Y a diferencia de «detectar que el usuario editó los criterios», es una comprobación **determinista**: no depende de que el cambio haya ocurrido en esta sesión, ni de que alguien lo mencione.

> **Lo que sigue sin cubrirse:** criterios que viven **fuera del repo** (un ticket de un tracker, un documento externo). Ahí no hay nada que hashear; si el artefacto es externo, decirlo en el reporte y pedir `revalidate` cuando cambie.

> **Un solo cálculo por corrida, con una excepción.** Ambos hashes se computan una vez, en el Paso 0. El
> `FINGERPRINT` sirve para las **dos** comprobaciones de frescura —la del `criteria-coverage.md` (Paso 0) y la del
> `quality-check-run.json` (Paso 4, delegación)—; el `SPEC_FINGERPRINT` solo para la primera. Los dos se regraban en el
> Paso 7. La delegación en `tests-only` no toca código (y el `.gitignore` que puede normalizar está excluido de
> la receta), así que el `FINGERPRINT` calculado en el Paso 0 sigue siendo válido al grabar: **no hace falta
> recalcularlo**. Si aun así el valor guardado por `quality-check` en `quality-check-run.json` no coincide con el del
> Paso 0, algo cambió el código en medio: tratar la caché como obsoleta, no como fresca.

**Comportamiento (Paso 0 del flujo):**

1. Resolver la ubicación del trabajo y **calcular `FINGERPRINT` y `SPEC_FINGERPRINT`**. Siempre, haya reporte
   previo o no: el Paso 7 los necesita para grabar la marca de pie, también en la primera validación.
2. Buscar su `criteria-coverage.md`. Si no existe → generar normal (no hay caché).
3. Si existe, leer los hashes guardados en su marca de pie
   (`<!-- coverage-verify:verdict=<canónico> · fingerprint=<hash> · spec=<hash> · generated=YYYY-MM-DD -->`) y reutilizarlo **solo si
   se cumple todo**: coinciden **los dos** hashes, el reporte **no** registra una ejecución fallida, y el
   usuario no pasó `revalidate`.
   - **Se cumple** → **no regenerar**: devolver el veredicto y el resumen del reporte existente tal cual,
     e indicar al usuario que no hubo cambios desde la última validación ({{fecha guardada}}). No reescribir
     el archivo, no delegar en `quality-check`.
   - **Falla algo**, no hay marca de pie (reportes antiguos), o el usuario pide `revalidate` →
     ejecutar el flujo completo (Pasos 1-7) y **regrabar** ambos hashes al guardar (Paso 7).
4. La marca de pie **se conserva** en el documento publicado (no se elimina como el bloque de instrucciones
   de la plantilla). Si está **ilegible o incompleta** (un hash que no parsea, marca truncada, o falta el
   campo `spec=`), no intentar repararla ni adivinar: tratar
   la caché como ausente, regenerar y regrabarla.

> **Un reporte que no pudo ejecutar las pruebas nunca se sirve desde caché.** Si el reporte existente tiene
> filas en `NOT_RUN` porque la delegación no fue posible (sin red, sin runner, el usuario declinó), su
> `⚠️` describe un fallo **de entorno**, no del código. Congelarlo significaría arrastrar ese «no se pudo
> comprobar» para siempre aunque el entorno ya funcione. Regenerar y volver a intentar la delegación.

> Un cambio en una **carpeta oculta** (`.sdd-devkit/`, `.github/`…), en `docs/` fuera de la carpeta del
> artefacto, o en un `criteria-coverage.md` **no** cuenta como cambio: están excluidos, así que ningún artefacto
> que generen este skill, `quality-check`, `code-review` o `arch-audit` desplaza la clave. Los criterios y los
> `TC-XXX` **sí** cuentan, vía `SPEC_FINGERPRINT`.
