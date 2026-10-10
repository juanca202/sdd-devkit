# Criterios de calidad: RFC 2119 / ISO 25010 / INVEST / DoR

Referencia detallada para redactar y validar Historias de Usuario. Las secciones del `SKILL.md` apuntan aquí mediante anclas (`#rfc-2119`, `#iso-25010`, `#invest`, `#definition-of-ready-dor`).

---

## RFC 2119

Tabla de equivalencias de las palabras clave normativas (en MAYÚSCULAS en el idioma de preferencia): ver [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../../references/requirement-criteria.md) (RFC 2119).

Elegir una forma por nivel y mantenerla consistente en toda la US. Si el usuario pide no usar RFC 2119, documentarlo en Observaciones; el formato Gherkin en MAYÚSCULAS se mantiene salvo petición explícita en contra.

---

## Categorías de criterios de aceptación

Cada **AC-XXX** declara su categoría entre paréntesis. Las categorías se dividen en dos grupos:

Los dos catálogos —las siete **categorías funcionales** y las ocho características **no funcionales (ISO/IEC 25010)**— viven en [`${PLUGIN_ROOT}/references/requirement-criteria.md`](../../../references/requirement-criteria.md) (Categorías).

Elegir la categoría de **primer nivel** que mejor encaje. Si un criterio abarca más de una, dividirlo en `AC-XXX` distintos.

---

## INVEST

Tabla con las seis dimensiones (I, N, V, E, S, T); valor de cada una: `Cumple` / `No cumple` / `Parcial` con nota. Si alguna dimensión falla, documentarlo sin disimular.

| Letra | Criterio      | Qué validar |
| ----- | ------------- | ----------- |
| **I** | Independiente | La historia puede planificarse e implementarse sin depender de otra US incompleta. |
| **N** | Negociable    | El alcance admite ajuste; no es un contrato cerrado de detalle técnico. |
| **V** | Valiosa       | Aporta valor claro al actor / negocio. |
| **E** | Estimable     | Hay información suficiente para asignar story points (Fibonacci). |
| **S** | Pequeña       | Cabe en un incremento razonable; si es grande, dividir. |
| **T** | Testeable     | Los criterios de aceptación (`AC-XXX`) permiten verificación objetiva. |

Si INVEST no es completamente valorable con la información disponible, la historia se crea con `Estado: Draft` y las lagunas documentadas en Observaciones. Las dependencias con otras US o sistemas afectan especialmente las dimensiones **I** y **E**.

---

## Definition of Ready (DoR)

Tabla con los seis criterios de la plantilla. Para cada uno: `Cumple` / `No cumple` / `Parcial` (el criterio **Referencias de UI** admite además `No aplica`).

| Criterio DoR                       | Qué exige |
| ---------------------------------- | --------- |
| Dependencias listas                | Prerrequisitos y dependencias con otras US o sistemas resueltos o confirmados. |
| Inputs/outputs claros              | Entradas y salidas funcionales bien definidas. |
| Repositorios definidos             | Campo **Repositorios:** de la cabecera poblado con el/los repositorio(s) git afectados, separados por coma. |
| Sin decisiones técnicas pendientes | No quedan decisiones técnicas abiertas que condicionen el alcance. |
| Referencias de UI                  | Para US de UI: enlaces de diseño presentes — diseño/Figma aportado, o wireframes `WF-XXX` heredados del SRS (`wireframes/` de su carpeta) o generados por `/design-define` vía subagente (`wireframes/` de la US) y **aprobados** (uno `Pendiente` deja el criterio en `Parcial`) (`No aplica` si no hay UI propia). |
| Sin aclaraciones pendientes        | Observaciones vacías o «Ninguna»; nada pendiente con usuario/producto. |

El estado **Ready** requiere todos los datos sin excepción: Criterios de aceptación completos (al menos un `AC-XXX`), DoR completado, repositorios afectados identificados y Observaciones sin pendientes abiertos.
