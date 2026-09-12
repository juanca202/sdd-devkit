<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por modelo, en models/ dentro de la carpeta de la capability, nombrado por su id en minúsculas
(models/md-01.md) — nunca por el nombre del modelo: el id es estable, el nombre puede cambiar.
Enlazar este archivo desde la tabla índice «Modelos de datos» del README.md de la capability. La referencia
que consumen US/TK/WI es la ruta del archivo (docs/architecture/{{capability}}/models/md-01.md), sin ancla.
Referencias cruzadas: a otro modelo de la misma capability, [MD-02](md-02.md); a un elemento del README,
[API-01](../README.md#api-01); a otra capability, ruta relativa (../../{{otra-capability}}/models/md-01.md).
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{MD-XX}}: {{nombre del modelo}}

{{descripción breve del modelo y su rol en la capability}}

| Campo | Tipo | Requerido | Descripción | Validaciones / restricciones |
| ----- | ---- | --------- | ----------- | ---------------------------- |
| {{campo}} | {{tipo}} | {{Sí/No}} | {{qué representa}} | {{formato, rango, unicidad, valores permitidos; «—» si no hay}} |

**Relaciones:** {{relaciones con otros modelos (MD-XX de esta u otra capability) o «Ninguna»}}

```mermaid
erDiagram
  {{diagrama ER solo si este modelo se relaciona con otros; omitir el bloque si no aporta}}
```
