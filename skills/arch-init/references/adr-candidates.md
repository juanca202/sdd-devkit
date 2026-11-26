# Candidatos de ADR/estándar desde las decisiones de arch-init

Leer esta referencia en el **Paso 4.1** de `SKILL.md` (se vuelve a usar, sin releer, en el Paso 5.1). No inventa un catálogo genérico de "problemas típicos": usa el mismo modelo de **dominios funcionales** y de **decisión → requerimiento** que `arch-manage` y `arch-discover` ya definen.

## 1. Dominios funcionales canónicos

Los mismos 9 que usa `arch-manage` (`references/functional-domains.md`) y `arch-discover` — clasificar cada candidato en uno de ellos; proponer un dominio nuevo solo si de verdad no encaja:

| Dominio (`slug`) | Cuándo aplica a una decisión de arch-init |
| ------------------ | ------------------------------------------- |
| **Calidad y pruebas** (`testing`) | Framework de unit tests, E2E, API testing, cobertura mínima — Paso 4.2 completo. |
| **Arquitectura y diseño** (`architecture`) | Elección de patrón/estructura al hacer scaffolding (p. ej. arquitectura hexagonal, monorepo vs. monolito) si se decidió explícitamente. |
| **Interfaces / APIs** (`api`) | Framework HTTP, protocolo (REST/GraphQL/tRPC) si el tipo de proyecto es API/backend. |
| **Seguridad** (`security`) | Mecanismo de autenticación/autorización si se decidió como parte del stack inicial. |
| **Estilo de código** (`coding-style`) | Linter/formatter si el scaffold o la investigación del Paso 2 lo definió explícitamente (no el default silencioso del template) — ver criterio de desempate abajo. |
| **Frontend / UX** (`frontend`) | Framework de UI, gestión de estado, si el tipo de proyecto es frontend/full-stack. |
| **Persistencia y datos** (`persistence`) | Base de datos u ORM si se decidió como parte del stack inicial. |
| **Infraestructura y DevOps** (`devops`) | Runtime/versión, gestor de paquetes, si hubo una elección real entre opciones. |
| **Observabilidad** (`observability`) | Normalmente no aplica todavía en un proyecto recién inicializado; omitir salvo que el Paso 2 la haya decidido explícitamente. |

**Criterio para distinguir "default silencioso del scaffold" de "decisión explícita"** (aplica a linter/formatter y a cualquier otra elección similar que venga incluida en el generador de scaffold):

- **Default silencioso** (no genera candidato) — el linter/formatter/herramienta es exactamente el que instala y configura el generador del scaffold (p. ej. `create-react-app`, `create-next-app`, `vue create`) **sin modificar**: mismo paquete, misma configuración por defecto (a lo sumo cambios cosméticos como el nombre del proyecto), y nadie comparó alternativas.
- **Decisión explícita** (sí genera candidato) — se cumple **cualquiera** de estas condiciones: (a) la herramienta **no** es la que trae el generador por defecto (se instaló o se cambió aparte); (b) su configuración fue modificada más allá de lo cosmético (reglas agregadas/quitadas, override de un preset, plugins adicionales); o (c) el Paso 2 (investigación con `work-research` o pregunta directa) comparó alternativas reales antes de elegirla.

Ante la duda (no se puede determinar si el config es el del generador o fue tocado), tratarlo como default silencioso y no proponerlo — mismo principio de "no inventar candidatos" del resto del skill.

## 2. Construir la lista de candidatos

La fuente de los candidatos depende de la situación identificada en el Paso 1.2 — son dos caminos distintos, y **solo uno de ellos** alimenta la lista consolidada que llega al Paso 5.1:

### Con implementación → delegar en `arch-discover` completo; no vuelve a esta lista

Si el Paso 1.2 clasificó "con implementación", el Paso 4.1 ejecuta el skill `arch-discover` **completo, en la conversación principal** (no en un subagente: pregunta al usuario), sobre el repo — sus cinco fases, incluida la Fase 5. `arch-discover` inspecciona el código, agrupa por dominio funcional, **presenta sus candidatos al usuario** y, para los que se aprueban, **los crea por su cuenta** invocando `/arch-manage` en su propia Fase 5 (con el mismo criterio de exclusión de candidatos triviales que usa siempre). `arch-init` no repite esa presentación, no vuelve a inspeccionar el código, y **no vuelve a delegar esos candidatos en `arch-manage`** — ya quedaron creados. Lo único que se retiene de esta ejecución es un resumen (qué se creó, con sus rutas) para el cierre (Paso 5.3); **no se agrega nada de aquí** a la lista consolidada del § 3.

### Con código base / sin código → construir desde las decisiones que tomó `arch-init` mismo

Si no hubo `arch-discover` (situación "con código base" o "sin código", tras el Paso 2 si aplicó), no hay nada que "descubrir" en código que todavía no existe o que es puro scaffold por defecto: los candidatos salen de las decisiones que **arch-init tomó en esta misma ejecución**, y **estos sí** alimentan la lista consolidada del § 3:

