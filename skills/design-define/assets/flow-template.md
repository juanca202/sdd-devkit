<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el archivo final.
Un archivo por flujo, en flows/ dentro de la carpeta de la capability, nombrado con el estándar
FL-XXX-{slug} (flows/FL-001-emision-factura.md): id de 3 dígitos + slug kebab-case del nombre, fijado al
crear el flujo — renombrar el flujo después no renombra el archivo; el id es el contrato de enlace.
Enlazar este archivo desde la tabla índice «Flujos / Procesos» del README.md de la capability. La referencia
que consumen US/TK/WI es la ruta del archivo (docs/architecture/{{capability}}/flows/FL-001-emision-factura.md), sin ancla.
Referencias cruzadas: a otro flujo de la misma capability, [FL-002](FL-002-anulacion.md); a un modelo,
[MD-001](../models/MD-001-factura.md); a un endpoint, [API-001](../apis/API-001-facturas.md#post-invoices); a otra
capability, ruta relativa (../../{{otra-capability}}/flows/FL-001-emision-factura.md).
Formato detallado en references/element-standards.md del skill design-define.
-->

# {{FL-XXX}}: {{nombre del flujo}}

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
