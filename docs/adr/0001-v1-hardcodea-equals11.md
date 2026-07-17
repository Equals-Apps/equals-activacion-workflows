# V1 hardcodea a Equals11; multi-entidad se pospone

El panel nace para un solo workflow de Equals11, con nombres de variables, whitelist y webhook hardcodeados a esa entidad. Ya se sabe que Tekton y otras entidades de Boring Holding van a usar este panel en el futuro, pero se decide no diseñar la estructura multi-entidad en v1 — la prioridad es shipear rápido con dos usuarios y un workflow. Cuando se sume una segunda entidad, esto va a requerir repensar la estructura de ambientes y permisos, no alcanza con agregar una fila a una tabla de workflows.

## Consequences

La forma prevista (no comprometida, solo para no bloquearla sin querer) es: dos ambientes grandes — sandbox y producción — y dentro de producción, una pestaña por entidad (Equals11, acceso restringido a Alonso y Luca; Tekton, acceso más amplio). Esto implica que la whitelist de emails y el webhook no van a poder seguir siendo una sola env var global por ambiente — van a necesitar ser por entidad. No se implementa nada de esto ahora; queda registrado para que v1 no se construya de una forma que lo haga más difícil después.
