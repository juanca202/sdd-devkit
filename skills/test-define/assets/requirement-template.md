<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Este es el README.md de un REQUERIMIENTO (RQ-XXX): la forma mínima y trazable de un
requerimiento que llegó a test-define EN BRUTO (texto en la conversación o documento adjunto
que no vive en el proyecto). Existe para que los casos de prueba tengan un
artefacto padre con criterios identificados. Lo crea únicamente test-define. Vive en:
  <changesPath>/requirements/RQ-XXX-{slug}/README.md

Sus casos de prueba viven en la MISMA carpeta:
  <changesPath>/requirements/RQ-XXX-{slug}/test-cases/

Reglas de contenido:
  - Describe el comportamiento ESPERADO según el requerimiento recibido; no inventar alcance.
    Lo que el requerimiento no diga y haga falta para probar se pregunta o se anota como
    supuesto en Observaciones.
  - Cada regla de negocio (BR-XX) y criterio de aceptación (AC-XXX) se deriva del
    requerimiento original, que se conserva íntegro en assets/ y se enlaza abajo.
  - Estado: Ready solo cuando el usuario confirmó los AC-XXX y todos tienen código de
    identificación y enunciado RFC 2119; test-define exige Ready para generar los TCs.
  - No es un SRS: no fija stack, repositorios ni requisitos FR/NFR de alto nivel (eso es
    requirement-refine), ni es una historia de usuario (work-define).
-->

# RQ-XXX: {{título corto del requerimiento}}

**Estado:** {{Draft | Ready}}
**Fecha de creación:** {{YYYY-MM-DD}}
**Última actualización:** {{YYYY-MM-DD}}
**Procedencia:** {{origen del requerimiento: "texto entregado por el usuario" | "documento <nombre>" | "ticket/correo <referencia>"}}
**Work Item ({{Sistema}}):** {{enlace markdown al work item del requerimiento en el gestor de proyectos — solo si el requerimiento se entregó como un work item existente; omitir línea si no aplica. test-define no crea este work item}}

## Descripción funcional

<!--
Qué pide el requerimiento, centrado en lo observable. Debe dejar claro el alcance a probar:
qué cubre y qué queda fuera. Incluir actores o módulo solo si ayudan a delimitarlo.
-->

{{Qué debe hacer el sistema según este requerimiento: capacidad y comportamientos
observables. Un objetivo principal enunciable en una oración.}}

{{Qué no cubre / fuera de alcance: comportamientos cercanos que el requerimiento no pide.}}

## Reglas de negocio

<!--
Reglas que el requerimiento exige (validaciones, cálculos, condiciones, límites, transiciones, defaults, efectos).
Id secuencial BR-01, BR-02, … y enunciado con palabra clave RFC 2119 en MAYÚSCULAS.
Cada BR-XX debe estar verificada por al menos un AC-XXX. Omitir la sección con «Ninguna» si no hay.
-->

- **BR-01:** {{enunciado RFC 2119; p. ej. «El sistema DEBE…»}} → verificado por {{AC-XXX}}
- **BR-02:** {{…}} → verificado por {{AC-XXX}}

## Criterios de aceptación

<!--
Lista plana con id secuencial AC-001, AC-002, … Cada criterio indica su categoría entre
paréntesis y el enunciado con palabra clave RFC 2119 en MAYÚSCULAS.
Categorías funcionales: Reglas de negocio · Casos de uso · Flujos de proceso · Procesamiento de datos · Integraciones · Interacción de usuario · Salidas del sistema
Categorías no funcionales (ISO/IEC 25010): Idoneidad funcional · Eficiencia de rendimiento · Compatibilidad · Usabilidad · Fiabilidad · Seguridad · Mantenibilidad · Portabilidad
-->

- **AC-001 ({{categoría}}):** {{enunciado RFC 2119 en MAYÚSCULAS}}
- **AC-002 ({{categoría}}):** {{…}}

## Referencias

<!--
Incluir únicamente enlaces a recursos ya almacenados; nunca pegar archivos ni imágenes aquí.
El requerimiento original se guarda SIEMPRE, íntegro y sin editar, en assets/.
-->

- **Requerimiento original:** {{enlace markdown a assets/<archivo> con el texto o documento recibido}}
- **Documentación técnica:** {{enlace markdown, o «Ninguna»}}
- **Referencias visuales:** {{enlace markdown a mockup, diagrama o flujo, o «Ninguna»}}
- {{añadir entradas adicionales o indicar «Ninguna por ahora»}}

## Observaciones

- {{supuestos asumidos al derivar los criterios y lagunas que mantienen el requerimiento en Draft}}
- {{otras notas relevantes}}
