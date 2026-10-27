<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Un incidente (BUG-XXX) REGISTRA un comportamiento incorrecto: qué está mal, con evidencia. No es
implementable: no lleva Plan de implementación, Archivos afectados ni Dependencias. Su corrección se
planifica aparte, en un WI de tipo `bug-fix` que lo cita en `Origen`.

En un repositorio con `implementation.scope: tests` NO se usa esta plantilla: el incidente se redacta con
`incident-tests-template.md`, que tiene la forma del caso de prueba que detectó el hallazgo.

Nunca incluir credenciales, tokens, cookies ni valores del `.env`: los ambientes y las variables se citan
por NOMBRE. El documento describe qué está mal, nunca cómo corregirlo.
-->
# BUG-XXX: {{título corto del incidente}}

<!-- bug:status={{Draft|Ready}} -->
<!--
Esta marca se CONSERVA al publicar. Sus claves y sus valores van en inglés SIEMPRE, aunque el resto del
documento esté en otro idioma: es el ancla que otros skills parsean, no contenido. La etiqueta visible
de abajo sí se redacta en el idioma resuelto. Ver ../../references/verdicts.md.
-->
**Estado:** {{Draft | Ready}}
**Repositorio:** {{obligatorio para Ready: nombre del repositorio git donde se observa el defecto; inferido del repo (git remote / carpeta) o indicado por el usuario}}
**Historia de usuario:** {{enlace por ruta relativa al `README.md` de la `US-XXX` (o `WI-XXX` / `FT-XXX`) cuyo comportamiento documentado se incumple + su título; `N/A` solo tras buscarla}}
**Caso de prueba:** {{enlace por ruta relativa al `TC-XXX-{slug}.md` que detectó el hallazgo o que cubre el comportamiento afectado + el `AC-XXX` que verifica; omitir línea si no hay TC}}
**Reportado por:** {{indicado por el usuario; si no, `git config user.name`}}
**Fecha:** {{YYYY-MM-DD}}
**Work Item ({{Sistema}}):** {{enlace markdown al work item `Bug` creado en el sistema de seguimiento vinculado — solo si se creó; {{Sistema}} es el nombre corto que define el archivo de referencia del sistema (p. ej. "ADO" para references/azure-devops.md); omitir línea si no aplica}}

## Descripción

{{qué está mal, en una o dos frases: el comportamiento del sistema que difiere del esperado. Sin causa supuesta ni solución}}

## Comportamiento esperado / observado

**Esperado:** {{qué debería ocurrir, citando la fuente si existe: `AC-XXX` del artefacto, `TC-XXX`, documentación, regla de negocio}}
**Observado:** {{qué ocurre en realidad, literal: mensaje, código HTTP, estado en pantalla, valor devuelto}}

## Pasos para reproducir

<!-- Pasos concretos y mínimos, en orden; precondiciones y datos usados (sin credenciales ni valores del .env). -->
**Precondiciones:** {{estado del sistema, usuario/rol, datos previos}}
**Ambiente:** {{nombre del ambiente (nunca la URL) · build/versión · navegador/dispositivo si aplica}}
**Frecuencia:** {{Always | Intermittent (N de M ejecuciones)}}
1. {{acción}}
2. {{acción}}
3. {{acción → aquí se observa el fallo}}

## Evidencia

<!-- Al menos una fila para Ready. Id secuencial EV-01, EV-02, … Adjuntos (capturas, logs, HAR) van en assets/ de este incidente y se enlazan por ruta relativa; nunca pegar tokens, cookies ni credenciales. -->
| ID | Tipo | Referencia | Notas |
|----|------|------------|-------|
| EV-01 | {{Caso de prueba \| Prueba automatizada \| Prueba manual \| Log \| Captura \| Reporte de cobertura}} | {{`TC-XXX` · nombre de la prueba y ruta · [{{nombre}}](assets/{{EV-01-nombre.ext}}) · `criteria-coverage.md`}} | {{fecha, ambiente (nombre, no URL), build/versión, qué muestra}} |

## Impacto

**Severidad:** {{Crítico (bloquea el flujo o corrompe datos) | Alto (sin alternativa razonable) | Medio (con alternativa) | Bajo (cosmético)}}
**Alcance:** {{a quién o qué afecta: actores, módulos, ambientes}}
**Origen del hallazgo:** {{automatización de `TC-XXX` (work-implement) | ejecución manual de `TC-XXX` | `coverage-verify` | quality-check | producción | otro}}
**Resolución:** {{Open | Fixing (WI-YYY) | Fixed (WI-YYY) | Discarded — motivo}}

## Contexto

<!-- Sección opcional. Restricciones del dominio, decisiones previas o hipótesis de causa aportada por el usuario (marcada como hipótesis, nunca como plan). Eliminar si no aplica. -->
{{información adicional necesaria para entender el incidente}}

## Criterios de aceptación

<!--
Sección opcional: el comportamiento esperado ya es el criterio de cierre. Si se rellena, enuncia el comportamiento CORRECTO que el bug-fix deberá cumplir, nunca la solución. Id secuencial AC-001, AC-002, … con categoría y palabra clave RFC 2119 en MAYÚSCULAS. Eliminar la sección si no aplica.
-->
- **AC-001 ({{categoría}}):** {{enunciado con palabra clave RFC 2119 en MAYÚSCULAS}}

## Referencias

<!-- Solo enlaces a recursos ya almacenados: el work item del tracker, el artefacto afectado, documentación técnica o ADRs que fijan el comportamiento esperado. -->
- {{enlace}}

## Observaciones

<!--
Usar solo si hay ítems reales: evidencia que no se pudo adjuntar, datos que faltan para reproducir, hipótesis de causa aportada por el usuario (marcada como hipótesis). Con pendientes que impidan reproducir: `Estado: Draft`. Si no hay nada, omitir la sección.
-->
- {{pendiente o nota concreta}}
