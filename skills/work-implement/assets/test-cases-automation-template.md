<!--
Plantilla de `test-cases-automation.md` — SOLO para `implementation.scope: tests` (repositorio de
pruebas contra un sistema externo). En `scope: code` no se usa: ahi el registro va en `progress.md`.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Este archivo NO lleva marcas ocultas `<!-- work:… -->` / `<!-- unit:… -->`: no se puede garantizar que
un comentario HTML sobreviva a todas las herramientas por las que pasa un markdown. El estado que
`work-integrate` lee en las ramas `test/` de un repo externo es el VALOR de la linea `**Estado:**`
(o `**Status:**`), que va SIEMPRE en ingles — `Pending`, `In Progress` o `Done` — aunque la etiqueta y
el resto del documento esten en otro idioma. No traducir esos valores.

Este archivo NO es un progress.md: no registra implementacion de codigo, ni archivos de produccion, ni
decisiones de diseno. Registra unicamente que TC quedaron automatizados, cuales no y por que, y los
hallazgos (comportamiento del sistema distinto al documentado en el TC). Nunca contiene valores del
`.env` ni credenciales: solo los NOMBRES de las variables que las pruebas consumen.
-->
# Automatización de pruebas

## {{FT-XXX | US-XXX | WI-XXX}}: {{titulo corto del artefacto padre}}

**Estado:** {{Pending | In Progress | Done}}
**Sistema bajo prueba:** {{nombre del sistema/ambiente}} — variables: `{{BASE_URL, API_BASE_URL, …}}` (solo nombres, nunca valores)
**Fecha de creación:** {{YYYY-MM-DD HH:mm}}
**Ultima actualizacion:** {{YYYY-MM-DD HH:mm}}

## Unidades

<!--
Una unidad por `FT-XXX` (entrada feature) o por `TC-XXX` (entrada test cases sueltos), igual que en
`work-implement/references/test-cases.md`. El encabezado `### <ID>: …` identifica la unidad y su
`**Estado:**` es lo que se verifica en `Done` antes de integrar.
-->
### {{FT-XXX | TC-XXX}}: {{titulo corto}}

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

<!-- Hallazgos: una linea por prueba fiel al TC que sale en rojo contra el sistema: `TC-XXX — esperado: … · observado: … · prueba marcada: skip|todo · seguimiento: WI-XXX | <work item del tracker> | sin registrar`. Nunca pegar valores del .env, tokens ni datos personales en la evidencia. -->
**Hallazgos:** 
[]
