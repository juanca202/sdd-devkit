<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Informe final de un WI de `Tipo: spike`. Lo redacta `work-implement` al cerrar el experimento (último
`IT-XX` del enfoque) y vive en la carpeta del WI: `<changesPath>/work-items/WI-XXX-{slug}/spike-report.md`.
Es el ÚNICO entregable del spike que se consume después: `work-define` / `work-plan` lo mapean a la US o al
WI definitivo. El código de la rama `spike/` es referencia, no entregable.

Estructura: la mitad «resultados» sigue el formato de informe de experimento (pregunta → qué se hizo →
evidencia → respuesta por Q-XX → veredicto); la mitad «decisión» sigue MADR (diagnóstico → consecuencias →
recomendación), igual que `adr-template.md` de arch-manage.
-->
# Informe del spike WI-XXX: {{título corto del spike}}

<!-- spike:verdict={{VIABLE|VIABLE_WITH_REWORK|NOT_VIABLE|INCONCLUSIVE}} · timebox={{planned}}/{{consumed}} · branch={{spike/WI-XXX-slug}} · head={{sha-corto}} · generated={{YYYY-MM-DD}} -->
<!--
Esta marca se CONSERVA al publicar: es lo que `work-define`, `work-plan` y `/work-plan archive` leen. Claves y
valores SIEMPRE en inglés; la etiqueta visible del veredicto va en el idioma resuelto. Ver ../../references/verdicts.md.

| Valor canónico       | Símbolo | Significado                                                                    | Handoff                                            |
|----------------------|---------|--------------------------------------------------------------------------------|----------------------------------------------------|
| VIABLE               | ✅      | Todas las Q-XX con criterio de éxito cumplido; el enfoque sirve tal como se probó | work-define (US) o work-plan (WI definitivo)       |
| VIABLE_WITH_REWORK   | ⚠️      | El enfoque sirve, pero el prototipo revela trabajo o decisiones que la implementación definitiva debe resolver | Igual, cargando Diagnóstico y Consideraciones |
| NOT_VIABLE           | ❌      | Alguna Q-XX determinante en fallo; el camino se descarta con sustento            | Resolución: Descartado; ADR vía arch-manage si la decisión es estructural |
| INCONCLUSIVE         | ⏸️      | Timebox agotado con Q-XX sin responder                                           | Segundo spike más acotado (Re-espigado) o descartar |
-->
**Spike:** [WI-XXX: {{título}}](README.md)
**Veredicto:** {{✅ Viable | ⚠️ Viable con trabajo | ❌ No viable | ⏸️ No concluyente}}
**Subtipo:** {{técnico | funcional}}
**Timebox:** {{planificado}} · consumido: {{real}}
**Rama de referencia:** `spike/WI-XXX-{{slug}}` @ `{{sha-corto}}` — no integrar
**Fecha:** {{YYYY-MM-DD}}
**Autor:** {{git config user.name}} / {{agente}}

## Resumen ejecutivo

{{3–5 líneas: respuesta directa a la pregunta de investigación del README, el veredicto y qué se recomienda hacer a continuación. Debe poder leerse sola.}}

## Qué se probó

{{El experimento tal como se ejecutó —no como se planeó—: prototipo construido, mediciones realizadas, datos y entorno usados (por nombre, sin credenciales). Listar las desviaciones respecto al Enfoque del README y por qué ocurrieron.}}

| `IT-XX` | Planificado | Ejecutado | Desviación |
|---------|-------------|-----------|------------|
| IT-01 | {{…}} | {{…}} | {{Ninguna / qué cambió y por qué}} |

## Resultados por pregunta

<!--
Una fila por Q-XX del README, en el mismo orden y con el mismo id. Resultado canónico: PASS (cumple el criterio de éxito) ·
FAIL (cumple el de fallo) · INCONCLUSIVE (no se pudo determinar dentro del timebox). La evidencia enlaza archivos en
assets/ de este WI (mediciones, capturas, logs sanitizados). Nunca pegar tokens, cookies ni valores del .env.
-->
| `Q-XX` | Criterio de éxito | Resultado observado | Resultado | Evidencia |
|--------|-------------------|---------------------|-----------|-----------|
| Q-01 | {{umbral del README}} | {{valor o comportamiento medido, literal}} | {{✅ Cumple | ❌ No cumple | ⏸️ No concluyente}} | {{[EV-01](assets/EV-01-…)}} |
| Q-02 | {{…}} | {{…}} | {{…}} | {{…}} |

## Hallazgos

{{Lo que el experimento reveló más allá de las Q-XX: comportamientos inesperados, límites de la tecnología, supuestos que resultaron falsos, costes ocultos. Organizar por subtema si hay varios.}}

### {{Subtema 1}}

{{…}}

## Diagnóstico

<!-- Obligatoria con VIABLE_WITH_REWORK y NOT_VIABLE; opcional con VIABLE; con INCONCLUSIVE explica qué impidió concluir. -->
{{Qué funcionó y qué no, y por qué. Distinguir las limitaciones del prototipo (atajos tomados por el timebox) de las limitaciones del enfoque (que la implementación definitiva heredaría).}}

## Consideraciones para la implementación definitiva

<!-- Obligatoria con VIABLE y VIABLE_WITH_REWORK. Es la entrada principal de work-define / work-plan: cada ítem se convierte en un AC-XXX, una BR-XX, una Dependencia o una Observación del artefacto definitivo. Eliminar la sección con NOT_VIABLE. -->
1. **Decisiones que hay que tomar antes de implementar:** {{p. ej. estrategia de caché, versión de la librería, contrato del endpoint}}
2. **Deuda del prototipo que NO debe heredarse:** {{atajos del spike: sin manejo de errores, credenciales en claro, sin tests, estructura provisional}}
3. **Riesgos detectados:** {{con su mitigación propuesta}}
4. **Dependencias confirmadas:** {{servicios, datos, accesos, librerías que el experimento validó como necesarios}}
5. **Estimación orientativa:** {{magnitud del trabajo definitivo a partir de lo aprendido; story points Fibonacci o rango de días, con justificación en una línea}}

## Sustento del descarte

<!-- Obligatoria con NOT_VIABLE. Eliminar la sección en los demás veredictos. -->
{{Por qué este camino no es el correcto, apoyado en las Q-XX en fallo y los hallazgos. Qué alternativa se recomienda explorar (otro enfoque, otro spike, replantear el requerimiento) y si la decisión merece un ADR (`arch-manage`).}}

## Qué reutilizar de la rama

<!-- Opcional. Archivos o ideas del prototipo que vale la pena consultar al implementar desde cero — como referencia de lectura, nunca para copiar tal cual. Eliminar si no hay nada. -->
- `{{ruta/en/la/rama}}` — {{qué muestra y por qué es útil}}

## Impacto en el artefacto / próximo paso

{{Qué debería crearse o modificarse: una `US-XXX` nueva (`work-define`) si el resultado entrega valor de usuario; un `WI-XXX` de otro tipo (`work-plan`) si es técnico o de mantenimiento; un ADR (`arch-manage`) si la decisión es estructural; un segundo spike acotado si quedó inconcluso. Si el spike tiene `Origen:`, qué cambia en ese artefacto.}}

## Fuentes

- {{[Título de la fuente](URL) — documentación, benchmarks o issues consultados durante el experimento}}
