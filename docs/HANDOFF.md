# Panel de Triggers — Equals11 (v1) — Handoff

## Qué es esto

App web interna (Next.js) que deja a personas específicas disparar manualmente el workflow de n8n "New P&L creation" de Equals11, sin entrar a la UI de n8n. Nace de un pedido más grande: Boring Holding quiere un panel donde gente autorizada pueda activar distintos workflows de n8n de Equals11 (P&L, monthly report, y más), con un paso de confirmación antes de disparar acciones reales.

- Repo: `github.com/lucatolentino/workflows-triggers`
- Producción: `https://workflows-triggers.vercel.app`
- Carpeta local: `C:\Luca\Proyectos\App activación workflows`
- Jira: proyecto **AUT** (Automation) en `boringholding.atlassian.net` — issue padre `AUT-48` (v1, cerrado, estado ✅ Live) y `AUT-54` (planeación de v2, abierto)

## Estado: v1 está cerrado y validado con un disparo real

No es solo que el código compile — se hizo el disparo real único y deliberado en producción (27 de julio, ejecución webhook `6288` en n8n, confirmada por el mensaje real en el canal de Slack `#e11-monthly-report`), con Alonso al tanto de lo que iba a pasar y contento con el resultado.

## Arquitectura y decisiones clave (por qué, no solo qué)

- **Next.js (App Router, TypeScript)**, una sola pantalla, un solo botón ("Crear P&L del mes — Equals11").
- **Auth**: Google OAuth vía Auth.js v5, **sin adapter ni base de datos** (JWT-only). Decisión explícita: Auth.js está en modo mantenimiento desde sept. 2025 y el ecosistema recomienda Better Auth para proyectos nuevos, pero Better Auth exige DB para sesiones — no se justifica para un panel de 2-3 usuarios sin necesidad de revocación instantánea de sesión.
- **Whitelist de emails exactos** (no por dominio) en `EQUALS11_ALLOWED_EMAILS`, chequeada en dos lugares: el callback `signIn` (bloquea el login) y la propia API route (se revisa en cada request — esto es lo que hace que sacar a alguien de la whitelist funcione sin forzarle un logout, porque una sesión JWT ya emitida sigue siendo válida hasta que expira).
- **Confirmación manual** ("¿ya se actualizaron devs y clientes en la hoja Config?") — es un checkbox, pero el servidor también exige el campo `confirmed: true` en el body del request; el checkbox del cliente no es el gate real, es solo la UI.
- **API route** (`/api/trigger-pnl`), orden de checks fail-fast: same-origin (comparado contra `Host`, no contra `req.url` — eso rompía todo detrás del proxy de Vercel) → sesión (401) → whitelist (403) → `confirmed` (400) → recién ahí el POST real a n8n.
- **Webhook de n8n**: nodo Webhook (POST) agregado al workflow "New P&L creation" (ID `5UJdl0lRLDQV22DA`), con Header Auth (`X-Webhook-Secret`). El Schedule Trigger mensual que tenía antes quedó deshabilitado a propósito — todo el disparo es manual ahora, sin respaldo automático.
- **Respuesta del webhook es inmediata** (arranca el workflow, no espera que termine) — la UI dice "Solicitud enviada, vas a recibir la confirmación en Slack", nunca "P&L creado con éxito", porque la app no puede saber si terminó bien.
- **CSP usa `'unsafe-inline'`** en `script-src`, no nonce — decisión documentada en ADR-0002: esta app no tiene ninguna superficie real de inyección (sin inputs de usuario reflejados, acceso whitelisteado), así que el nonce (que exige `middleware.ts`) no se justifica.
- **Sin base de datos en ningún lado** — toda la config vive en env vars.
- **`lib/workflows.ts` es una lista, por-entidad desde el día uno** (cada entrada trae su propia referencia de whitelist), aunque hoy solo tenga a Equals11 — pensado para que sumar una entidad nueva sea agregar un objeto, no rediseñar el tipo.
- **Sin `middleware.ts`** — una sola página y una sola API route no justifican la indirección.
- **Vercel: un solo ambiente (Production/main)** — no hay separación real sandbox/producción del lado de n8n (el workflow siempre escribe sobre Sheets/Drive/Slack reales, sin importar qué ambiente de Vercel lo llame), así que fingir un Preview=sandbox sería documentar una separación que no existe.
- **Logging de auditoría**: solo disparos exitosos (no rechazos), con email en texto plano (los logs de Vercel no son públicos, y enmascarar el email le quita el único propósito del log).
- Documentación: `CLAUDE.md`, `CONTEXT.md`, y tres ADRs en `docs/adr/`:
  - `0001-v1-hardcodea-equals11.md`
  - `0002-csp-unsafe-inline-v1.md`
  - `0003-auth-y-config-shape.md`
  - `docs/deploy.md` — checklist manual de deploy (env vars, redirect URI, etc.)

## Accesos e infraestructura

- **Google Cloud Console**: proyecto `workflows-triggers`, OAuth consent screen tipo **External + Testing** (no verificado — no hace falta, solo pide scopes email/profile). Test users: el email de Luca + los dos emails de Alonso (equals11 y boringholding — ambos están en la whitelist real también). Redirect URIs registrados: `localhost:3000` y el dominio de producción.
- **Vercel**: proyecto `workflows-triggers`, env vars solo en scope **Production** (no Preview). `AUTH_SECRET` es distinto entre dev y producción a propósito.
- **n8n**: workflow "New P&L creation" (`5UJdl0lRLDQV22DA`) en `kennethk3k.app.n8n.cloud`, activo, con el nodo Webhook + credential Header Auth ya configurados.

## Reglas de trabajo que hay que mantener (aprendidas a pulso en v1)

- Un solo cambio verificable por tarea. Si algo mezcla más de una decisión, dividirlo.
- Verificar, no asumir — sobre todo con: nombres exactos de env vars, si el dev server ya tomó un cambio de `.env.local` (requiere restart real, no asumir hot-reload), y qué rama de código realmente se está probando (ej.: el bug de whitelist que "no funcionaba" resultó ser una sesión JWT vieja sin cerrar, no un bug real).
- **El dev server lo controla la persona, no el agente** — evita procesos huérfanos y conflictos de puerto (ya pasó varias veces).
- **Nunca pegar secrets reales en ningún chat** (ninguno) — ni el secret del webhook, ni el Client Secret de Google, ni una cookie de sesión. Se editan directo en `.env.local` o en la UI de Vercel.
- Cuestionar las recomendaciones "más correctas en abstracto" contra el costo/riesgo real del proyecto puntual (pasó con CSP nonce vs unsafe-inline, y con Better Auth vs Auth.js v5).
- ADRs para decisiones con trade-offs reales; `CLAUDE.md` como la verdad operativa vigente (nunca debe contradecir una decisión ya tomada).
- Jira (proyecto AUT): verificaciones van como checklist dentro del issue, subtasks se reservan para desarrollo pesado o para trabajo que involucra a otra persona.

## Qué falta / v2 (AUT-54, todavía sin alcance definido)

Alonso pidió ver más progreso en la app, pero **todavía no está claro qué significa eso concretamente** — es la primera pregunta a resolver en la conversación nueva, con las mismas preguntas aclaratorias que se usaron para armar v1:

- **Más workflows de Equals11** (ej. Monthly Report Creator): cambio menor, es agregar una fila a `lib/workflows.ts`.

Otros pendientes de menor prioridad:
- Pulido visual opcional (hoy no hay estilos, por decisión deliberada).
- Definir si el logging de rechazos (401/403/400) se agrega cuando haya volumen real de uso.
