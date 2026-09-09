# Fuentes de contexto

<!-- Resolver `@../…` según cómo esté abierto este repositorio. (1) Anidado como submódulo bajo el repo de especificaciones: `../` es el padre — usar las líneas tal cual. (2) Clone directo (workspace = esta raíz, sin padre de specs en disco): omitir `@../.agents/MEMORY.md` y `@../README.md`; no fallar. Siguen las rutas locales (`@README.md` y, si este repo recibió raíz de arquitectura, `@docs/adr/README.md` / `@docs/standards/README.md`). (3) Submódulo a más de un nivel del padre: ajustar `../` hasta encontrar `../.sdd-devkit/settings.json` o `../.agents/MEMORY.md`. -->
- @../.agents/MEMORY.md — Preferencias de la solución (repositorio de especificaciones)
- @docs/adr/README.md — Índice de decisiones arquitectónicas de este repositorio <!-- si este repositorio no recibió su propia raíz de arquitectura, cambiar a @../docs/adr/README.md; si está clasificado "Solo specs", omitir esta línea y la siguiente por completo — nunca recibe estos índices. En clone directo sin raíz propia, omitir ambas: los índices viven en el padre, que no está en este workspace. -->
- @docs/standards/README.md — Índice de estándares de arquitectura de este repositorio <!-- si este repositorio no recibió su propia raíz de arquitectura, cambiar a @../docs/standards/README.md -->
- @README.md — Acerca de este repositorio
- @../README.md — Acerca de la solución completa (repositorio de especificaciones) <!-- solo multi-repo: este AGENTS.md vive en un submódulo bajo el repo de especificaciones. Omitir en repo único (no hay padre) y en clone directo (el padre no está en este workspace). Nunca copiar esta línea a assets/agents-template.md. -->

# Reglas generales

<!-- Normas de trabajo para agentes que no son preferencias (MEMORY), decisiones de arquitectura (ADR/estándares) ni stack: convenciones de código, comandos del repo, restricciones operativas. Ejemplo: "Seguir el estilo del código vecino; no reformatear líneas que no formen parte del cambio." -->

# Stack tecnológico

<!-- Lenguaje(s) y versión, framework(s) principal(es), runtime, gestor de paquetes/build y capas de testing configuradas de ESTE repositorio. Este es el único lugar donde vive el stack de este repositorio -- el AGENTS.md del repositorio de especificaciones solo resume esta sección con un enlace aquí. Si este repositorio está clasificado "Solo specs", reemplazar por "No aplica — repositorio de solo especificaciones" en vez de un stack. -->
