<!--
Convención de placeholders: sustituir manualmente cada {{texto}}; no es un motor de plantillas.
Eliminar este bloque y sustituir todos los {{…}} al publicar el documento final.

Plantilla del WI de `Tipo: spike` — SUSTITUYE a `work-item-template.md` para ese tipo. Es el README.md del
work item: la INVESTIGACIÓN PROPUESTA. Vive en `<changesPath>/work-items/WI-XXX-{slug}/README.md`, y en esa
MISMA carpeta se guardan, al ejecutarlo, `spike-report.md` (el informe de resultados), `progress.md` y
`assets/` (la evidencia). Un spike es un experimento acotado en el tiempo para reducir una incertidumbre
que impide planificar o estimar. Su entregable es CONOCIMIENTO (el informe), nunca código integrable: la
rama `spike/WI-XXX-{slug}` queda como referencia y el desarrollo definitivo se formaliza después en una
`US-XXX` (`work-define`) o en un `WI-XXX` de otro tipo (`work-plan`).
Ver `references/maintenance-tasks.md` → Variante: Tipo spike.
-->
# WI-XXX: {{título corto del spike — la incertidumbre que resuelve}}

<!-- wi:status={{Draft|Ready}} · type=spike -->
<!--
Esta marca se CONSERVA al publicar. Sus claves y sus valores van en inglés SIEMPRE, aunque el resto del
documento esté en otro idioma: es el ancla que otros skills parsean, no contenido. La etiqueta visible
de arriba sí se redacta en el idioma resuelto. Ver ../../references/verdicts.md.
-->
**Estado:** {{Draft | Ready}}
**Tipo:** spike
**Subtipo:** {{técnico | funcional}}
<!--
técnico  → enfoque de implementación, build vs. buy, rendimiento, viabilidad de una librería o integración.
funcional → comportamiento de la solución, riesgo, complejidad, cómo organizar el trabajo.
-->
**Repositorio:** {{obligatorio para Ready: nombre del repositorio git donde se ejecuta el experimento}}
**Origen:** {{artefacto o decisión que espera el resultado: `US-XXX`, `WI-XXX`, `RS-XXX` o `ADR-XXX` enlazado por ruta relativa; «Petición directa» si no hay ninguno}}
**Timebox:** {{obligatorio para Ready: duración máxima del experimento, p. ej. `2 días` · `8 h` · `1 sprint`}}
**Asignado a:** {{opcional: priorizar lo indicado por el usuario; si no, inferir con `git config user.name`; omitir línea si no aplica}}
**Work Item ({{Sistema}}):** {{enlace markdown al work item creado en el sistema de seguimiento vinculado — solo si se creó; omitir línea si no aplica}}
**Resolución:** {{Abierto | Replanificado (US-YYY) | Replanificado (WI-YYY) | Re-espigado (WI-YYY) | Descartado — motivo}}
<!--
Arranca en `Abierto`. La actualiza el skill que crea el artefacto definitivo (`work-define` → `Replanificado (US-YYY)`;
`work-plan` → `Replanificado (WI-YYY)`, o `Re-espigado (WI-YYY)` al crear un segundo spike más acotado), o
`work-implement` al descartar tras un veredicto NOT_VIABLE. Un spike con `Resolución` distinta de `Abierto`
cuenta como completo para `/work-plan archive`.
-->

## Pregunta de investigación

{{Una sola pregunta, precisa, cuya respuesta desbloquea planificar o estimar el trabajo definitivo. P. ej. «¿Puede el motor de reglas actual evaluar 500 pólizas/s con la política de reaseguro sin superar 2 s por lote?». Sin diseño técnico aquí.}}

## Contexto

<!-- Sección opcional. Incluir solo si la pregunta no basta para entender por qué importa. Eliminar si no aplica. -->
{{qué decisión o estimación está bloqueada, qué se sabe ya, qué se intentó antes, restricciones del dominio}}

## Hipótesis

{{Lo que se cree que va a ocurrir, enunciado de forma falsable: «Creemos que X permitirá Y porque Z». Si no hay hipótesis —el spike es puramente exploratorio— escribir «Sin hipótesis previa: exploración» y justificarlo en una línea.}}

