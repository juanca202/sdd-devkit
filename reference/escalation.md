# Resolución del límite de intentos y escalamiento al usuario

Referencia transversal del plugin **SDD Devkit**. Gobierna qué pasa cuando un skill que **implementa
código o verifica pruebas** se queda atascado en el mismo problema: un test unitario que no pasa, una
regla de arquitectura que sigue violada, un lint que no se deja arreglar, un build que no compila.

El fallo que esta referencia existe para evitar es el **bucle interminable**: reintentar variaciones
del mismo arreglo, turno tras turno, quemando contexto sin converger. A partir de un número de
intentos configurable, el skill **para y devuelve el problema al usuario**.

> **Ejecutar este bloque con Bash — no leerlo como prosa ni reimplementar su lógica a mano.** Es un
> script, no una explicación: correrlo y usar literalmente lo que imprime como la política ya resuelta.
> Razonar a mano sobre `.sdd-devkit/settings.json` en su lugar —aunque se llegue a la misma
> conclusión— reintroduce el margen de error de interpretación que el script existe para eliminar.

```!
node -e "
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(process.cwd(), '.sdd-devkit', 'settings.json');

let esc = null;
if (fs.existsSync(settingsPath)) {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings && settings.escalation) esc = settings.escalation;
  } catch (e) {}
}

const max = esc && esc.maxAttempts !== undefined ? esc.maxAttempts : 3;
const onLimit = esc && esc.onLimit ? esc.onLimit : 'ask';
const source = esc ? 'resuelta desde .sdd-devkit/settings.json' : 'por defecto del catalogo (no hay bloque \\'escalation\\' en .sdd-devkit/settings.json)';

console.log('Politica de escalamiento ' + source + ':');

if (max === -1) {
  console.log('- maxAttempts = -1 -> SIN limite de intentos. No escalar por conteo: seguir intentando mientras haya una hipotesis nueva que probar. Aun asi, si dos intentos seguidos producen exactamente el mismo error sin ninguna hipotesis nueva, parar e informar: eso ya no es reintentar, es un bucle.');
} else {
  console.log('- maxAttempts = ' + max + ' -> maximo ' + max + ' intentos CONSECUTIVOS sobre el MISMO problema. Un intento = un ciclo completo diagnostico -> cambio -> reverificacion. Al fallar el intento numero ' + max + ', NO hacer un intento ' + (max + 1) + ': se activa el escalamiento.');
  console.log('- El contador es POR PROBLEMA, no global: se lleva uno por cada problema abierto (un test que falla, una regla violada, un error de build), identificado por su firma (nombre del test + mensaje/assert, o regla + archivo).');
  console.log('- El contador se REINICIA solo cuando ese problema queda resuelto, o cuando el arreglo produce un error genuinamente distinto (otra firma). Un mismo error con distinto texto cosmetico (rutas, timestamps, orden) NO reinicia el contador.');
  console.log('- Resolver un problema y romper otro NO es progreso circular: el nuevo problema arranca su propio contador. Pero si la secuencia vuelve a una firma ya vista en esta sesion, se retoma el contador de esa firma en lugar de empezar de cero.');
}

if (onLimit === 'report') {
  console.log('- onLimit = report -> al agotar los intentos: NO preguntar. Marcar el problema con el estado BLOCKED en el informe o artefacto correspondiente, con el parte de bloqueo completo, continuar con el resto del alcance que no dependa de el, y terminar el skill informando lo que quedo bloqueado. Ver la seccion \"Efecto en el veredicto\": ningun informe con un bloqueo abierto puede cerrar en APPROVED.');
} else {
  console.log('- onLimit = ask -> al agotar los intentos: DETENER el trabajo sobre ese problema, presentar el parte de bloqueo y preguntar al usuario con la herramienta de preguntas estructuradas (ver reference/asking.md) como seguir. No seguir intentando ni avanzar a otra unidad antes de la respuesta.');
}
"
```

## El parte de bloqueo

Al escalar —tanto en `ask` como en `report`— lo primero es un **parte de bloqueo**. No es «no pude
arreglarlo»: es la información con la que el usuario puede decidir en un vistazo. Se presenta en el
idioma resuelto y contiene, como máximo en media pantalla:

| Campo | Qué lleva |
|-------|-----------|
| **Qué falla** | El problema con su firma exacta: nombre del test / regla / comando, y el mensaje de error o assert **literal** (el último, sin reescribir). |
| **Dónde** | Archivo y línea, o el artefacto y unidad de trabajo en curso. |
| **Qué intenté** | Los `maxAttempts` intentos, uno por línea: hipótesis → cambio aplicado → resultado. Suficiente para que el usuario no repita lo ya descartado. |
| **Qué descarté** | Las causas que los intentos permiten dar por eliminadas, y por qué. |
| **Dónde me atasco** | La hipótesis viva y qué información falta para confirmarla (una decisión de negocio, un dato del entorno, una credencial, un contrato de API que no está documentado). |
| **Estado del trabajo** | Qué quedó aplicado en el árbol y qué se revirtió, para que el usuario sepa desde dónde retoma. |

