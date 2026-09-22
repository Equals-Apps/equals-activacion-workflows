# V1 hardcodea a Equals11; multi-entidad se pospone

El panel nace para un solo workflow de Equals11, con nombres de variables, whitelist y webhook hardcodeados a esa entidad. Se decide no diseñar una estructura multi-entidad en v1 — la prioridad es shipear rápido con dos usuarios y un workflow. Si en el futuro Boring Holding quisiera separar Sandbox de Producción (u otra dimensión que hoy no existe), eso va a requerir repensar la estructura de ambientes y permisos, no alcanza con agregar una fila a una tabla de workflows.

## Consequences

La forma prevista (no comprometida, solo para no bloquearla sin querer) es: dos ambientes grandes — sandbox y producción — cada uno con su propia whitelist de emails y su propio webhook por workflow. Esto implica que la whitelist de emails y el webhook no van a poder seguir siendo una sola env var global — van a necesitar ser por entidad/ambiente. No se implementa nada de esto ahora; queda registrado para que v1 no se construya de una forma que lo haga más difícil después.
