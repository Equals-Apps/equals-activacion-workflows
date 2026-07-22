"use client";

import { useState } from "react";
import { WORKFLOWS } from "@/lib/workflows";

export function TriggerButton() {
  const workflow = WORKFLOWS[0];
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  async function handleClick() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/trigger-pnl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true }),
      });
      setResult(res.ok ? "success" : "error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
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
