# Arbol principal intocable cuando se usan worktrees

Referencia de `work-implement`. Se lee cuando la ejecucion usa worktrees (`workTree: always`, `ask` afirmativo o modo paralelo). El `SKILL.md` la resume en [Arbol principal intocable](../SKILL.md#arbol-principal-intocable-cuando-se-usan-worktrees-transversal); aqui esta la regla completa.

**Cuando la ejecucion usa worktrees** —`workTree: always`, `workTree: ask` respondido que si, o el modo de
ejecucion paralela, que siempre los usa— **el arbol principal es de solo lectura durante toda la
implementacion**: la rama en la que esta al empezar es exactamente la misma en la que esta al terminar, con
los mismos archivos. Ningun `git checkout`, `git switch`, `git merge`, `git reset` ni `git rebase` se ejecuta
sobre el; tampoco se le pide al usuario que cambie de rama.

**Antes de crear el primer worktree, `uncommittedChanges` se aplica tal cual.** La regla de solo lectura
empieza *despues* de la condicion de entrada, no en lugar de ella: si al iniciar (o reanudar) el arbol
principal tiene cambios sin commitear, se resuelve primero con la politica de
[`${PLUGIN_ROOT}/references/implementation.md`](../../../references/implementation.md) — `commit` los comitea via
`git-commit` en la rama actual, `stash` los guarda avisando donde quedaron, `ask` para e informa hasta que el
usuario decida — **exactamente igual que en una ejecucion sin worktrees**. Solo con el arbol principal
resuelto se crea el worktree del artefacto, y desde ahi el arbol principal ya no se toca. Motivo: un stash o
commit posterior, a mitad de implementacion, mezclaria el trabajo del usuario con el del skill; hacerlo al
inicio, con la politica que el propio usuario configuro, es lo que deja el arbol en un estado conocido. La razon de ser de
`workTree: always` es que el usuario pueda seguir trabajando en su arbol —normalmente sobre la rama de
integracion— mientras la implementacion avanza aparte; un checkout en el arbol principal rompe eso aunque
sea «solo para crear la rama».

**Todo ocurre en worktrees**, con dos niveles:

| Nivel | Worktree | Rama | Se crea |
|-------|----------|------|---------|
| **Artefacto** | `<workTreePath>/<artefacto>` (p. ej. `.worktrees/US-042`) | la rama del artefacto (`feature/US-XXX-*`, la rama del `WI`, `test/…`) | al iniciar: `git worktree add <workTreePath>/<artefacto> -b <rama-artefacto> <rama-base>` si la rama no existe, o `git worktree add <workTreePath>/<artefacto> <rama-artefacto>` si ya existe. **Sin checkout previo de la rama base**: `<rama-base>` es una referencia, no hace falta estar en ella. |
| **Unidad** | `<workTreePath>/<unidad>` (p. ej. `.worktrees/TK-003`) | `wt/<unidad>`, derivada de la rama del artefacto | por unidad, como describe [Concurrencia y worktrees](../SKILL.md#concurrencia-y-worktrees). |

- **La rama del artefacto se crea desde el worktree, nunca con `git checkout -b` en el arbol principal.**
  El «Paso 1 — Preparar repositorio y rama» de cada referencia de tipo dice `git checkout`; con worktrees ese
  paso se cumple creando el worktree del artefacto y **todas las operaciones siguientes del flujo
  (`progress.md`, ciclo TDD, lint/build, commits, merges de unidades) se ejecutan dentro de un worktree**
  (`git -C <ruta-del-worktree> …`, o con el cwd del subagente en esa ruta).
- **Los merges de unidades (`wt/<unidad>` → rama del artefacto) se hacen dentro del worktree del artefacto**,
  no en el arbol principal. Es lo que permite integrar sin cambiar de rama en el arbol del usuario.
- **Orden de las validaciones de repositorio.** Primero, **sobre el arbol principal**, «Cambios sin commitear
  al iniciar» segun `uncommittedChanges` (ver arriba). Despues se crea el worktree del artefacto y sobre el
  se cumplen por construccion «No iniciar en la rama de otro trabajo» y «Rama correcta» (esta en su rama). Al
  **reanudar** en una sesion posterior, la misma comprobacion se hace de nuevo en el arbol principal antes de
  volver a usar los worktrees; los cambios de una unidad a medias que viven en *su* worktree no cuentan aqui —
  son trabajo del skill, no del usuario.
- **Reanudar con la rama del artefacto ya en el arbol principal.** Si al iniciar el arbol principal *ya esta*
  en la rama del artefacto (una ejecucion anterior sin worktrees, o el usuario se puso ahi), git no permite
  un segundo worktree de esa rama: en ese unico caso el arbol principal **es** el worktree del artefacto
  —no se cambia de rama, que es lo que la regla protege—, las unidades siguen en sus worktrees y los merges
  se hacen ahi. Avisarlo al usuario al reportar.
- **`bug-fix` / `security-update` (sin rama propia).** La unidad se implementa en `wt/WI-XXX`, derivada de la
  rama de integracion confirmada. Como esa rama suele estar en el arbol principal, la integracion tiene dos
  salidas y ninguna cambia de rama: si el arbol principal **esta en la rama de integracion y limpio**,
  integrar con `git merge --ff-only wt/WI-XXX` ahi mismo (la rama recibe sus commits sin moverse de ella);
  en cualquier otro caso, **no tocarlo**: dejar `wt/WI-XXX` con sus commits, informar al usuario y cerrar
  con handoff a `work-integrate` para que integre el. Ver la [excepcion en `work-items.md`](work-items.md#excepcion-bug-fix-y-security-update-no-crean-rama).
- **Al cerrar la implementacion se eliminan todos los worktrees** —los de unidad tras integrarlos, el del
  artefacto al terminar el alcance— con `git worktree remove`, y se borran las ramas `wt/*`. **La rama del
  artefacto queda**, con todos sus commits, lista para `work-integrate` / `pr-create`, que si necesitan
  hacer checkout de ella en el arbol principal (el cierre es otro skill con otras reglas). El arbol
  principal sigue donde estaba.
- **`workTreePath` dentro del repo** (p. ej. `.worktrees/`) es una carpeta oculta: queda fuera del fingerprint
  de la tuberia de cierre y hay que dejarla en `.gitignore` la primera vez (misma mecanica que la cache de
  `quality-check`, con `git check-ignore -q`). Sin `workTreePath`, usar una ruta temporal fuera del arbol.

> **Una peticion explicita del usuario gana.** «Implementalo aqui mismo», «sin worktrees» desactiva la regla
> para esa ejecucion sin modificar `settings.json` — y entonces si aplica el `git checkout` de cada referencia.
