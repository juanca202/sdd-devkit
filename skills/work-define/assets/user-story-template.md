<!--
Sustituir cada {{…}} a mano (no es un motor). Al publicar: borrar este bloque y todos los {{…}}.
`us:status` (abajo) se CONSERVA: claves/valores en inglés SIEMPRE; Estado en el idioma resuelto. Ver ../../references/verdicts.md.
Repositorios: nombres git separados por coma. work-plan agrupa las TK por este campo.
INVEST / DoR: derivados de las tablas de Validación, nunca aparte. 🟢 Cumple · 🟡 Parcial · 🔴 No cumple. `/ total` = filas evaluadas (INVEST: 6; DoR: 6 menos No aplica, que no cuentan). Omitir colores a 0. Recalcular al tocar las tablas.
Work Item: omitir la línea si no hay. {{Sistema}} = nombre corto (p. ej. ADO). Ningún skill crea ni pobla este campo para una US (sí para TK/WI/TC con tracker vinculado). Si se pone a mano: Criterios de aceptación → campo dedicado del sistema si lo expone; el resto del documento (cabecera incluida Repositorios, y todas las secciones) → descripción del work item, por secciones, para reconstruir la US si se pierde el .md. No omitir secciones.
-->
# US-XXX: {{título corto de la historia de usuario}}

<!-- us:status={{Draft|Ready}} -->
**Estado:** {{Draft | Ready}}
**Fecha de creación:** {{YYYY-MM-DD}}
**Última actualización:** {{YYYY-MM-DD}}
**Repositorios:** {{frontend-web, api-catalogo}}
**INVEST:** {{🟢 N · 🟡 N · 🔴 N / total}}
**DoR:** {{🟢 N · 🟡 N · 🔴 N / total}}
**Work Item ({{Sistema}}):** {{enlace markdown}}

## Descripción

**COMO** {{tipo de usuario}}
**QUIERO** {{necesidad / acción}}
**PARA** {{beneficio / resultado esperado}}

## Contexto

<!-- Sección opcional. Incluir solo si la descripción no es suficiente para entender el alcance o las restricciones del dominio. Eliminar esta sección si no aplica. -->
{{información adicional sobre el dominio, restricciones del negocio, decisiones previas o cualquier contexto necesario para entender la historia}}

## Migración (origen → destino)

<!--
Sección opcional. Incluir solo si esta US es una de las historias en que se descompuso una migración grande entre proyectos, investigada por work-research (flujo «Analizar migración», `research/RS-XXX-{slug}/`) y dimensionada como cambio grande. Eliminar esta sección si no aplica.
-->
**Investigación:** {{enlace a la investigación, típ. `../../research/RS-XXX-{slug}/README.md`}}
**Proyecto origen:** {{nombre / stack principal del origen}}
**Proyecto destino:** {{nombre / stack principal del destino}}

Esta US materializa una porción de la migración investigada en el `RS-XXX` (dimensionada como cambio grande, descompuesta en varias US). Para no duplicar contexto, apóyate en sus archivos (contexto progresivo): el mapeo tecnológico, el estado del origen y los riesgos viven en su `discovery.md`; los casos de validación (Golden Master) en su `validation.md`.

- Los **criterios de aceptación (`AC-XXX`)** de esta US describen el comportamiento migrado; su validación contra los casos Golden Master (`GM-XXX` de `validation.md`) se detalla a nivel de `TK-XXX` en `work-plan` (que ya trae su propia sección Migración para ese mapeo), no aquí.
- Si la migración es incremental, indícalo en **Contexto** con la estrategia (Strangler Fig, Branch by Abstraction, Parallel Run, …) y qué fase cubre esta US específicamente.

## Fuera de alcance

<!-- Sección opcional. Incluir solo si ayuda a delimitar la historia declarando explícitamente qué NO se debe incluir (funcionalidad, casos o entregables que podrían asumirse pero quedan fuera). Eliminar esta sección si no aplica. -->
- {{funcionalidad, caso o entregable que queda fuera del alcance de esta historia; opcionalmente indicar dónde se aborda o por qué se excluye}}

## Reglas de negocio

