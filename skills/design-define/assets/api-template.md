<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por GRUPO de endpoints, en apis/ dentro de la carpeta de la capability, nombrado con el estándar
API-XXX-{slug} (apis/API-001-proyectos.md, apis/API-002-autenticacion.md): id de 3 dígitos + slug kebab-case
del nombre del grupo, fijado al crear el grupo — renombrar el grupo después no renombra el archivo; el id es
el contrato de enlace.
El grupo reúne los endpoints de una misma ENTIDAD o FUNCIONALIDAD: todo el CRUD de proyectos y sus endpoints
relacionados en un archivo; login, logout, refresh y forgot-password en otro. Un endpoint pertenece a un solo
grupo.
Enlazar este archivo desde la tabla índice «APIs / Endpoints» del README.md de la capability. La referencia
que consumen US/TK/WI es la ruta del archivo (docs/architecture/{{capability}}/apis/API-001-proyectos.md),
sin ancla; para apuntar a un endpoint concreto se añade su ancla de operación (…#post-projects).
Cada operación lleva su ancla explícita en la línea anterior al ###, derivada de MÉTODO + RUTA SIN VERSIÓN:
se descartan los segmentos iniciales api y vN de la ruta, y el resto pasa a minúsculas con todo carácter no
alfanumérico convertido a guion (sin guiones repetidos ni al inicio/fin):
POST /api/v1/projects → post-projects · GET /api/v1/projects/{id} → get-projects-id · POST /auth/login → post-auth-login
El ancla omite la versión a propósito: subir de v1 a v2 no invalida los enlaces entrantes.
Referencias cruzadas: a un modelo, [MD-001](../models/MD-001-proyecto.md); a otro grupo de APIs de la misma
capability, [API-002](API-002-autenticacion.md); a un flujo, [FL-001](../flows/FL-001-alta-proyecto.md); a
otra capability, ruta relativa (../../{{otra-capability}}/apis/API-001-facturas.md).
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{API-XXX}}: {{nombre del grupo — p. ej. Proyectos, Autenticación}}

{{Descripción, máximo 4 líneas y sin título: qué entidad o funcionalidad cubre el grupo, prefijo de ruta común si lo hay
(p. ej. `/api/v1/projects`) y qué queda explícitamente fuera. Sin campos de cabecera.}}

## Operaciones

| Ancla | Método y ruta | Operación | Descripción |
| ----- | ------------- | --------- | ----------- |
| [#{{metodo-ruta}}](#{{metodo-ruta}}) | `{{POST /api/v1/recurso}}` | {{verbo + objeto}} | {{una línea}} |

---

<a id="{{metodo-ruta}}"></a>
### `{{POST /api/v1/recurso}}` — {{operación en verbo, p. ej. Crear proyecto}}

{{Qué hace y cuándo se usa, máximo 2 líneas. Sin campos: lo relativo a autenticación o permisos va en Notas.}}

**Request**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
| --------- | --------- | ---- | --------- | ----------- |
| {{nombre}} | {{path / query / header / body}} | {{tipo, o el modelo enlazado: [MD-XXX](../models/MD-XXX-{{slug}}.md)}} | {{Sí/No}} | {{…}} |

```json
{{ejemplo de request body; omitir el bloque si no hay body}}
```

**Responses**

| Código | Condición | Cuerpo |
| ------ | --------- | ------ |
| {{200/201}} | {{caso de éxito}} | {{tipo, o el modelo enlazado: [MD-XXX](../models/MD-XXX-{{slug}}.md)}} |
| {{4XX}} | {{condición de error}} | {{estructura de error estándar del proyecto}} |

```json
{{ejemplo de response de éxito}}
```

<!-- Repetir el bloque anterior (ancla + ###) por cada operación del grupo, en el orden de la tabla. -->

## Notas

- {{Autenticación y permisos: mecanismo y roles del grupo, y las operaciones que difieren (p. ej. «Bearer JWT, rol `billing:read`; `POST` requiere `billing:write`»); «Pública» si no hay — nunca omitirlo}}
- {{otras observaciones comunes al grupo: paginación, idempotencia, versionado, cabeceras compartidas}}

## Historial de cambios

<!-- Una fila por modificación posterior a la creación; omitir la sección mientras no haya cambios. -->
| Fecha | Cambio | Origen |
| ----- | ------ | ------ |
| {{YYYY-MM-DD}} | {{operación añadida, quitada o corregida (método + ruta) y qué cambió}} | {{US-XXX / TK-XXX / WI-XXX / ADR-XXX o pedido del usuario}} |