## Preguntas a responder

<!--
Lista cerrada con id secuencial Q-01, Q-02, … Cada pregunta lleva su criterio de éxito / fallo MEDIBLE: es lo que
`spike-report.md` responde fila a fila. Sin al menos una Q-XX con criterio medible el spike no puede estar en Ready.
Categorías orientativas: Viabilidad · Rendimiento · Compatibilidad · Esfuerzo · Riesgo · Comportamiento · Seguridad
-->
- **Q-01 ({{categoría}}):** {{pregunta concreta}}
  - **Éxito:** {{umbral o condición observable que la responde afirmativamente, p. ej. «p95 < 200 ms con 1 000 req/s durante 5 min»}}
  - **Fallo:** {{condición que la responde negativamente}}
- **Q-02 ({{categoría}}):** {{…}}
  - **Éxito:** {{…}}
  - **Fallo:** {{…}}

## Fuera de alcance

<!-- Obligatoria en un spike: delimita qué NO se va a resolver aunque aparezca durante el experimento (productivizar, cubrir todos los casos, documentar, optimizar). -->
- {{lo que queda fuera y por qué; opcionalmente dónde se abordará}}
- El código producido **no se integra**: queda en la rama `spike/WI-XXX-{{slug}}` como referencia de la implementación definitiva.

## Dependencias

<!-- Solo lo que el experimento necesita dentro de su alcance: servicios, datos de prueba, accesos, librerías a evaluar, entornos. No ADRs ni referencias de diseño — eso va en Referencias. -->
- {{nombre o identificador del componente, servicio, dato, librería, entorno}} — {{para qué lo necesita el experimento}}

## Referencias

<!--
Incluir únicamente enlaces a recursos ya almacenados. Rutas permitidas: assets/ (recursos propios de este spike),
docs/architecture/, docs/adr/, o investigaciones previas (`research/RS-XXX-{slug}/`).
-->
- **Arquitectura:** {{enlace a ADR en `docs/adr/` que condicione el experimento; no inventar ADRs nuevos}}
- **Documentación técnica:** {{enlace si aplica, tal como lo devuelve `design-define`}}
- **Investigación previa:** {{enlace a un `RS-XXX` de `work-research` si el spike nace de una decisión pendiente identificada ahí}}
- **Diseño:** {{solo si el spike funcional toca UI: Figma, wireframe o imagen}}

## Enfoque del experimento

<!--
Pasos concretos del experimento, con id secuencial IT-01, IT-02, … único en el documento. Describen QUÉ se va a
probar y con qué (prototipo, benchmark, lectura de código, PoC de integración), no cómo implementarlo. El último
paso es siempre redactar el informe. Estados del checkbox durante la ejecución: `[ ]` · `[~]` (solo una a la vez) · `[x]`.
-->
- [ ] **IT-01** — {{preparar el entorno / datos del experimento}}
- [ ] **IT-02** — {{construir el prototipo mínimo que permite responder Q-01}}
- [ ] **IT-03** — {{ejecutar la medición / prueba que responde Q-01 y Q-02; guardar evidencia en `assets/`}}
- [ ] **IT-04** — Redactar `spike-report.md` con los resultados por `Q-XX`, el veredicto y las consideraciones para la implementación definitiva

## Entregable

- `spike-report.md` en esta carpeta, redactado con `assets/spike-report-template.md` de `work-plan`, con veredicto y marca oculta `spike:verdict`.
- Evidencia del experimento en `assets/` de esta carpeta (mediciones, capturas, logs sanitizados, salidas).
- Rama `spike/WI-XXX-{{slug}}` con el código del experimento, **sin integrar**, citada desde el informe.

## Observaciones

<!--
Usar solo si hay ítems reales: accesos pendientes, datos que faltan, decisiones por tomar antes de empezar.
Si no hay pendientes, omitir esta sección o dejar una línea: Sin pendientes documentados.
-->
- {{pendiente o prerrequisito concreto}}
