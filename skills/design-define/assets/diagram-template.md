<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por diagrama, en diagrams/ dentro de la carpeta de la capability, nombrado por su id en minúsculas
(diagrams/dg-01.md) — nunca por el nombre del diagrama: el id es estable, el nombre puede cambiar.
Enlazar este archivo desde la tabla índice «Diagramas» del README.md de la capability. La referencia que
consumen US/TK/WI es la ruta del archivo (docs/specs/technical-docs/{{capability}}/diagrams/dg-01.md), sin ancla.
Si el diagrama existe además como archivo exportado (draw.io, imagen), guardarlo en ../assets/ y enlazarlo aquí.
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{DG-XX}}: {{nombre del diagrama — p. ej. Diagrama de clases del dominio, Contexto de la capability}}

- **Tipo:** {{Clases | Contexto (C4) | Contenedores (C4) | Componentes (C4) | Despliegue | Estados | Otro}}
- **Alcance:** {{qué parte de la capability cubre y qué queda fuera}}

```mermaid
{{classDiagram, C4Context, C4Container, C4Component, stateDiagram-v2… según el tipo; ver element-standards.md}}
```

**Notas**

- {{decisión o aclaración que el diagrama no expresa por sí solo; citar elementos por id (MD-XX, API-XX, FL-XX) cuando aplique; omitir la lista si no hay notas}}
