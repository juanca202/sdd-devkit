---
id: TC-XXX
type: test-case
status: Draft                         # Draft | Ready | Obsolete
test_type: [Unit, E2E]                # intención de diseño. [Manual] solo cuando el caso no se automatiza por diseño (no se combina). Tipos: Unit | Integration | API Test | Visual Test | E2E, uno o varios en ESE orden (de menor a mayor nivel). Con implementation.scope: tests, solo Manual | API Test | Visual Test | E2E (nunca Unit ni Integration)
created: YYYY-MM-DD
perspective: Happy Path               # Happy Path | Error | Boundary
priority: High                        # High | Medium | Low
criterion: AC-XXX                     # identificador del criterio tal como aparece en el artefacto origen (AC-XXX, 1.1, R-3, …) — no normalizar el formato; debe existir literalmente en el artefacto
parent: US-XXX                        # US-XXX | WI-XXX | FT-XXX | identificador o ruta del artefacto externo
created_by: "Nombre Apellido"
work_item:                            # solo si se creó vía MCP en el gestor vinculado; omitir el objeto entero si no
  system: ADO                         # nombre corto que define la referencia del proveedor (p. ej. ADO → references/azure-devops.md)
  id: 12345
  url: https://…
---
<!--
Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. Las claves marcadas «omitir» se
quitan enteras cuando no aplican. No repetir ningún campo del frontmatter como línea `**Campo:**` bajo el título.

# Plantilla de caso de prueba — IEEE 29119-4

Convención de placeholders: sustituir manualmente cada {{texto}}.
Eliminar este bloque al publicar el documento final.

Ubicación por tipo de artefacto:
  US:   <changesPath>/user-stories/US-XXX-{nombre}/test-cases/TC-XXX-{slug}.md
  WI:   <changesPath>/work-items/WI-XXX-{kebab-case}/test-cases/TC-XXX-{slug}.md
  FT: <currentPath>/FT-XXX-{slug}/test-cases/TC-XXX-{slug}.md
  Otro artefacto de especificación (cualquier origen o formato):
        {carpeta-del-artefacto}/test-cases/TC-XXX-{slug}.md

Nombre de archivo: TC-XXX-{slug}.md
  XXX  → secuencial de tres dígitos dentro del artefacto padre (001, 002, ...) sin tracker externo vinculado;
         o el identificador que asigne el sistema externo vinculado, según el formato de su archivo de referencia (p. ej. ID numérico sin padding en Azure DevOps — ver references/azure-devops.md)
  slug → descripción corta en kebab-case del escenario (ej: login-password-incorrecto)

El nombre del archivo y, si hay un tracker externo vinculado, el título usado al crear el work item deben respetar cualquier límite de longitud propio de ese sistema (ver su archivo de referencia).
-->
# TC-{{XXX}} — Dado {{contexto/precondición}}, Cuando {{acción/evento}}, Entonces {{resultado esperado}}

## Precondiciones

- {{Estado del sistema antes de ejecutar el caso. Incluir: datos existentes, usuarios autenticados, configuración de entorno, permisos requeridos.}}

## Datos de prueba

| Campo | Valor | Notas |
|-------|-------|-------|
| {{campo}} | {{valor}} | {{restricción o formato esperado}} |

> Si no aplican datos de prueba específicos, escribir "N/A".

## Pasos de ejecución

| # | Actor | Acción | Resultado esperado |
|---|-------|--------|-----------------------------|
| 1 | {{usuario / sistema}} | {{acción concreta}} | {{qué debe ocurrir después de este paso}} |
| 2 | {{usuario / sistema}} | {{acción concreta}} | {{qué debe ocurrir después de este paso}} |

## Resultado esperado final

{{Descripción del estado observable del sistema una vez ejecutados todos los pasos: respuesta de la UI, código HTTP, mensaje, registro en base de datos, evento publicado, etc.}}

## Observaciones

{{Dependencias con otros TCs, datos de entorno específicos, limitaciones conocidas, comportamientos aceptados como excepción.}}
