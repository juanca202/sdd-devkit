# Enlaces a archivos del proyecto (compartida)

Referencia transversal del plugin **SDD Devkit**. Regla única para **toda mención de un archivo o
carpeta del proyecto** en lo que un skill o un agente genera: artefactos, documentos, informes y
mensajes al usuario.

## Regla

**Toda referencia a un archivo o carpeta existente del proyecto DEBE ser un enlace Markdown que lo
abra**, nunca solo una etiqueta en código (`` `WF-001` ``), un identificador suelto o una ruta en
texto plano. Aplica a:

- **Identificadores de artefactos y documentos** — `SRS-XXX`, `US-XXX`, `TK-XXX`, `WI-XXX`, `FT-XXX`,
  `RS-XXX`, `RQ-XXX`, `TC-XXX`, `ADR-XXX`, `MD-XXX`, `API-XXX`, `FL-XXX`, `DG-XXX`, `WF-XXX`: el
  identificador es el **texto** del enlace y el archivo que lo define es el **destino**.
- **Rutas de archivos** — código fuente, pruebas, configuración, informes (`quality-check.md`,
  `code-review.md`, `criteria-coverage.md`, `progress.md`…), `assets/`, `references/`.
- **Carpetas e índices** — una carpeta enlaza a su `README.md` si lo tiene; si no, a la carpeta.
- **«El README de X», «el índice de Y», «la plantilla Z»** — una mención por nombre de un archivo
  concreto también se enlaza.

Ejemplo — una US que cita sus wireframes y la documentación técnica de la capability `core`:

```markdown
<!-- MAL: etiquetas que no abren nada -->
Wireframes: `WF-001` (menú de skills) y `WF-002` (etiqueta desplegable) en `wireframes/`;
modelo en el README de `core`.

<!-- BIEN: cada referencia abre su archivo -->
Wireframes: [WF-001](wireframes/WF-001-menu-skills.md) (menú de skills) y
[WF-002](wireframes/WF-002-etiqueta-desplegable.md) (etiqueta desplegable) en
[`wireframes/`](wireframes/); modelo en el
[README de `core`](../../../../architecture/core/README.md).
```

## Cómo se construye el enlace

1. **Resolver el archivo real antes de enlazar.** Buscar el archivo en disco (el identificador es el
   prefijo del nombre: `WF-001` → `WF-001-*.md`) y copiar su ruta tal cual; **no** recomponerla desde
   el título ni inventar el slug. Un enlace a un archivo que no existe es peor que una etiqueta.
2. **Destino según dónde se escribe:**
   - **En un archivo del proyecto** (artefacto, documento, informe): ruta **relativa al archivo que
     contiene el enlace**, para que navegue en el editor y en el gestor de repositorios.
   - **En un mensaje al usuario** (chat, resumen de cierre, preguntas): ruta **relativa a la raíz del
     proyecto** (`[WF-001](docs/specs/changes/user-stories/US-042-menu-skills/wireframes/WF-001-menu-skills.md)`), que es la que
     el cliente abre con un clic.
3. **Texto del enlace:** el identificador (`[US-042](…)`), el identificador con título
   (`[WF-001: menú de skills](…)`) o la ruta en código (``[`src/auth/login.ts`](…)``). Para una línea
   concreta de código, añadir la línea al texto y, si el destino lo admite, el ancla:
   ``[`src/auth/login.ts:42`](../../src/auth/login.ts#L42)``.
4. **Cada mención se enlaza**, no solo la primera del documento: en tablas, listas y matrices de
   trazabilidad cada celda que nombra un archivo lleva su enlace. Dentro de un mismo párrafo basta
   enlazar la primera aparición.
5. **Imágenes y SVG:** se embeben (`![…](ruta)`) cuando el flujo lo pide, y además se enlaza el
   archivo si el lector necesita abrirlo.

## Qué no se enlaza

- **Lo que aún no existe:** un archivo que el propio paso va a crear se enlaza **en cuanto exista**;
  un patrón o placeholder (`US-XXX`, `docs/architecture/[capability]/…`, `<changesPath>/…`) no es un
  archivo y se queda en código.
- **Identificadores sin archivo propio:** `AC-XXX`, `FR-XXX`, `NFR-XXX`, `BR-XXX` y similares viven
  **dentro** de un documento; se enlazan al archivo que los contiene (con ancla si la sección la
  tiene) la primera vez que se citan desde **otro** documento, y quedan en código dentro del suyo.
- **Bloques de código, comandos y salidas de terminal**, nombres de ramas, mensajes de commit y
  títulos de PR: Markdown no enlaza ahí y no se fuerza.
- **Campos consumidos por máquinas** (front matter, claves que un script lee, `settings.json`): se
  respeta el formato que el consumidor espera.
- **Archivos del plugin** (`${PLUGIN_ROOT}/…`): siguen su propia convención de dos rutas — ver
  [`README.md`](README.md).

## Al archivar o mover

Un enlace relativo se rompe si su origen o su destino cambian de carpeta. La reparación es parte del
movimiento, no un paso opcional: ver [`archive.md`](archive.md) (paso «Reparar los enlaces afectados»).
