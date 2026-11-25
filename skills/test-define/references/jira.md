# Integración con Jira — `test-define`

> **Base común obligatoria:** [`${PLUGIN_ROOT}/references/project-managers/jira.md`](../../../references/project-managers/jira.md)
> — activación y datos de conexión resueltos en [`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md), verificación del MCP
> y su degradación, clave del issue y número local, construcción de la URL, campo `work_item`, límite de
> 255 caracteres del resumen, contrato de reconstrucción íntegra y anti-patrones comunes. **Leerla antes
> que este archivo.**

Este archivo contiene **solo el delta de `test-define`**. Se activa desde «Resolución de la integración con el
gestor de proyectos» en `SKILL.md` y aplica a los TC generados en su Paso 3.

## Los casos de prueba no son de Jira: los gestiona una herramienta de pruebas

**Jira no tiene casos de prueba de serie.** Los aporta una herramienta de gestión de pruebas, y cada una
los guarda de forma distinta (como objetos propios, como issues…). Por eso este delta no describe cómo se
crea o se lee un TC: **enruta a un módulo por herramienta**. Todo lo demás de Jira —historias, épicas,
tareas, bugs— sigue en la base común y en los deltas de los otros skills.

### Qué módulo se usa

Lo decide `projectManagement.testManagement`, ya resuelto por
[`${PLUGIN_ROOT}/references/project-management.md`](../../../references/project-management.md) (sin la
clave, `zephyr`). No se detecta ni se pregunta:

| `testManagement` | Herramienta | Módulo |
|------------------|-------------|--------|
| `zephyr` (por defecto) | **Zephyr** de SmartBear en Jira Cloud (antes Zephyr Scale): los casos son objetos de Zephyr con clave `PAG-T123`, no issues. Necesita una herramienta MCP de Zephyr además de la de Jira | [`test-managers/zephyr.md`](test-managers/zephyr.md) |
| `issue-type` | Herramientas cuyos casos **son issues de Jira**: Xray, el Zephyr Squad antiguo, o un tipo de issue propio | [`test-managers/issue-type.md`](test-managers/issue-type.md) |

**Leer el módulo que corresponda y seguir únicamente sus pasos**, antes de guardar cualquier archivo local
(Paso 4 del skill) y para todo `sync` de casos de prueba. Si el valor configurado no tiene módulo,
informar al usuario y continuar con **numeración local secuencial**, sin `work_item`; no improvisar la
integración.

### Qué es igual en todos los módulos

- **Número local:** `TC-<n>-[slug].md`, donde `<n>` es la parte numérica del identificador que asigna la
  herramienta, sin padding; el identificador completo va en `work_item.id`.
- **Ancla obligatoria con la historia:** el caso queda enlazado al issue de su artefacto padre cuando
  este tiene `work_item`. Es lo que permite reencontrar los TC de una historia.
- **Contrato de reconstrucción íntegra** de la base común: ninguna sección del `.md` se omite.
- **Dirección:** al generar TCs se crea primero en la herramienta; `sync` baja; solo `sync … push` sube.
  El estado y las ejecuciones de prueba no se tocan.
- **Sin la herramienta disponible:** numeración local secuencial al crear; contenido pegado al leer.

### Cómo añadir otra herramienta

1. Crear `test-managers/<valor>.md` con **estas mismas secciones**, en este orden: *Dónde vive el caso de
   prueba* · *Resolver dónde se crea (antes de crear el TC)* · *Crear el caso* (tabla de campos) ·
   *Lectura (`sync`)* con *qué casos entran*, *mapeo de campos a la plantilla de TC* y *actualizar* ·
   *Anti-patrones* · *Ejemplo*. Los módulos existentes sirven de plantilla.
2. Añadir la fila a la tabla de arriba.
3. Añadir `<valor>` al `enum` de `projectManagement.testManagement` en `schemas/settings.schema.json` y a
   su fila en `SETTINGS.md`.

Ningún otro archivo cambia: los demás skills que tocan casos de prueba (`work-research`, `work-plan`,
`work-define`) remiten a este delta, no a un módulo concreto.
