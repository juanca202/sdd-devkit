---
id: BUG-XXX
type: incident
status: Draft                         # Draft | Ready
repository: sistema-bajo-prueba       # obligatorio para Ready: nombre del sistema bajo prueba tal como lo declara AGENTS.md
test_case: ../../user-stories/US-XXX-slug/test-cases/TC-XXX-slug.md   # TC que detectó el hallazgo; si no nace de un TC, omitir y explicar en Descripción cómo se observó
criterion: AC-XXX                     # identificador verbatim del criterio que el TC verifica (AC-XXX, 1.1, R-3, …); omitir si no hay TC
parent: US-XXX                        # US-XXX | WI-XXX | FT-XXX del TC; omitir si no hay TC
test_type: API Test                   # API Test | Visual Test | E2E | Manual — el nivel con el que se ejecutó
automated_test: "nombre del caso en el runner — ruta/al/spec.ext"   # incluye el ID del TC; omitir si la ejecución fue manual
environment: "QA · build 1.4.2 · Chrome 130"   # nombre del ambiente (nunca la URL ni valores del .env) · build/versión · navegador/dispositivo si aplica
executed_at: "YYYY-MM-DD HH:mm"
frequency: Always                     # Always | Intermittent (N of M runs)
reported_by: "Nombre Apellido"        # indicado por el usuario; si no, `git config user.name`
work_item:                            # work item `Bug` creado en el gestor vinculado — solo si se creó; omitir el objeto entero si no
  system: ADO
  id: 12345
  url: https://…
---
<!--
Frontmatter (bloque YAML de arriba, SIEMPRE en la línea 1): claves y valores enumerados en inglés; es lo que leen
los demás skills. Contrato en ../../references/frontmatter.md. Dentro del bloque no van {{…}} (no es YAML válido):
sustituir los valores de ejemplo y, si se quiere, borrar los comentarios `# …`. Las claves marcadas «omitir» se
quitan enteras cuando no aplican. No repetir ningún campo del frontmatter como línea `**Campo:**` bajo el título.

Plantilla de un INCIDENTE (BUG-XXX) en un repositorio SOLO DE PRUEBAS (`implementation.scope: tests`).
Sustituye a `incident-template.md` en ese modo; con `scope: code` (o sin la clave) NO se usa.

En modo pruebas el incidente es el único documento que produce `work-plan` (el reporte de un hallazgo), y
nace de ejecutar un caso de prueba, así que tiene la forma del caso de prueba que lo detectó
(`test-define/assets/test-case-template.md`): mismas secciones y mismo orden — Precondiciones, Datos de prueba, Pasos de ejecución, Resultado esperado final —, cada una
ampliada con lo que ocurrió al ejecutarlo: lo observado, los comentarios necesarios para reproducirlo, los
hallazgos y las evidencias que registró la suite.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Nunca incluir credenciales, tokens, cookies ni valores del `.env`: los ambientes y las variables se citan
por NOMBRE. El documento describe qué está mal, nunca cómo corregirlo.
-->
# BUG-XXX: {{título corto del hallazgo}}

## Descripción

{{qué está mal, en una o dos frases: el comportamiento del sistema que difiere del documentado en el TC. Sin causa supuesta ni solución}}

## Precondiciones

<!-- Las del TC, tal como se cumplieron en la ejecución. Añadir cualquier estado adicional que resultó necesario para que el fallo aparezca (rol, datos previos, configuración, orden de ejecución). -->
- {{estado del sistema, usuario/rol (sin credenciales), datos existentes, configuración de entorno}}

## Datos de prueba

<!-- Los del TC con los valores REALMENTE usados en la ejecución. Un dato sensible se cita por el nombre de su variable (`TEST_USER_EMAIL`), nunca por su valor. "N/A" si no aplican. -->
| Campo | Valor usado | Notas |
|-------|-------------|-------|
| {{campo}} | {{valor o nombre de variable}} | {{restricción, formato o por qué importa para reproducir}} |

## Pasos de ejecución

<!--
Los mismos pasos del TC, en el mismo orden y con la misma numeración, ampliados con dos columnas:
- Resultado observado: lo que ocurrió de verdad, literal (mensaje, código HTTP, estado en pantalla, valor
  devuelto). En los pasos que se comportaron como se esperaba: «Conforme».
- Comentarios: lo que alguien necesita saber para REPRODUCIR el paso y que el TC no dice — esperas,
  selector o endpoint exacto, cuerpo de la petición, orden, datos que hay que sembrar antes, diferencias
  entre ejecuciones — y la referencia al hallazgo (`H-XX`) y a la evidencia (`EV-XX`) de ese paso.
