<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Este es el README.md de un REQUERIMIENTO EXTERNO (RQ-XXX): la forma mínima y trazable de un
requerimiento cuya DEFINICIÓN ES DE OTRO (el cliente, otro proveedor, un documento ya aprobado por un
tercero) y sobre el que este equipo SOLO CERTIFICA: acuerda qué criterios se prueban y genera casos de
prueba. No se cierran lagunas de producto ni se redefine alcance — lo que el documento fuente no diga
se pregunta como criterio a certificar o se registra como «Sin criterio». Lo crea únicamente
requirement-refine (tipo RQ). Vive en:
  <changesPath>/requirements/RQ-XXX-{slug}/README.md

El documento fuente se conserva ÍNTEGRO y sin editar en:
  <changesPath>/requirements/RQ-XXX-{slug}/references/   (una copia por versión recibida; nunca se sobrescribe)

Sus casos de prueba viven en la MISMA carpeta:
  <changesPath>/requirements/RQ-XXX-{slug}/test-cases/

Reglas de contenido:
  - Describe el comportamiento ESPERADO según el documento fuente; no inventar alcance.
  - Cada regla de negocio (BR-XX) y criterio de aceptación (AC-XXX) se deriva del documento fuente y
    CITA su fragmento (sección, ítem, HU, objetivo…) en la columna «Fuente»: es lo que permite que el
    dueño del documento reconozca a qué se refiere un AC cuando un TC falla.
  - La tabla «Cobertura de la fuente» es el espejo hacia arriba: cada ítem numerable del documento
    fuente apunta a los AC que lo certifican, o declara por qué no tiene criterio. Es lo que el dueño
    firma: QUÉ se certifica.
  - Estado: Ready solo cuando el usuario confirmó los AC-XXX, todos tienen identificador, enunciado
    RFC 2119 y fuente, y la Cobertura de la fuente no tiene ítems sin decidir; test-define exige Ready
    para generar los TCs.
  - No es un PRD ni un SRS: no fija objetivos de negocio, stack, repositorios ni FR/NFR propios. Si el
    caso cambia y se va a implementar, se crea el PRD/SRS desde el mismo insumo y este RQ se enlaza y se
    archiva — no se «convierte».
-->

# RQ-XXX: {{título corto del requerimiento}}

