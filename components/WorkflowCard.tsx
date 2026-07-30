"use client";

import { useState } from "react";
import type { WorkflowTrigger } from "@/lib/workflows";

// `configured` lo calcula el Server Component (page.tsx) leyendo process.env server-side:
// si al workflow le faltan sus env vars de webhook, la card se renderiza deshabilitada en vez
// de un botón que dispararía un 500. Es el fail-closed también en el render, no solo en la API.
export function WorkflowCard({
  workflow,
  configured,
}: {
  workflow: WorkflowTrigger;
  configured: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  async function handleClick() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: workflow.id, confirmed: true }),
      });
      setResult(res.ok ? "success" : "error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!configured) {
    return (
      <div>
        <p>{workflow.label}</p>
        <p>No configurado todavía en n8n</p>
      </div>
    );
  }

  if (result === "success") {
    return <p>{workflow.successMessage}</p>;
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        {workflow.confirmationQuestion}
      </label>
      <button type="button" disabled={!confirmed || submitting} onClick={handleClick}>
        {workflow.label}
      </button>
      {result === "error" && <p role="alert">Algo falló. Intentá de nuevo.</p>}
    </div>
  );
}