1. **Del Paso 1.3 o del Paso 2** (según cuál haya aplicado): el stack elegido/detectado — lenguaje, framework principal, y cualquier librería clave que haya implicado comparar alternativas reales (no el resto de dependencias transitivas). Según de dónde vino:
   - **"Sin código" (el stack se eligió en el Paso 2 de esta ejecución):** el stack es **siempre** candidato — es una decisión real tomada ahora, haya salido de una preferencia que el usuario declaró en el 2.1, de una sugerencia directa o de una investigación. Que no se compararan alternativas **no** lo vuelve trivial: se propone igual, sin inventar alternativas (si hubo `work-research`, las "Alternativas consideradas" salen de su `RS-XXX`).
   - **"Con código base" (el stack vino detectado en el Paso 1.3):** no hay alternativas de primera mano — no inventarlas; proponerlo como ADR con `emits: []`, salvo que sea la elección obvia y trivial de un scaffold, en cuyo caso se deja pasar.
2. **Del Paso 4.2** (en **cualquier** situación, incluida "con implementación"), **siempre que en el 4.2 se haya configurado o confirmado al menos una capa**: el framework de unit testing y, si se aceptaron, las capas adicionales (E2E, API testing) — esto se consolida en **un solo candidato** de dominio `testing`, con un requerimiento por capa (igual que el ejemplo canónico de `arch-discover`: "unit tests con X" + "e2e con Y" → un estándar *Testing Standards* con dos requerimientos). Este candidato **sí** entra a la lista consolidada del § 3 aunque la situación haya sido "con implementación", porque es una decisión que toma `arch-init` en el 4.2, no algo que `arch-discover` pudiera haber minado del código existente.

No proponer candidatos triviales — mismo criterio de exclusión que `arch-discover`—, entendiendo por trivial **solo** lo que el generador del scaffold trae por defecto sin que nadie lo eligiera (§ 1, "default silencioso"). El stack elegido en el Paso 2 y la compuerta configurada en el 4.2 **nunca** son triviales: los decidió el usuario en esta ejecución.

> **En "sin código" la lista nunca queda vacía:** como mínimo trae el stack del Paso 2, y normalmente también el candidato `testing` del 4.2. Si al llegar al Paso 5.1 la lista está vacía en esa situación, se omitió un candidato — reconstruirla antes de seguir.

## 3. Presentar y delegar

Esta presentación cubre **únicamente** los candidatos de la rama "con código base"/"sin código" del § 2 más el de la compuerta de calidad (4.2) — nunca los de `arch-discover`, que ya quedaron resueltos por su propia Fase 5. La lista solo puede quedar vacía si la situación fue "con implementación" y el 4.2 no agregó nada nuevo, o "con código base" con un stack trivial de scaffold y la compuerta ya completa: en ese caso, pasar al Paso 5.2 sin preguntar y **decirlo en el cierre** (Paso 5.3). En cualquier otro caso la pregunta del punto 2 es **obligatoria**: que el usuario haya elegido el stack en el Paso 2 o aceptado las capas de testing en el 4.2 **no** es haber aceptado documentarlos — son decisiones distintas y esta no se da por respondida (ver `SKILL.md` § 5.1).

1. Mostrar la lista de candidatos del § 2 (rama stack, si aplica, más el de compuerta de calidad) agrupados por dominio, con la decisión, el dominio y —si existen— las alternativas consideradas.
2. Preguntar con la herramienta de preguntas estructuradas (selección múltiple): *"¿Cuáles quieres documentar como ADR/estándar?"*, opciones = cada candidato + `Ninguno por ahora`.
3. Antes de delegar, resolver los **decisores** **una sola vez para todo el lote** (no repetir por candidato).
   - **Excepción — lote 100% trivial/heredado del scaffold:** si **todos** los candidatos aprobados del lote son elecciones triviales del scaffold que se documentan solo porque el usuario pidió dejar constancia (el caso de `emits: []` del § 2, punto 1 — no hubo una comparación real de alternativas), no lanzar la pregunta estructurada de decisores: usar directamente `Equipo` (o el valor por defecto que ya use el proyecto en otros ADR) como decisor, coherente con que no hubo una decisión activa que atribuir a alguien. Si el lote mezcla candidatos triviales con al menos uno no trivial, sí preguntar decisores normalmente para el lote completo — la pregunta se resuelve una vez y aplica a todos por igual.
4. Ejecutar **`/arch-manage`** **en la conversación principal** (no en un subagente: propone los criterios de cumplimiento y las fitness functions para que el usuario elija), agrupando los candidatos **por dominio** (varios candidatos del mismo dominio en una sola invocación, para que caigan en el mismo estándar), pasando: decisión, contexto/alternativas ya conocidas, dominio y decisores. No continuar al Paso 5.2 hasta que termine. Este paso ocurre en el **Paso 5.1** de `SKILL.md`.
