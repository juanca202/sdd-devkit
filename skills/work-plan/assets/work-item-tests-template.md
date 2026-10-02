<!--
Plantilla de un WI en un repositorio SOLO DE PRUEBAS (`implementation.scope: tests`). Sustituye a
`work-item-template.md` en ese modo; con `scope: code` (o sin la clave) NO se usa.

En modo pruebas el único tipo de WI es `bug` (el reporte de un hallazgo), así que el documento tiene la
forma del caso de prueba que lo detectó (`test-define/assets/test-case-template.md`): mismas secciones y
mismo orden — Precondiciones, Datos de prueba, Pasos de ejecución, Resultado esperado final —, cada una
ampliada con lo que ocurrió al ejecutarlo: lo observado, los comentarios necesarios para reproducirlo, los
hallazgos y las evidencias que registró la suite.

Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Nunca incluir credenciales, tokens, cookies ni valores del `.env`: los ambientes y las variables se citan
por NOMBRE. El documento describe qué está mal, nunca cómo corregirlo.
-->
# WI-XXX: {{título corto del hallazgo}}

<!-- wi:status={{Draft|Ready}} -->
<!--
Esta marca se CONSERVA al publicar. Sus claves y sus valores van en inglés SIEMPRE, aunque el resto del
documento esté en otro idioma: es el ancla que otros skills parsean, no contenido. La etiqueta visible
de abajo sí se redacta en el idioma resuelto. Ver ../../references/verdicts.md.
-->
**Estado:** {{Draft | Ready}}
**Tipo:** bug
**Repositorio:** {{obligatorio para Ready: nombre del sistema bajo prueba tal como lo declara `AGENTS.md`}}
**Caso de prueba:** {{enlace por ruta relativa al `TC-XXX-{slug}.md` que detectó el hallazgo + su título; si el hallazgo no nace de un TC, `N/A — {{cómo se observó}}`}}
**Criterio de aceptación:** {{identificador verbatim del criterio que el TC verifica (AC-XXX, 1.1, R-3, …) + título corto; omitir línea si no hay TC}}
**Artefacto padre:** {{US-XXX | WI-XXX | FT-XXX del TC, enlazado por ruta relativa; omitir línea si no hay TC}}
**Tipo de prueba:** {{API Test | Visual Test | E2E | Manual — el nivel con el que se ejecutó}}
**Prueba automatizada:** {{nombre del caso tal como lo reporta el runner (incluye el ID del TC) — `ruta/al/spec.ext`; omitir línea si la ejecución fue manual}}
**Ambiente:** {{nombre del ambiente (nunca la URL ni valores del `.env`) · build/versión del sistema si se conoce · navegador/dispositivo si aplica}}
**Fecha de ejecución:** {{YYYY-MM-DD HH:mm}}
**Frecuencia:** {{Siempre | Intermitente (N de M ejecuciones)}}
**Asignado a:** {{opcional: priorizar lo indicado por el usuario; si no, inferir con `git config user.name`; omitir línea si no aplica}}
**Work Item ({{Sistema}}):** {{enlace markdown al work item creado en el sistema de seguimiento vinculado — solo si se creó; omitir línea si no aplica}}

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
independientes entre sí, proponer al usuario un WI por defecto en lugar de acumularlos aquí.
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
reporte del runner, log, respuesta de la API, diff visual), COPIADOS a `assets/` de este WI y enlazados
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
**Resolución:** {{Abierto | En corrección (<work item del repositorio de la aplicación>) | Corregido (<work item>) | Descartado — motivo}}

## Observaciones

<!--
Usar solo si hay ítems reales: evidencia que no se pudo adjuntar, datos que faltan para reproducir,
hipótesis de causa aportada por el usuario (marcada como hipótesis), TC relacionados. Con pendientes que
impidan reproducir: `Estado: Draft`. Si no hay nada, omitir la sección.
-->
- {{pendiente o nota concreta}}
