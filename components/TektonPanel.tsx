import type { WorkflowTrigger } from "@/lib/workflows";
import { TektonWorkflowCard } from "@/components/TektonWorkflowCard";

// Razones sociales de Tekton que todavía no tienen webhook de n8n propio. El id ya anticipa
// el nombre de env var que va a usar (N8N_TEKTON_SAC_WEBHOOK_URL/SECRET) para que "habilitar"
// sea sacar el objeto de acá y darlo de alta en WORKFLOWS con su descripción real — no hay
// nada que renombrar.
const PLACEHOLDER_WORKFLOWS = [{ id: "tekton-sac", label: "Workflow SAC" }] as const;

// No están en lib/workflows.ts a propósito: ese array exige description/confirmationQuestion
// reales (para que nada llegue al panel sin explicar qué hace) y su estado "no configurado"
// siempre muestra un mensaje — acá se pidió lo opuesto, sin mensaje, mientras no haya webhook.
// Tema oscuro a propósito (bg-tk-black, texto blanco/cian): coherente con el <header> cuando
// la pestaña Tekton está activa (AppShell.tsx). Antes era claro (bg-tk-light) y quedaba
// desalineado del resto de la marca — ver la referencia del sitio real de Tekton.
export function TektonPanel({
  workflows,
}: {
  // Ya resueltos por el Server Component (page.tsx), mismo criterio que equals11Content:
  // filtrados por entity === "tekton" y con `configured` calculado leyendo process.env.
  workflows: { workflow: WorkflowTrigger; configured: boolean }[];
}) {
  return (
    <div className="rounded-tk-lg bg-tk-black p-6 font-tk-sans sm:p-8">
      <div className="h-1 w-12 rounded-tk-full bg-tk-secondary" />

      <h2 className="mt-4 font-tk-display text-2xl italic text-white">Tekton</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-tk-secondary/80">
        Cada botón corre el workflow de n8n de su propia razón social. Se habilitan cuando
        el webhook correspondiente esté configurado.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {workflows.map(({ workflow, configured }) => (
          <TektonWorkflowCard key={workflow.id} workflow={workflow} configured={configured} />
        ))}
        {PLACEHOLDER_WORKFLOWS.map((workflow) => (
          <button
            key={workflow.id}
            type="button"
            disabled
            className="rounded-tk-md bg-tk-primary px-4 py-3 text-sm font-semibold text-white opacity-40 cursor-not-allowed"
          >
            {workflow.label}
          </button>
        ))}
      </div>
    </div>
  );
}
