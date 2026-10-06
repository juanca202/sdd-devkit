# Vocabulario de requisitos y criterios: RFC 2119 y categorías (compartida)

Referencia transversal del plugin **SDD Devkit**. Vocabulario único para **enunciar y clasificar**
cualquier requisito o criterio verificable del catálogo: `AC-XXX` de una historia (`work-define`),
`FR-XXX` / `NFR-XXX` / `BR-XX` de un SRS (`requirement-refine`) y los requisitos de un estándar que
`quality-check` clasifica como bloqueantes o condicionales. Cada skill declara solo su delta (a qué
identificadores aplica y sus reglas propias); la tabla y los catálogos viven aquí.

## RFC 2119

Tabla de equivalencias para palabras clave normativas (en MAYÚSCULAS en el idioma de preferencia):


| Nivel (semántica RFC 2119) | Inglés (`en`)                | Español (`es`)                          |
| -------------------------- | ---------------------------- | --------------------------------------- |
| Obligación absoluta        | **MUST** / **REQUIRED**      | **DEBE** / **ES OBLIGATORIO**           |
| Prohibición absoluta       | **MUST NOT** / **SHALL NOT** | **NO DEBE** / **ESTÁ PROHIBIDO**        |
| Recomendación fuerte       | **SHOULD** / **RECOMMENDED** | **DEBERÍA** / **ES RECOMENDABLE**       |
| Desaconsejado salvo causa  | **SHOULD NOT**               | **NO DEBERÍA** / **NO ES RECOMENDABLE** |
| Permiso u opcionalidad     | **MAY** / **OPTIONAL**       | **PUEDE** / **OPCIONAL**                |

Elegir **una forma por nivel** y mantenerla consistente en todo el documento. La palabra clave va en
MAYÚSCULAS, en el idioma resuelto por [`language.md`](language.md).

## Categorías

Todo requisito o criterio declara **una** categoría de primer nivel. Si abarca más de una, se divide.

### Categorías funcionales

Usar cuando el enunciado describe comportamiento observable del sistema (qué hace, no cómo rinde o se comporta ante cargas):

| Categoría | Cuándo usarla |
| --------- | ------------- |
| Reglas de negocio | Restricciones, obligaciones o prohibiciones que impone el dominio o la organización |
| Casos de uso | Flujos de interacción actor-sistema de inicio a fin |
| Flujos de proceso | Pasos secuenciales o ramificados dentro de un proceso de negocio |
| Procesamiento de datos | Cálculos, transformaciones, validaciones o reglas sobre datos |
| Integraciones | Contratos con sistemas externos, APIs, eventos o mensajería |
| Interacción de usuario | Comportamiento de la interfaz, accesibilidad, retroalimentación al usuario |
| Salidas del sistema | Documentos, reportes, notificaciones, exportaciones generadas |

### Categorías no funcionales (ISO/IEC 25010)

Usar cuando el enunciado describe un atributo de calidad medible (rendimiento, seguridad, fiabilidad, etc.):

| Característica (`es`) | Característica (`en`) | Ejemplos |
| --------------------- | --------------------- | -------- |
| Idoneidad funcional | Functional suitability | Completitud de funciones, corrección, pertinencia |
| Eficiencia de rendimiento | Performance efficiency | Tiempos de respuesta, throughput, uso de recursos |
| Compatibilidad | Compatibility | Coexistencia, interoperabilidad |
| Usabilidad | Usability | Accesibilidad, aprendizaje, operabilidad |
| Fiabilidad | Reliability | Disponibilidad, tolerancia a fallos, recuperabilidad |
| Seguridad | Security | Confidencialidad, integridad, autenticación |
| Mantenibilidad | Maintainability | Modularidad, testabilidad, modificabilidad |
| Portabilidad | Portability | Adaptabilidad, instalabilidad |
