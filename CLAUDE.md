# Panel de Triggers — Equals11 (Boring Holding)

## Qué es esto
App interna que corre manualmente workflows de n8n vía webhook, sin entrar a la UI de n8n.
NO crea ni edita workflows de n8n — eso vive en el repo separado "n8n agent builder". Este repo solo llama webhooks, nunca toca el JSON de un workflow.
v1: un solo workflow ("New P&L creation"), dos usuarios, ambiente sandbox.

## Stack
- Next.js + TypeScript, deploy en Vercel.
- Auth: Google OAuth (Auth.js / NextAuth), restringido a whitelist de emails en env var.
- Sin base de datos en v1. No agregar Supabase "por si acaso" — si no hay DB, no hay RLS que mantener, y es una superficie de ataque menos.
- Historial de ejecuciones: NO se duplica en este repo. n8n ya lo guarda. Este panel solo corre workflows, no reporta.

## Ambientes
Un solo repo. Sandbox y producción se manejan con env vars distintas por ambiente de Vercel (Preview = sandbox, Production = producción futura) — no repos ni deploys separados.

Cada ambiente tiene su propia URL de webhook de n8n, su propio secret, y su propia whitelist de emails. Nunca reusar ni mezclar env vars entre ambientes.

Variables esperadas por ambiente (nombres orientativos):
- `N8N_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`
- `ALLOWED_EMAILS` (lista separada por comas)
- `NEXTAUTH_SECRET` / credenciales de Google OAuth

## Seguridad — no negociable

**Pendiente crítico, fuera de este repo:** el webhook de n8n hoy NO tiene autenticación propia (sin secret, sin basic auth). El login de Google en esta app filtra quién ve el botón, pero si la URL del webhook se filtra (logs, Slack, historial de n8n), cualquiera puede correrlo sin pasar por el login. Esto se resuelve en n8n (nodo Webhook → validar header), no en este repo. No pasar de sandbox a producción sin esto resuelto.

Una vez que el secret exista del lado de n8n:
- El secret vive solo como env var server-side. Nunca en código, nunca expuesto al cliente.
- El botón de "correr" (el trigger) llama a una API route propia de Next.js (`/api/trigger/...`). Esa API route es la única que conoce el secret y hace el POST a n8n. El navegador del usuario nunca ve la URL real del webhook ni el secret.

Además:
- Whitelist de emails chequeada server-side en cada request a la API route, no solo en el login inicial.
- Security headers estándar (CSP, X-Frame-Options, HSTS) configurados en `next.config` / `vercel.json`.
- CORS: la API route solo acepta requests del propio dominio.
- No loguear el secret del webhook. Loguear el email del usuario que corre el workflow solo si hace falta para auditoría, y no en texto plano en logs públicos de Vercel.

## Prioridad de v1
Velocidad de shipeo esta semana. No sobre-construir para la escala que todavía no existe: nada de DB, nada de skills de diseño pesados, nada de herramientas de arquitectura para un repo de menos de 10 archivos.

## Terminología del proyecto
Ver `CONTEXT.md` — glosario del negocio (verbos, entidades, ambientes) generado con `/grill-with-docs`.

## Cuándo esto deja de ser v1 (revisar entonces, no antes)
- Más de un workflow de Equals11 → recién ahí evaluar si conviene una tabla de "workflows disponibles" en vez de hardcodear uno solo. Si se agrega DB, RLS es obligatorio desde el primer día que exista una tabla.
- Se suma una segunda entidad (ej. Tekton) → esto NO es solo "otro workflow": implica repensar whitelist y webhook como algo por-entidad, no una sola env var global por ambiente. Ver `docs/adr/0001-v1-hardcodea-equals11.md`.
- Repo pasa de ~20 archivos → recién ahí vale la pena una herramienta de indexado de dependencias.
- Ambiente de producción real, más usuarios → recién ahí vale la pena invertir en pulir el diseño del dashboard y en QA automatizado de los flujos de login/whitelist/trigger antes de cada deploy.
