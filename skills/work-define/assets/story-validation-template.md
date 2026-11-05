---
type: story-validation
story: ./README.md
updated: YYYY-MM-DD
story_points: 3                        # 1 | 2 | 3 | 5 | 8 | 13
---
<!--
Sustituir cada {{…}} a mano (no es un motor). Al publicar: borrar este bloque y todos los {{…}}.
Archivo hermano del README.md de la US (`<changesPath>/user-stories/US-XXX-[nombre-corto]/story-validation.md`).
Lo crea y actualiza work-define en la misma pasada que el README.md: NUNCA existe uno sin el otro.
Frontmatter (línea 1, YAML válido, claves en inglés; contrato en ../../references/frontmatter.md): no van {{…}}
dentro del bloque; sustituir los valores de ejemplo.
Los resultados de las tablas (Met · Partial · Not Met · N/A) son valores canónicos en inglés, no se traducen;
las etiquetas visibles (criterio, notas) van en el idioma resuelto.
Tras tocar cualquier tabla, recalcular `invest` y `dor` del frontmatter del README.md: total = filas evaluadas
(INVEST: 6; DoR: 6 menos las N/A, que no cuentan). El `status` de la US (Draft | Ready) vive SOLO en el README.md
y se deriva de aquí: Ready exige INVEST sin Not Met y DoR completo (ver references/quality-criteria.md).
-->
# Validación — US-XXX: {{título corto de la historia de usuario}}

## Complejidad sugerida

- **Story points:** {{1 | 2 | 3 | 5 | 8 | 13}} (mismo valor que `story_points` del frontmatter)
- **Justificación:** {{justificación breve basada en alcance, riesgo e incertidumbre}}

## INVEST

| Letra | Criterio      | Resultado                      | Notas         |
| ----- | ------------- | ------------------------------ | ------------- |
| **I** | Independiente | {{Met / Not Met / Partial}} | {{explicación}} |
| **N** | Negociable    | {{Met / Not Met / Partial}} | {{explicación}} |
| **V** | Valiosa       | {{Met / Not Met / Partial}} | {{explicación}} |
| **E** | Estimable     | {{Met / Not Met / Partial}} | {{explicación}} |
| **S** | Pequeña       | {{Met / Not Met / Partial}} | {{explicación}} |
| **T** | Testeable     | {{Met / Not Met / Partial}} | {{explicación}} |

## Definition of Ready (DoR)

| Criterio DoR                       | Estado                                     | Notas                                                                        |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Dependencias listas                | {{Met / Not Met / Partial}}             | {{explicación}}                                                                |
| Inputs/outputs claros              | {{Met / Not Met / Partial}}             | {{explicación}}                                                                |
| Repositorios definidos             | {{Met / Not Met / Partial}}             | {{explicación}}                                                                |
| Sin decisiones técnicas pendientes | {{Met / Not Met / Partial}}             | {{explicación}}                                                                |
| Referencias de UI                  | {{Met / Not Met / Partial / N/A}} | {{explicación}}                                                                |
| Sin aclaraciones pendientes        | {{Met / Not Met / Partial}}             | {{vacío o «Ninguna» en Observaciones del README.md; nada pendiente con usuario/producto}} |