<!-- rq:status={{Draft|Ready}} -->
<!-- Marca oculta que se CONSERVA al publicar; claves y valores en inglés siempre, igual criterio que srs:status. La etiqueta visible de abajo sí va en el idioma resuelto. -->
**Estado:** {{Draft | Ready}}
**Fecha de creación:** {{YYYY-MM-DD}}
**Última actualización:** {{YYYY-MM-DD}}
**Dueño de la definición:** {{organización / área / persona responsable del documento fuente; p. ej. «Cliente — Gerencia de Tecnología»}}
**Documento fuente:** {{identificador y versión del documento recibido, tal como lo nombra su dueño; p. ej. «DTG-003 v1.1 (06/05/2025)»}} — {{enlace markdown a `references/<archivo>`}}
**Work Item ({{Sistema}}):** {{identificador del requerimiento en el gestor del dueño (p. ej. «Requerimiento #15428») y, si existe, enlace al work item del tracker propio. Es el ancla que sobrevive a cualquier renombrado local; obligatorio si el dueño lo tiene}}

## Resumen

{{Dos o tres líneas: qué pide el documento fuente y sobre qué sistema/módulo. Sin redefinir objetivos ni alcance — eso es del dueño.}}

**Fuera del alcance de certificación:** {{partes del documento fuente que explícitamente no se certifican aquí (p. ej. cambios de infraestructura, ETLs que prueba otro equipo), con el motivo}}

## Historial del documento fuente

<!--
Una fila por versión recibida. Cada versión se guarda como archivo nuevo en references/ (nunca se
reemplaza). Al recibir una versión nueva: diff de criterios contra la anterior, AC afectados marcados
y sus TC devueltos a Draft/Obsolete por test-define, y la Cobertura de la fuente actualizada.
-->
| Versión | Fecha | Archivo | Cambios con impacto en criterios |
| ------- | ----- | ------- | --------------------------------- |
| {{v1.0}} | {{YYYY-MM-DD}} | {{enlace a `references/<archivo>`}} | {{«Versión inicial» o resumen de qué AC se añaden/modifican/retiran}} |

## Reglas de negocio

<!--
Reglas que el documento fuente exige (validaciones, cálculos, condiciones, límites, transiciones, defaults, efectos).
Id secuencial BR-01, BR-02, … y enunciado con palabra clave RFC 2119 en MAYÚSCULAS.
Cada BR-XX debe estar verificada por al menos un AC-XXX. Omitir la sección con «Ninguna» si no hay.
-->
- **BR-01:** {{enunciado RFC 2119; p. ej. «El sistema DEBE…»}} — fuente: {{§/ítem del documento}} → verificado por {{AC-XXX}}
- **BR-02:** {{…}} — fuente: {{…}} → verificado por {{AC-XXX}}

## Criterios de aceptación

<!--
Id secuencial AC-001, AC-002, … Cada criterio indica su categoría, el enunciado con palabra clave
RFC 2119 en MAYÚSCULAS y la FUENTE: el fragmento del documento del dueño del que se deriva (sección,
ítem, HU, objetivo, tabla…), con la versión si cambió entre versiones.
Categorías funcionales: Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema
Categorías no funcionales (ISO/IEC 25010): Idoneidad funcional · Eficiencia de rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad · Portabilidad
Un ítem del documento fuente que no pueda formularse como criterio verificable NO genera un AC
«genérico»: se registra en Cobertura de la fuente como «Sin criterio (no verificable)» con el motivo.
-->
| ID | Categoría | Enunciado | Fuente |
| -- | --------- | --------- | ------ |
| AC-001 | {{categoría}} | {{enunciado RFC 2119 en MAYÚSCULAS}} | {{p. ej. «DTG-003 v1.1 §4 HU8»}} |
| AC-002 | {{…}} | {{…}} | {{…}} |

## Cobertura de la fuente

<!--
Una fila por cada ítem numerable del documento fuente (objetivo, HU, punto de alcance, regla…), en el
orden del documento. Es la vista que el dueño de la definición firma: qué de lo que escribió queda
certificado por qué AC, y qué no. Valores de «Cobertura»:
  Cubierto · Sin criterio (no verificable) · Fuera del alcance de certificación · Pendiente (laguna abierta)
Un RQ no puede declararse Ready con filas en «Pendiente».
-->
| Ítem del documento fuente | Cobertura | AC-XXX | Notas |
| ------------------------- | --------- | ------ | ----- |
| {{p. ej. «§3 Objetivo 3 — un solo rol por usuario»}} | {{Cubierto}} | {{AC-004, AC-005}} | {{}} |
| {{p. ej. «§3 Objetivo 5 — experiencia intuitiva»}} | {{Sin criterio (no verificable)}} | — | {{motivo; qué haría falta para que lo fuera}} |

## Referencias

<!--
Incluir únicamente enlaces a recursos ya almacenados; nunca pegar archivos ni imágenes aquí.
El documento fuente se guarda SIEMPRE, íntegro y sin editar, en references/ (una copia por versión).
-->
- **Documento fuente (todas las versiones):** {{enlaces markdown a `references/<archivo>`}}
- **Documentación técnica aportada por el dueño:** {{enlace markdown, o «Ninguna»}}
- **Referencias visuales:** {{enlace markdown a capturas, mockups o flujos del documento, o «Ninguna»}}
- **PRD/SRS relacionado:** {{enlace a `PRD-XXX`/`SRS-XXX` si más adelante este requerimiento se formalizó para implementación (número distinto: el RQ no se convierte), o «Ninguno»}}

## Observaciones

- {{supuestos tomados para poder certificar algo que el documento fuente no precisa}}
- {{preguntas abiertas al dueño de la definición}}
- {{otras notas relevantes}}
