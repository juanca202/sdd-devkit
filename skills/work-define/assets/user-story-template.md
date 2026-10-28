---
id: US-XXX
type: user-story
status: Draft                         # Draft | Ready
created: YYYY-MM-DD
updated: YYYY-MM-DD
repositories: [frontend-web, api-catalogo]
invest: { met: 0, partial: 0, not_met: 0, total: 6 }
dor: { met: 0, partial: 0, not_met: 0, total: 6 }
requirement: ../../requirements/SRS-XXX-slug/README.md   # solo si la US nació descomponiendo un SRS-XXX; omitir si no
spike: ../../work-items/WI-XXX-slug/README.md            # solo si la US formaliza el resultado de un WI-XXX de tipo spike; omitir si no
work_item:                                               # solo con tracker vinculado; omitir el objeto entero si no hay
  system: ADO
  id: 12345
  url: https://dev.azure.com/org/project/_workitems/edit/12345
---
<!--
Sustituir cada {{…}} a mano (no es un motor). Al publicar: borrar este bloque y todos los {{…}}.
Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. No repetir ningún campo del
frontmatter como línea `**Campo:**` bajo el título.
  status: Draft | Ready — único estado del artefacto.
  repositories: nombres git. work-plan agrupa las TK por este campo. Con implementation.scope: tests no se
    pregunta: va el nombre del propio repo de pruebas.
  invest / dor: resumen numérico derivado de las tablas de story-validation.md (archivo hermano, plantilla
    story-validation-template.md), nunca aparte. total = filas evaluadas (INVEST: 6; DoR: 6 menos las N/A, que
    no cuentan). Recalcular al tocar las tablas; en Draft sin validar, todo a 0.
  requirement: solo si la US nació descomponiendo un SRS-XXX de requirement-refine — ruta a su README.md; es
    la trazabilidad inversa de su tabla «Historias de usuario derivadas». Omitir la clave si no proviene de un SRS.
  spike: solo si la US formaliza el resultado de un WI-XXX de tipo spike — ruta a su README.md; el informe y
    la rama spike/ van en Referencias. Omitir la clave si no proviene de un spike.
  work_item: system = nombre corto del proveedor (p. ej. ADO). Lo pobla work-define solo al sincronizar
    desde el tracker (sync); una US redactada aquí no lo lleva salvo que el usuario lo aporte a mano (sí lo
    poblan siempre TK/WI/TC con tracker vinculado). Si se pone a mano: Criterios de aceptación → campo dedicado
    del sistema si lo expone; el resto del documento (frontmatter incluido, mapeado campo a campo, y todas las
    secciones) → descripción del work item, por secciones, para reconstruir la US si se pierde el .md. No omitir
    secciones.
-->
# US-XXX: {{título corto de la historia de usuario}}

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
Rutas permitidas: assets/ y wireframes/ (recursos propios de esta historia) o docs/architecture/ (documentación técnica
compartida). Los wireframes nunca van en assets/ ni en docs/architecture/: viven en wireframes/WF-XXX-{slug}.md (+ .svg
hermano) de esta carpeta si los generó work-define, o se enlazan en la carpeta del SRS de origen si se heredan
(../../requirements/SRS-XXX-[nombre-corto]/wireframes/WF-XXX-{slug}.md), sin copiarlos.
Al enlazar un elemento de la documentación técnica, copiar la referencia tal como la devuelve design-define, nunca el título
convertido a slug. Toda referencia es la ruta del archivo del elemento:
docs/architecture/[capability]/models/MD-XXX-{slug}.md, apis/API-XXX-{slug}.md (añadiendo el ancla de
operación #<método-ruta> cuando se cita un endpoint concreto, p. ej. apis/API-001-facturas.md#post-invoices),
flows/FL-XXX-{slug}.md o diagrams/DG-XXX-{slug}.md.
-->
- **Diseño / prototipo:** {{enlace markdown al diseño o prototipo}}
- **Wireframe:** {{[WF-XXX: pantalla](wireframes/WF-XXX-{slug}.md) — {{Proposed / Approved}}, uno por pantalla; si se hereda del SRS, enlazarlo en su carpeta; omitir si la US no tiene UI}}
- **Archivo local:** {{enlace markdown al archivo en assets/}}
- **Spike de origen:** {{[spike-report.md](../../work-items/WI-XXX-[slug]/spike-report.md) · rama `spike/WI-XXX-[slug]` @ sha — referencia de lectura, nunca para mergear; omitir si la US no proviene de un spike}}
- {{añadir entradas adicionales o indicar «Ninguna por ahora»}}

## Observaciones

- {{prerrequisitos o dependencias aún no listas}}
- {{datos o aclaraciones pendientes del usuario o de producto}}
- {{decisiones pendientes}}
- {{otras notas relevantes}}
