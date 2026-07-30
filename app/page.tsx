import Link from "next/link";
import { auth } from "@/auth";
import { WorkflowCard } from "@/components/WorkflowCard";
import { WORKFLOWS } from "@/lib/workflows";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main>
        <Link href="/api/auth/signin">Iniciar sesión con Google</Link>
      </main>
    );
  }

  // Fail-closed en el render: por cada workflow chequeamos server-side que existan sus env vars
  // de webhook. Si faltan, la card sale deshabilitada (WorkflowCard lo maneja) en vez de ofrecer
  // un botón que terminaría en un 500. Pasar `workflow` al cliente es seguro: env guarda NOMBRES
  // de env var, no valores. La página ya es dinámica (await auth), así que process.env se lee por
  // request.
  return (
    <main>
      {WORKFLOWS.map((workflow) => {
        const configured = Boolean(
          process.env[workflow.env.webhookUrl] && process.env[workflow.env.webhookSecret],
        );
        return (
          <WorkflowCard key={workflow.id} workflow={workflow} configured={configured} />
        );
      })}
    </main>
  );
}
