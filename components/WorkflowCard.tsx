"use client";

import { useState } from "react";
import type { WorkflowTrigger } from "@/lib/workflows";

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        className="opacity-30"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// `configured` lo calcula el Server Component (page.tsx) leyendo process.env server-side:
// si al workflow le faltan sus env vars de webhook, la card se renderiza deshabilitada en vez
// de un botón que dispararía un 500. Es el fail-closed también en el render, no solo en la API.
export function WorkflowCard({
  workflow,
  configured,
  isProduction,
}: {
  workflow: WorkflowTrigger;
  configured: boolean;
  // Flag puramente visual (acento ámbar + badge "PRODUCCIÓN"): quién arma cada bloque de
  // contenido (equals11Content vs equals11ProductionContent en page.tsx) ya sabe de qué
  // entity es cada workflow, así que se lo pasa resuelto acá. La card no importa ENTITIES
  // ni deriva el entorno por su cuenta — evita que un día alguien intente "adivinar"
  // producción por el id (ej. .endsWith("-production")) en vez de por la entity real.
  isProduction: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  async function handleClick() {
    // Limpiar el error anterior antes de reintentar. Sin esto el panel rojo sigue en
    // pantalla durante el reintento, contradiciendo al spinner que dice que está andando.
    setResult(null);
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

  // Los cuatro estados comparten el mismo cascarón para que todas las cards midan igual en
  // el grid: `h-full` + `flex-col`, y la zona de acción empujada al fondo con `mt-auto`.
  return (
    <article
      className={
        "flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm " +
        (configured
          ? "border-slate-200 transition-shadow hover:shadow-md " +
            (isProduction ? "hover:border-e11-production" : "hover:border-e11-cyan")
          : "border-slate-200")
      }
    >
      {/* Barra de acento: celeste en sandbox/Tekton-N/A, ámbar en Producción. Puramente
          decorativa — no comunica nada que dependa solo de percibirla, el badge de al lado
          del título es la señal redundante. Ver nota de contraste en globals.css. */}
      <div
        className={
          "h-1 " +
          (configured ? (isProduction ? "bg-e11-production" : "bg-e11-cyan") : "bg-slate-200")
        }
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2
            className={
              "text-base font-semibold leading-snug " +
              (configured ? "text-e11-blue" : "text-slate-400")
            }
          >
            {workflow.label}
          </h2>
          {/* Los dos badges son independientes: una card de producción sin configurar
              todavía muestra ambos, apilados. */}
          <div className="flex shrink-0 flex-col items-end gap-1">
            {isProduction && (
              <span className="rounded-full border border-e11-production bg-e11-production/15 px-2 py-0.5 text-xs font-semibold text-e11-production-dark">
                PRODUCCIÓN
              </span>
            )}
            {!configured && (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                No configurado
              </span>
            )}
          </div>
        </div>

        <p
          className={
            "mt-2 text-sm leading-relaxed " +
            (configured ? "text-slate-600" : "text-slate-400")
          }
        >
          {workflow.description}
        </p>

        <div className="mt-auto pt-5">
          {!configured ? (
            <p className="border-t border-slate-100 pt-4 text-sm text-slate-400">
              Falta cargar el webhook de este workflow en n8n. Cuando esté, la card se
              habilita sola.
            </p>
          ) : result === "success" ? (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-900"
            >
              <span className="font-semibold">Listo. </span>
              {workflow.successMessage}
            </div>
          ) : (
            <>
              {result === "error" && (
                <div
                  role="alert"
                  className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-900"
                >
                  <span className="font-semibold">No se pudo disparar el workflow. </span>
                  Probá de nuevo; si vuelve a fallar, avisá en el canal.
                </div>
              )}

              <label
                className={
                  "flex items-start gap-2.5 border-t border-slate-100 pt-4 text-sm " +
                  (submitting
                    ? "cursor-default text-slate-400"
                    : "cursor-pointer text-slate-700")
                }
              >
                <input
                  type="checkbox"
                  checked={confirmed}
                  disabled={submitting}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className={
                    "mt-0.5 size-4 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 " +
                    (isProduction
                      ? "accent-e11-production-dark focus-visible:outline-e11-production-dark"
                      : "accent-e11-blue focus-visible:outline-e11-blue")
                  }
                />
                <span>{workflow.confirmationQuestion}</span>
              </label>

              <button
                type="button"
                disabled={!confirmed || submitting}
                aria-busy={submitting}
                aria-label={`Ejecutar workflow: ${workflow.label}`}
                onClick={handleClick}
                className={
                  "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 " +
                  (isProduction
                    ? "bg-e11-production-dark hover:brightness-90 focus-visible:outline-e11-production-dark"
                    : "bg-e11-blue hover:bg-e11-blue-dark focus-visible:outline-e11-blue")
                }
              >
                {submitting ? (
                  <>
                    <Spinner />
                    Enviando…
                  </>
                ) : (
                  "Ejecutar workflow"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
