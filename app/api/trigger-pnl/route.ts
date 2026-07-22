import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isEmailAllowed } from "@/lib/allowed-emails";
import { WORKFLOWS } from "@/lib/workflows";

// El único cliente legítimo es nuestro propio frontend en el navegador, que siempre
// manda el header Origin en un POST. Comparamos el host del Origin contra el header Host
// del request — NO contra new URL(req.url), que detrás del proxy de Vercel puede ser el
// localhost interno y haría 403 a todo en producción. Fail-closed si falta u origin inválido.
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 1. Same-origin — el más barato, primero.
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 2. Sesión.
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 3. Whitelist (check #2) — revalida en CADA request, no solo en el login. Una sesión JWT
  // ya emitida sigue siendo válida aunque se saque el email de la whitelist; esto es lo único
  // que hace efectiva la revocación sin forzar logout.
  const workflow = WORKFLOWS[0];
  if (!isEmailAllowed(session.user?.email, workflow.env.allowedEmails)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 4. Confirmación server-side — el checkbox del cliente es solo UI; el gate real está acá.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if ((body as { confirmed?: unknown })?.confirmed !== true) {
    return NextResponse.json({ error: "confirmation required" }, { status: 400 });
  }

  // 5. Disparar el webhook de n8n. URL y secret se leen server-side (nunca llegan al cliente),
  // vía los NOMBRES de env var que guarda el workflow — la indirección del shape por-entidad.
  const webhookUrl = process.env[workflow.env.webhookUrl];
  const webhookSecret = process.env[workflow.env.webhookSecret];
  if (!webhookUrl || !webhookSecret) {
    // Fail-closed: si falta config, no inventamos un éxito. No logueamos el valor del secret.
    console.error(
      `Config faltante: ${workflow.env.webhookUrl} o ${workflow.env.webhookSecret} no están seteadas`,
    );
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "X-Webhook-Secret": webhookSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workflow: workflow.id }),
      // El webhook responde de inmediato (responseMode onReceived), así que resuelve en ms.
      // El timeout solo es una guarda contra una conexión colgada, no contra los ~40 nodos.
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`El webhook de n8n respondió ${res.status}`);
      return NextResponse.json({ error: "trigger failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Error llamando al webhook de n8n:", err);
    return NextResponse.json({ error: "trigger failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
