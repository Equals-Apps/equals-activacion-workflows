# Auth.js v5, config por-entidad, y Production directo en v1

Cuatro decisiones tomadas al construir la app de v1, todas en la tensión que plantea `0001-v1-hardcodea-equals11.md` (hardcodear Equals11 hoy sin bloquear el multi-entidad futuro):

- **Auth.js v5 (`next-auth`), sin adapter ni base de datos.** Estrategia JWT default + un callback `signIn` que valida el email contra la whitelist. Un solo `auth()` reusable en Server Components y en la API route. El riesgo de "modo mantenimiento" del ecosistema v5 es sobre todo por adapters de DB — al no usar ninguno, no aplica. Implica los nombres de env var `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
- **Shape de workflows por-entidad desde el día uno.** Cada entrada del array `WORKFLOWS` (`lib/workflows.ts`) trae su propia env var de whitelist (`env.allowedEmails`), aunque hoy exista una sola entidad. Sumar Tekton después es agregar un objeto + env vars nuevas, no rediseñar el tipo — que es justo lo que ADR-0001 pide no bloquear.
- **`EQUALS11_ALLOWED_EMAILS`, no `ALLOWED_EMAILS`.** Nombre por-entidad desde el principio. El placeholder global `ALLOWED_EMAILS` de CLAUDE.md era exactamente el nombre "ingenuo" que ADR-0001 advierte; fijarlo por-entidad ahora cuesta lo mismo y evita un rename cuando se sume una segunda entidad.
- **v1 deploya a Vercel Production (`main`), no a Preview=sandbox.** El workflow de n8n no tiene sandbox del lado de los datos (siempre escribe sobre Sheets/Drive/Slack reales), así que la separación Preview=sandbox que plantea CLAUDE.md no aísla nada todavía.

## Consequences

La separación de ambientes (Preview=sandbox vs Production) se retoma cuando exista un segundo webhook real que sí la necesite — momento que probablemente coincide con la llegada de una segunda entidad (ver ADR-0001). El shape por-entidad y el nombre de whitelist ya están preparados para ese salto; la estrategia de ambientes y el eventual nonce del CSP (ver `0002-csp-unsafe-inline-v1.md`) son lo que quedará por resolver entonces.
