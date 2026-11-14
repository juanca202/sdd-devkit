# Fuentes de contexto

- @docs/adr/README.md — Índice de decisiones arquitectónicas <!-- omitir esta línea y la siguiente si este repositorio está clasificado "Solo specs" (siempre el caso del repositorio de especificaciones en modo multi-repo) — nunca recibe estos índices -->
- @docs/standards/README.md — Índice de estándares de arquitectura
- @README.md — Acerca del proyecto

# Reglas generales

<!-- Reglas y memoria persistente del proyecto: normas de trabajo y preferencias operativas para agentes que no son decisiones de arquitectura (ADR/estándares) ni stack — convenciones de código, comandos del repo, restricciones operativas, preferencias del equipo. Ejemplo: "Seguir el estilo del código vecino; no reformatear líneas que no formen parte del cambio." -->

<!-- Regla fija del harness: no eliminarla ni reformularla. Las reglas propias del proyecto van debajo. -->
- **Especificaciones archivadas: solo lectura.** Todo lo que está bajo la carpeta de `specification.archivedPath` de `.sdd-devkit/settings.json` (por defecto `docs/specs/archived/`) es trabajo ya cerrado. Se puede leer como contexto, pero no se edita, renombra ni elimina, tampoco para alinearlo con cambios posteriores ni «por consistencia», y aplica aunque no se esté ejecutando ningún skill. Si algo archivado quedó desactualizado o contradice el estado actual, informarlo al usuario sin modificarlo; para retomarlo, el usuario lo desarchiva primero. Únicas excepciones: mover la carpeta completa al archivar o desarchivar a pedido del usuario, y las escrituras que los skills de SDD Devkit definen expresamente (p. ej. el `criteria-coverage.md` de `coverage-verify` o la normalización de formato de `/plugin-migrate`).

# Stack tecnológico

<!-- Lenguaje(s) y versión, framework(s) principal(es), runtime, gestor de paquetes/build y capas de testing configuradas. Esta es la única fuente del stack del proyecto. Si este repositorio está clasificado "Solo specs", reemplazar por "No aplica — repositorio de solo especificaciones" en vez de un stack. Si el proyecto es multi-repo (este archivo vive en el repositorio de especificaciones, que es siempre "Solo specs"), reemplazar en cambio por una tabla-resumen con una fila por submódulo y un enlace al AGENTS.md de cada uno — ver arch-init/references/multi-repo.md § 7. -->