<!--
Sección opcional. Incluir solo si el dominio impone restricciones, obligaciones o prohibiciones que convenga declarar como reglas explícitas. Eliminar esta sección si no aplica.
Cada regla de negocio lleva id secuencial BR-01, BR-02, … y un enunciado con palabra clave RFC 2119 en MAYÚSCULAS en el idioma de preferencia.
Cuando existan, cada BR-XX debe estar verificada por al menos un AC-XXX en la sección Criterios de aceptación.
-->
- **BR-01:** {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS; p. ej. «El sistema DEBE…» / «The system MUST NOT…»}} → verificado por {{AC-XXX}}
- **BR-02:** {{…}} → verificado por {{AC-XXX}}

## Criterios de aceptación

<!--
Lista plana con id secuencial AC-001, AC-002, … Cada criterio indica su categoría entre paréntesis y el enunciado con palabra clave RFC 2119 en MAYÚSCULAS en el idioma de preferencia.
Categorías funcionales: Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema
Categorías no funcionales (ISO/IEC 25010): Idoneidad funcional · Eficiencia de rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad · Portabilidad
-->
- **AC-001 ({{categoría}}):** {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS; p. ej. «El sistema DEBE…» / «The system MUST NOT…»}}
- **AC-002 ({{categoría}}):** {{…}}

## Referencias

<!--
Incluir únicamente enlaces a recursos ya almacenados; nunca pegar archivos, imágenes ni descripciones directamente aquí.
Recursos válidos: mockups, wireframes, flujos, modelos, diagramas, especificaciones técnicas.
Rutas permitidas: assets/ (recursos propios de esta historia) o docs/specs/technical-docs/ (documentación técnica compartida).
Al enlazar un elemento de technical-docs, el ancla es el id en minúsculas: docs/specs/technical-docs/[capability].md#md-01,
#api-04, #fl-02, #dg-01 — tal como lo devuelve design-define, nunca el título convertido a slug.
-->
- **Diseño / prototipo:** {{enlace markdown al diseño o prototipo}}
- **Archivo local:** {{enlace markdown al archivo en assets/}}
- {{añadir entradas adicionales o indicar «Ninguna por ahora»}}

## Observaciones

- {{prerrequisitos o dependencias aún no listas}}
- {{datos o aclaraciones pendientes del usuario o de producto}}
- {{decisiones pendientes}}
- {{otras notas relevantes}}

---

## Validación

### Complejidad sugerida

- **Story points:** {{1 | 2 | 3 | 5 | 8 | 13}}
- **Justificación:** {{justificación breve basada en alcance, riesgo e incertidumbre}}

### INVEST

| Letra | Criterio      | Resultado                      | Notas         |
| ----- | ------------- | ------------------------------ | ------------- |
| **I** | Independiente | {{Cumple / No cumple / Parcial}} | {{explicación}} |
| **N** | Negociable    | {{Cumple / No cumple / Parcial}} | {{explicación}} |
| **V** | Valiosa       | {{Cumple / No cumple / Parcial}} | {{explicación}} |
| **E** | Estimable     | {{Cumple / No cumple / Parcial}} | {{explicación}} |
| **S** | Pequeña       | {{Cumple / No cumple / Parcial}} | {{explicación}} |
| **T** | Testeable     | {{Cumple / No cumple / Parcial}} | {{explicación}} |

### Definition of Ready (DoR)

| Criterio DoR                       | Estado                                     | Notas                                                                        |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Dependencias listas                | {{Cumple / No cumple / Parcial}}             | {{explicación}}                                                                |
| Inputs/outputs claros              | {{Cumple / No cumple / Parcial}}             | {{explicación}}                                                                |
| Repositorios definidos             | {{Cumple / No cumple / Parcial}}             | {{explicación}}                                                                |
| Sin decisiones técnicas pendientes | {{Cumple / No cumple / Parcial}}             | {{explicación}}                                                                |
| Referencias de UI                  | {{Cumple / No cumple / Parcial / No aplica}} | {{explicación}}                                                                |
| Sin aclaraciones pendientes        | {{Cumple / No cumple / Parcial}}             | {{vacío o «Ninguna» en Observaciones; nada pendiente con usuario/producto}}    |
