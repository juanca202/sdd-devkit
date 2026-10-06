<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.
Una carpeta por capability: este README.md (índice) + models/ (un archivo por modelo, plantilla model-template.md)
+ apis/ (un archivo por GRUPO de endpoints, plantilla api-template.md) + flows/ (un archivo por flujo, plantilla
flow-template.md) + diagrams/ (un archivo por diagrama, plantilla diagram-template.md) + assets/ (apoyo exportado, solo si hay).
Los elementos llevan id secuencial por tipo (MD-XXX, API-XXX, FL-XXX, DG-XXX), estable en el tiempo: no renumerar
aunque se eliminen elementos (marcar como Obsoleto en su lugar).
Este README no define elementos: es el índice. Modelos, Grupos de APIs, Flujos y Diagramas viven cada uno en su
propio archivo, nombrado con el estándar MD-XXX-{slug} / API-XXX-{slug} / FL-XXX-{slug} / DG-XXX-{slug}
(models/MD-001-factura.md, apis/API-001-facturas.md, flows/FL-001-emision-factura.md, diagrams/DG-001-contexto.md;
slug kebab-case del nombre, fijado al crear el elemento — renombrar el elemento no renombra el archivo) y enlazado
desde las tablas índice de este README; su referencia es la ruta del archivo, sin ancla.
Un API-XXX agrupa los endpoints de una misma entidad o funcionalidad (todo el CRUD de proyectos en un archivo;
login/logout/forgot-password en otro); dentro del archivo cada operación lleva su ancla de método+ruta.
Las secciones Modelos de datos / APIs / Flujos / Diagramas son opcionales: incluir solo las que la capability necesite.
Los wireframes NO van en la capability: son un recurso del artefacto (SRS / US / WI) y viven en su carpeta.
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
| [MD-001](models/MD-001-{{slug}}.md) | {{nombre del modelo}} | {{una línea: qué representa}} |

## APIs / Endpoints

<!-- Tabla índice: un archivo por grupo de endpoints en apis/, con la plantilla api-template.md. Un grupo = una entidad o funcionalidad (todo el CRUD de un recurso y sus endpoints relacionados; o login/logout/forgot-password juntos). Enlazar cada archivo; no duplicar aquí sus contratos. -->

| Id | Grupo | Operaciones | Descripción |
| -- | ----- | ----------- | ----------- |
| [API-001](apis/API-001-{{slug}}.md) | {{nombre del grupo — entidad o funcionalidad}} | {{`POST /api/v1/recurso`, `GET /api/v1/recurso/{id}`, …}} | {{una línea: qué cubre el grupo}} |

## Flujos / Procesos

<!-- Tabla índice: un archivo por flujo en flows/, con la plantilla flow-template.md. Enlazar cada archivo; no duplicar aquí su contenido. -->

| Id | Flujo | Descripción |
| -- | ----- | ----------- |
| [FL-001](flows/FL-001-{{slug}}.md) | {{nombre del flujo}} | {{una línea: qué resuelve}} |

## Diagramas

<!-- Tabla índice: un archivo por diagrama en diagrams/, con la plantilla diagram-template.md. Enlazar cada archivo; no duplicar aquí su contenido. -->

| Id | Diagrama | Tipo | Alcance |
| -- | -------- | ---- | ------- |
| [DG-001](diagrams/DG-001-{{slug}}.md) | {{nombre del diagrama}} | {{Clases / Contexto (C4) / Contenedores (C4) / Componentes (C4) / Despliegue / Estados / Otro}} | {{una línea}} |

## Observaciones

<!-- Lagunas abiertas, decisiones pendientes, datos por confirmar. Si no hay nada: «Sin pendientes documentados». -->

- {{pendiente concreto, indicando el elemento afectado (MD-XXX / API-XXX / FL-XXX / DG-XXX) y, si aplica, la operación dentro del grupo}}