Marcar con ❌ el paso donde aparece el fallo; los posteriores que no llegaron a ejecutarse: «No ejecutado».
Si para reproducir hizo falta un paso que el TC no tiene, insertarlo con numeración `2a`, `2b`… y decirlo
en Comentarios: no se renumera el TC.
-->
| # | Actor | Acción | Resultado esperado del paso | Resultado observado | Comentarios |
|---|-------|--------|-----------------------------|---------------------|-------------|
| 1 | {{usuario / sistema}} | {{acción concreta}} | {{del TC}} | Conforme | {{detalle para reproducir, o vacío}} |
| 2 ❌ | {{usuario / sistema}} | {{acción concreta}} | {{del TC}} | {{lo que ocurrió, literal}} | {{detalle para reproducir}} · H-01 · EV-01 |
| 3 | {{usuario / sistema}} | {{acción concreta}} | {{del TC}} | No ejecutado | |

## Resultado esperado final

{{el del TC, citando la fuente: `TC-XXX` y el criterio que verifica}}

## Resultado observado final

{{estado real del sistema al terminar la ejecución: respuesta de la UI, código HTTP, mensaje, error del runner / aserción que falló (literal, sin datos sensibles)}}

## Hallazgos

<!--
Uno por comportamiento incorrecto distinto observado en la ejecución. Id secuencial H-01, H-02, … dentro
del documento. Solo QUÉ está mal — nunca la causa supuesta como hecho ni la solución (una hipótesis, si el
usuario la aporta, va en Observaciones marcada como hipótesis). Si los hallazgos son defectos
independientes entre sí, proponer al usuario un incidente por defecto en lugar de acumularlos aquí.
Severidad (obligatoria, solo estos cuatro valores): Crítico = bloquea el flujo o corrompe datos · Alto = sin
alternativa razonable · Medio = con alternativa · Bajo = cosmético. La `Severidad` de Impacto es la más
alta de esta columna.
-->
| ID | Paso | Hallazgo | Esperado | Observado | Severidad | Evidencia |
|----|------|----------|----------|-----------|-----------|-----------|
| H-01 | {{#}} | {{qué está mal, una frase}} | {{según TC / AC-XXX}} | {{literal}} | {{Crítico \| Alto \| Medio \| Bajo}} | {{EV-01, EV-02}} |

## Evidencias

<!--
Los artefactos que la SUITE registró para esta prueba en la ejecución fallida (capturas, video, traza,
reporte del runner, log, respuesta de la API, diff visual), COPIADOS a `assets/` de este incidente y enlazados
por ruta relativa — no se enlaza la carpeta de salida del runner, que suele estar en `.gitignore` y se
sobrescribe en la siguiente ejecución. Id secuencial EV-01, EV-02, … Al menos una fila para Ready.
Un artefacto que no se adjunta (contiene datos de sesión, pesa demasiado, no existe) se lista igual, con
«No adjuntado — motivo» en Archivo y su ruta de origen en Notas. Nunca tokens, cookies ni credenciales.
-->
| ID | Tipo | Archivo | Paso / Hallazgo | Notas |
|----|------|---------|-----------------|-------|
| EV-01 | {{Captura \| Video \| Traza \| Reporte del runner \| Log \| Respuesta de API \| Diff visual}} | [{{nombre}}](assets/{{EV-01-nombre.ext}}) | {{paso # · H-XX}} | {{qué muestra; ruta de origen en la salida del runner}} |

## Impacto

**Severidad:** {{Crítico (bloquea el flujo o corrompe datos) | Alto (sin alternativa razonable) | Medio (con alternativa) | Bajo (cosmético)}}
**Alcance:** {{a quién o qué afecta: actores, módulos, ambientes; otros `TC-XXX` bloqueados por este hallazgo}}
**Origen del hallazgo:** {{automatización de `TC-XXX` (work-implement) | ejecución manual de `TC-XXX` | `coverage-verify` | quality-check | otro}}
**Resolución:** {{Open | Fixing (<work item del repositorio de la aplicación>) | Fixed (<work item>) | Discarded — motivo}}

## Observaciones

<!--
Usar solo si hay ítems reales: evidencia que no se pudo adjuntar, datos que faltan para reproducir,
hipótesis de causa aportada por el usuario (marcada como hipótesis), TC relacionados. Con pendientes que
impidan reproducir: `Estado: Draft`. Si no hay nada, omitir la sección.
-->
- {{pendiente o nota concreta}}
