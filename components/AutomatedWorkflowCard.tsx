function ChevronIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Tarjeta para workflows que se disparan solos (trigger de archivo en Drive, no botón manual).
// <details>/<summary> nativos en vez de estado de React: cada recuadro se abre/cierra de forma
// independiente (no es un acordeón) y el navegador ya expone el estado abierto/cerrado a
// accesibilidad sin necesitar aria-expanded a mano.
// Cerrada por defecto (sin atributo `open`) y compacta: la card completa de instrucciones
// (lista numerada + aviso ámbar) solo se renderiza expandida, no siempre visible como antes.
export function AutomatedWorkflowCard({
  label,
  description,
  warning,
  steps,
  isProduction,
}: {
  label: string;
  description: string;
  warning?: string;
  steps: string[];
  isProduction: boolean;
}) {
  return (
    <details
      className={
        "group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow " +
        "border-slate-200 border-l-4 hover:shadow-md " +
        (isProduction ? "border-l-e11-blue-dark" : "border-l-e11-cyan")
      }
    >
      <summary
        className={
          "flex cursor-pointer list-none items-start justify-between gap-3 p-4 " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 " +
          "[&::-webkit-details-marker]:hidden " +
          (isProduction
            ? "focus-visible:outline-e11-blue-dark"
            : "focus-visible:outline-e11-cyan")
        }
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold leading-snug text-e11-blue">{label}</h2>
            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Automático
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <ChevronIcon />
      </summary>

      <div className="border-t border-slate-100 p-4 text-sm leading-relaxed text-slate-700">
        {warning && (
          <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-amber-900">
            {warning}
          </p>
        )}
        <ol className="list-decimal space-y-2 pl-5">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </details>
  );
}
