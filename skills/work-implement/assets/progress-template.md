---
type: progress
work: US-XXX                          # US-XXX | WI-XXX | FT-XXX — identificador del trabajo (carpeta donde vive este archivo)
status: Pending                       # Pending | In Progress | Done
kind: user-story                      # user-story | maintenance | test-cases | feature
created: "YYYY-MM-DD HH:mm"
updated: "YYYY-MM-DD HH:mm"
---
<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. No repetir ningún campo del
frontmatter como línea `**Campo:**` bajo el título. El frontmatter describe el DOCUMENTO (el trabajo completo);
cada unidad conserva su propia sección en el cuerpo.

El estado del trabajo completo es `status` del frontmatter. Las marcas `<!-- unit:… -->` de cada unidad SE
CONSERVAN al publicar: son el ancla que `work-integrate` y `pr-create` parsean para comprobar que cada unidad
esta en `Done`. Sus claves y sus valores van en ingles SIEMPRE, aunque el resto del documento este en otro
idioma; las etiquetas visibles de la unidad (`**Estado:**`, `**Archivos:**`…) si se redactan en el idioma
resuelto. Ver ../../references/verdicts.md.
-->
# Progreso

## {{identificador del trabajo}}: {{titulo corto}}

<!--
Valores de `work` (y del encabezado): `US-XXX-{{slug}}` (historia), `WI-XXX-{{slug}}` (tarea de mantenimiento) o `FT-XXX-{{slug}}` (feature).
Ubicacion y alcance por tipo (cada trabajo tiene su propio `progress.md` dentro de su carpeta):
- Historia de usuario (`US-XXX`): un `progress.md` por carpeta de la US (`<changesPath>/user-stories/US-XXX-{{nombre-corto}}/progress.md`); el encabezado lleva su `US-XXX` y las unidades son sus `TK-XXX`.
- Tarea de mantenimiento (`WI-XXX`): un `progress.md` por carpeta del WI (`<changesPath>/work-items/WI-XXX-{{slug}}/progress.md`), específico de ese WI; el encabezado lleva su `WI-XXX` y la unidad es el `WI-XXX` completo (una sola entrada, sin sub-tareas). En un WI de `kind: spike` la unidad es el experimento: `Iniciado` es el reloj del timebox, `Archivos` incluye `spike-report.md`, y en `Notas` se registra el timebox consumido y el veredicto.
- Feature (`FT-XXX`): un `progress.md` por carpeta del feature (`<currentPath>/FT-XXX-{{slug}}/progress.md`); el encabezado lleva su `FT-XXX` y la unidad es el `FT-XXX` completo (una sola entrada que cubre todos sus `TC-XXX`).
- Casos de prueba (`TC-XXX`) sueltos: el `progress.md` vive en la carpeta del **artefacto padre** que los contiene (US, WI o FT); el encabezado lleva el ID de ese padre y hay **una unidad por cada `TC-XXX`** del alcance.

Transversal: si el trabajo ya se archivo, su carpeta vive bajo `<archivedPath>/` y su `progress.md` con ella. Ahi **solo se lee**: nunca se crea ni se edita, y nunca se recrea la carpeta en la ruta activa. Ver `references/archive.md`.
-->
## Unidades

<!--
La "unidad" depende del tipo: TK para historias de usuario, el WI completo para tareas de mantenimiento, el FT completo para un feature, y cada TC para casos de prueba sueltos.
`Cobertura de test cases` es opcional: incluirla solo si el artefacto tiene carpeta `test-cases/`; omitirla si no hay test cases. En los tipos `TC-XXX` / `FT-XXX` es obligatoria.
-->
### {{TK-XXX | WI-XXX | TC-XXX | FT-XXX}}: {{titulo corto}}

<!-- unit:id={{TK-XXX|WI-XXX|TC-XXX|FT-XXX}} · status={{Pending|In Progress|Done}} -->
**Estado:** {{Pending | In Progress | Done}}
**Iniciado:** {{YYYY-MM-DD HH:mm}}
**Finalizado:** {{YYYY-MM-DD HH:mm}}
**Implementador:** {{inferido de git config user.name}} / {{agente que implementa: Claude | Cursor | Codex | …}} / {{modelo, si el agente lo expone}} / {{id de sesion, si el agente lo expone}}

<!-- Archivos: los archivos tocados durante la implementación de esta unidad, uno por línea dentro de un bloque de código (a diferencia de Notas, Decisiones adicionales y Cobertura de test cases, que van con viñeta): el prefijo - de un archivo eliminado se confundiría con el guion de la viñeta, por eso el contenido se envuelve en ` y el título queda fuera. Prefijar cada ruta con + (creado), ~ (modificado) o - (eliminado); el símbolo basta, no hace falta etiqueta. -->
**Archivos:** 
`
[]
`

<!-- Notas: observaciones surgidas durante la implementación de esta unidad; describirlas de forma específica y concisa. -->
**Notas:** 
[]

<!-- Decisiones adicionales: toda decisión adicional surgida en la conversación con el agente, o decisión autónoma del agente relevante para el usuario, que haya surgido durante la implementación y no estaba en la especificación original. -->
**Decisiones adicionales:** 
[]

<!-- Cobertura de test cases: solo observaciones puntuales — TC-XXX que no se pudieron automatizar (con motivo), TC cubiertos con un tipo de prueba distinto al documentado, AC-XXX sin ningun TC, y discrepancias entre el TC y el codigo con la decision tomada. Omitir la seccion si el artefacto no tiene test cases; obligatoria en los tipos TC-XXX / FT-XXX. -->
**Cobertura de test cases:** 
[]

### {{TK-XXX | WI-XXX | TC-XXX | FT-XXX}}: {{titulo corto}}

**Estado:** {{Pending | In Progress | Done}}
**Iniciado:** {{YYYY-MM-DD HH:mm}}
**Finalizado:** {{YYYY-MM-DD HH:mm}}
**Implementador:** {{usuario}} / {{agente}} / {{modelo}} / {{session id}}

**Archivos:**
`
{{+ / ~ / -}} {{src/ruta/al/archivo.ext}}
`

**Notas:** 
- {{observación relevante encontrada al implementar}}

**Decisiones adicionales:**
- {{decision tomada en sesion de chat no documentada en la especificacion}}

**Cobertura de test cases:**
- {{TC-XXX no automatizado — motivo}}
- {{TC-XXX cubierto como Integration aunque el TC indica Unit — motivo}}
- {{AC-XXX sin test cases definidos}}
