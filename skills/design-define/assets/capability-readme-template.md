<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.
Una carpeta por capability: este README.md (detalle) + models/ (un archivo por modelo, plantilla model-template.md)
+ diagrams/ (un archivo por diagrama, plantilla diagram-template.md) + assets/ (apoyo exportado, solo si hay).
Los elementos llevan id secuencial por tipo (MD-XX, API-XX, FL-XX, DG-XX), estable en el tiempo: no renumerar
aunque se eliminen elementos (marcar como Obsoleto en su lugar).
APIs y Flujos viven en este README, cada uno precedido de su ancla explícita en la línea anterior al ###, con el
id en minúsculas y sin el nombre: la etiqueta <a> de HTML con id="{{id-en-minusculas}}". Esa ancla (#api-04,
#fl-02) es la referencia que consumen US/TK/WI; ver references/element-standards.md.
Modelos y Diagramas viven cada uno en su propio archivo (models/md-01.md, diagrams/dg-01.md), nombrado por su id
en minúsculas — nunca por el nombre del elemento — y enlazado desde las tablas índice de este README; su
referencia es la ruta del archivo, sin ancla.
Las secciones Modelos de datos / APIs / Flujos / Diagramas son opcionales: incluir solo las que la capability necesite.
-->

# Capability: {{nombre de la capability}}

**Fecha de creación:** {{YYYY-MM-DD}}
**Última actualización:** {{YYYY-MM-DD}}

## Propósito

{{una o dos frases: qué cubre esta capability y qué queda fuera de su alcance}}

## Modelos de datos

<!-- Tabla índice: un archivo por modelo en models/, con la plantilla model-template.md. Enlazar cada archivo; no duplicar aquí su contenido. -->

| Id | Modelo | Descripción |
| -- | ------ | ----------- |
| [MD-01](models/md-01.md) | {{nombre del modelo}} | {{una línea: qué representa}} |

## APIs / Endpoints

<a id="api-01"></a>
### API-01: {{operación en verbo — p. ej. Crear factura}}

- **Método y ruta:** `{{POST /api/v1/recurso}}`
- **Autenticación:** {{mecanismo y permisos/roles requeridos, o «Pública»}}
- **Descripción:** {{qué hace y cuándo se usa}}

**Request**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
| --------- | --------- | ---- | --------- | ----------- |
| {{nombre}} | {{path / query / header / body}} | {{tipo o MD-XX}} | {{Sí/No}} | {{…}} |

```json
{{ejemplo de request body; omitir el bloque si no hay body}}
```

**Responses**

| Código | Condición | Cuerpo |
| ------ | --------- | ------ |
| {{200/201}} | {{caso de éxito}} | {{tipo o MD-XX}} |
| {{4XX}} | {{condición de error}} | {{estructura de error estándar del proyecto}} |

```json
{{ejemplo de response de éxito}}
```

## Flujos / Procesos

<a id="fl-01"></a>
### FL-01: {{nombre del flujo}}

- **Disparador:** {{qué inicia el flujo: acción de usuario, evento, programación}}
- **Actores / componentes:** {{quiénes participan}}
- **Resultado:** {{estado final esperado}}

```mermaid
{{sequenceDiagram o flowchart según convenga; ver element-standards.md}}
```

**Pasos**

1. {{paso con actor/componente explícito}}
2. {{…}}

**Manejo de errores**

| Paso | Error posible | Comportamiento esperado |
| ---- | ------------- | ----------------------- |
| {{n}} | {{condición}} | {{reintento, compensación, mensaje, aborto}} |

## Diagramas

<!-- Tabla índice: un archivo por diagrama en diagrams/, con la plantilla diagram-template.md. Enlazar cada archivo; no duplicar aquí su contenido. -->

| Id | Diagrama | Tipo | Alcance |
| -- | -------- | ---- | ------- |
| [DG-01](diagrams/dg-01.md) | {{nombre del diagrama}} | {{Clases / Contexto (C4) / Contenedores (C4) / Componentes (C4) / Despliegue / Estados / Otro}} | {{una línea}} |

## Observaciones

<!-- Lagunas abiertas, decisiones pendientes, datos por confirmar. Si no hay nada: «Sin pendientes documentados». -->

- {{pendiente concreto, indicando el elemento afectado (MD-XX / API-XX / FL-XX / DG-XX)}}
