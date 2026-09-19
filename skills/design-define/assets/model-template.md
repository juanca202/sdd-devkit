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

{{descripción breve del modelo y su rol en la capability}}

| Campo | Tipo | Requerido | Descripción | Validaciones / restricciones |
| ----- | ---- | --------- | ----------- | ---------------------------- |
| {{campo}} | {{tipo}} | {{Sí/No}} | {{qué representa}} | {{formato, rango, unicidad, valores permitidos; «—» si no hay}} |

**Relaciones:** {{relaciones con otros modelos (MD-XXX de esta u otra capability) o «Ninguna»}}

```mermaid
erDiagram
  {{diagrama ER solo si este modelo se relaciona con otros; omitir el bloque si no aporta}}
```
