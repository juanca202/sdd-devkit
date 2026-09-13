<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por diagrama, en diagrams/ dentro de la carpeta de la capability, nombrado con el estándar
DG-XXX-{slug} (diagrams/DG-001-contexto.md): id de 3 dígitos + slug kebab-case del nombre, fijado al crear el
diagrama — renombrar el diagrama después no renombra el archivo; el id es el contrato de enlace.
Enlazar este archivo desde la tabla índice «Diagramas» del README.md de la capability. La referencia que
consumen US/TK/WI es la ruta del archivo (docs/architecture/{{capability}}/diagrams/DG-001-contexto.md), sin ancla.
Si el diagrama existe además como archivo exportado (draw.io, imagen), guardarlo en ../assets/ y enlazarlo aquí.
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{DG-XXX}}: {{nombre del diagrama — p. ej. Diagrama de clases del dominio, Contexto de la capability}}

- **Tipo:** {{Clases | Contexto (C4) | Contenedores (C4) | Componentes (C4) | Despliegue | Estados | Otro}}
- **Alcance:** {{qué parte de la capability cubre y qué queda fuera}}

```mermaid
{{classDiagram, C4Context, C4Container, C4Component, stateDiagram-v2… según el tipo; ver element-standards.md}}
```

**Notas**

- {{decisión o aclaración que el diagrama no expresa por sí solo; citar elementos por id (MD-XXX, API-XXX, FL-XXX) cuando aplique; omitir la lista si no hay notas}}
