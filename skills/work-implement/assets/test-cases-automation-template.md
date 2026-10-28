---
type: test-automation
parent: FT-XXX                        # FT-XXX | US-XXX | WI-XXX — artefacto padre (carpeta donde vive este archivo)
status: Pending                       # Pending | In Progress | Done
system_under_test: "nombre del sistema/ambiente"
env_vars: [BASE_URL, API_BASE_URL]    # solo NOMBRES de las variables que consumen las pruebas, nunca valores
created: "YYYY-MM-DD HH:mm"
updated: "YYYY-MM-DD HH:mm"
---
<!--
Plantilla de `test-cases-automation.md` — SOLO para `implementation.scope: tests` (repositorio de
pruebas contra un sistema externo). En `scope: code` no se usa: ahi el registro va en `progress.md`.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. No repetir ningún campo del
frontmatter como línea `**Campo:**` bajo el título. El frontmatter describe el DOCUMENTO (el trabajo completo);
cada unidad conserva su propia sección en el cuerpo.

Este archivo NO lleva marcas ocultas `<!-- unit:… -->` en sus unidades: no se puede garantizar que un
comentario HTML sobreviva a todas las herramientas por las que pasa un markdown. El estado del documento que
`work-integrate` lee en las ramas `test/` de un repo externo es `status` del frontmatter; el de cada unidad es
el VALOR de su linea `**Estado:**` (o `**Status:**`), que va SIEMPRE en ingles — `Pending`, `In Progress` o
`Done` — aunque la etiqueta y el resto del documento esten en otro idioma. No traducir esos valores.

Este archivo NO es un progress.md: no registra implementacion de codigo, ni archivos de produccion, ni
decisiones de diseno. Registra unicamente que TC quedaron automatizados, cuales no y por que, y los
hallazgos (comportamiento del sistema distinto al documentado en el TC). Nunca contiene valores del
`.env` ni credenciales: solo los NOMBRES de las variables que las pruebas consumen.
-->
# Automatización de pruebas

## {{FT-XXX | US-XXX | WI-XXX}}: {{titulo corto del artefacto padre}}

## Unidades

<!--
En modo pruebas la unidad es SIEMPRE el artefacto padre (`FT-XXX` / `US-XXX` / `WI-XXX`), aunque la
entrada hayan sido TC sueltos — ver `work-implement/references/test-cases.md` § Modo pruebas. Normalmente
hay una sola unidad por archivo. El encabezado `### <ID>: …` identifica la unidad y su `**Estado:**` es lo
que se verifica en `Done` antes de integrar.
-->
### {{FT-XXX | US-XXX | WI-XXX}}: {{titulo corto}}

**Estado:** {{Pending | In Progress | Done}}
**Iniciado:** {{YYYY-MM-DD HH:mm}}
**Finalizado:** {{YYYY-MM-DD HH:mm}}
**Automatizador:** {{inferido de git config user.name}} / {{agente: Claude | Cursor | Codex | …}}

<!-- Pruebas: los archivos de prueba creados o modificados para esta unidad, uno por linea dentro del bloque, prefijados + (creado) / ~ (modificado) / - (eliminado). -->
**Pruebas:** 
`
[]
`

<!-- Cobertura de test cases: solo observaciones puntuales — TC-XXX no automatizados (con motivo: Manual, Draft, TC erroneo, hallazgo abierto), TC cubiertos con un nivel de prueba distinto al documentado (p. ej. TC Unit automatizado como API), AC-XXX sin ningun TC. Vacio si todo se automatizo como se esperaba. -->
**Cobertura de test cases:** 
[]

<!-- Hallazgos: una linea por prueba fiel al TC que sale en rojo contra el sistema: `TC-XXX — esperado: … · observado: … · spec: <ruta> (en rojo, sin marcar) · seguimiento: BUG-XXX | <work item del tracker> | sin registrar`. La prueba NO se marca skip/todo/fixme: el fallo debe verse en el reporte del runner; esta linea es la que coverage-verify lee como `FAIL` del TC. Nunca pegar valores del .env, tokens ni datos personales en la evidencia. -->
**Hallazgos:** 
[]
