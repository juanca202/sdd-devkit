<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por modelo, en models/ dentro de la carpeta de la capability, nombrado con el estándar
MD-XXX-{slug} (models/MD-001-factura.md): id de 3 dígitos + slug kebab-case del nombre, fijado al crear el
modelo — renombrar el modelo después no renombra el archivo; el id es el contrato de enlace.
Enlazar este archivo desde la tabla índice «Modelos de datos» del README.md de la capability. La referencia
que consumen US/TK/WI es la ruta del archivo (docs/architecture/{{capability}}/models/MD-001-factura.md), sin ancla.
Referencias cruzadas: a otro modelo de la misma capability, [MD-002](MD-002-linea-factura.md); a un endpoint de un
grupo de APIs, [API-001](../apis/API-001-facturas.md#post-invoices); a otra capability, ruta relativa
(../../{{otra-capability}}/models/MD-001-factura.md).
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{MD-XXX}}: {{nombre del modelo}}

{{Descripción, máximo 4 líneas y sin título: qué representa el modelo, su rol en la capability y si es entidad
persistida, DTO de transporte o proyección/vista.}}

## Campos

| Campo | Tipo | Requerido | Descripción | Validaciones / restricciones |
| ----- | ---- | --------- | ----------- | ---------------------------- |
| {{campo}} | {{tipo, o el modelo enlazado si el campo es una relación: [MD-XXX](MD-XXX-{{slug}}.md), [MD-XXX](MD-XXX-{{slug}}.md)[] o ../../{{otra-capability}}/models/MD-XXX-{{slug}}.md}} | {{Sí/No}} | {{qué representa; en una relación, su cardinalidad}} | {{formato, rango, unicidad, valores permitidos; «—» si no hay}} |

## Relaciones de {{nombre del modelo}}

```mermaid
erDiagram
  {{diagrama ER solo si este modelo se relaciona con otros; omitir el título y el bloque si no aporta}}
```

## Notas

- {{datos adicionales: índices, ciclo de vida/estados, reglas de negocio que cruzan varios campos, origen del dato; omitir la sección si no hay}}

## Historial de cambios

<!-- Una fila por modificación posterior a la creación; omitir la sección mientras no haya cambios. -->
| Fecha | Cambio | Origen |
| ----- | ------ | ------ |
| {{YYYY-MM-DD}} | {{qué se añadió, quitó o corrigió}} | {{US-XXX / TK-XXX / WI-XXX / ADR-XXX o pedido del usuario}} |