**No maquillar el bloqueo.** Ni dar por bueno un fallo («el test es frágil», «esto ya venía roto»), ni
desactivar, saltar (`skip`, `xit`, `@Ignore`), relajar el assert o bajar el umbral de cobertura para
que la corrida pase. Nada de eso resuelve el problema: lo esconde, y encima falsea el veredicto de la
puerta. Si la conclusión honesta del análisis es que el test o la regla están mal planteados, esa es
una **hipótesis a presentar en el parte**, para que la decida el usuario — no un cambio a aplicar por
cuenta propia.

## Las opciones al preguntar (`onLimit = ask`)

Se pregunta con la herramienta estructurada, una sola pregunta, con el parte ya presentado delante
(el ritmo de [`asking.md`](asking.md): decidir con la información delante). Las opciones son:

- **`[Lo reviso yo]`** — el usuario toma el problema. El skill queda a la espera: no toca más ese
  problema hasta que el usuario diga que siga, y no da por cerrada la unidad.
- **`[Te indico cómo]`** — el usuario responde con la pista, el dato o la decisión que faltaba. Eso
  **reinicia el contador** de ese problema: la orientación del usuario es información nueva, no otro
  intento a ciegas.
- **`[Sáltalo y sigue]`** — se marca el problema como bloqueado, se deja constancia en el informe o
  artefacto y se continúa con el resto del alcance que no dependa de él. Un bloqueo saltado **se
  reporta**: nunca se omite en silencio ni cuenta como aprobado.

No añadir una opción «Reintentar»: si el usuario quiere otro intento, lo pide por la respuesta libre
que la herramienta ya ofrece, y ahí normalmente viene con una pista — que es el caso de
`[Te indico cómo]`.

## Qué cuenta como intento

- **Sí cuenta:** cada ciclo completo *diagnóstico → cambio en el código o en la configuración →
  reejecución de la verificación* sobre el mismo problema.
- **No cuenta:** leer archivos, correr el test para observar, añadir trazas o logs de diagnóstico sin
  cambiar la lógica, o reejecutar sin haber tocado nada. Investigar no es reintentar.
- **Cuenta doble en la práctica:** repetir un cambio ya probado, o una variación sin hipótesis nueva
  detrás. Si al planificar el intento no hay una hipótesis que lo justifique, ese intento no se hace:
  se escala ya, aunque queden intentos en el contador. **El límite es un techo, no una cuota a gastar.**

## Efecto en el veredicto

`BLOCKED` es un **estado del problema dentro del informe**, no un veredicto: el vocabulario de veredictos
del catálogo sigue siendo el de [`verdicts.md`](verdicts.md) y no se amplía. Un bloqueo abierto se
refleja así en la línea `Veredicto:` del informe que lo reporta:

| Informe | Veredicto con un bloqueo abierto |
|---------|----------------------------------|
| `quality-check`, `code-review` | `INCOMPLETE` — no se pudo verificar todo. Bloquea el cierre. |
| `trace-validate`, `arch-audit` | `REJECTED` si el bloqueo deja un criterio sin cubrir; `APPROVED_WITH_NOTES` solo si lo bloqueado es una observación que no afecta la cobertura. |

**Ningún informe con un bloqueo abierto cierra en `APPROVED`.** Y un bloqueo saltado con
`[Sáltalo y sigue]` sigue siendo un bloqueo abierto: se reporta igual.

## Delegación a subagentes

Cuando el trabajo se delega a un subagente (un especialista de `agents/`, una unidad en paralelo), el
límite viaja con la delegación: el subagente lo aplica sobre su propio alcance y, al agotarlo,
**devuelve el parte de bloqueo al skill que lo invocó en lugar de preguntar por su cuenta**. Quien
escala al usuario es siempre el skill que conduce la sesión, que consolida los partes de todos los
subagentes bloqueados en una sola escalada — no una por subagente.

> **Una petición explícita del usuario gana.** Si en el turno el usuario pide algo incompatible con lo
> resuelto («insiste hasta que pase», «si falla una vez, avísame», «no me preguntes, reporta y sigue»),
> se respeta esa petición para **esa** ejecución y no se modifica `settings.json`.

> **Esta resolución es interna: no se narra.** Leer y aplicar este bloque es fontanería del skill, no
> trabajo que el usuario haya pedido. **No anunciarlo** («voy a resolver la política de escalamiento»,
> «llevo 1 de 3 intentos»), ni ir contando los intentos en voz alta mientras se trabaja. El contador es
> interno; lo que el usuario ve es el **resultado**: el problema resuelto, o el parte de bloqueo cuando
> se agota el límite.
