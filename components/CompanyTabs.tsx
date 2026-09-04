"use client";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

// Controlado desde afuera (AppShell) en vez de manejar su propio useState: el <header> vive
// fuera de este árbol y necesita saber cuál es la pestaña activa para cambiar de marca, así
// que el estado se levantó a un ancestro común en vez de duplicarlo acá.
//
// Todas las pestañas que llegan acá ya están autorizadas — el filtro por email pasó en el
// Server Component (page.tsx), antes de que este árbol exista. Con 0 o 1 pestaña no hay nada
// que "cambiar", así que no se renderiza el selector: así un usuario solo-Equals11 (el caso
// de hoy) ve exactamente lo mismo que antes de que existiera este componente.
export function CompanyTabs({
  tabs,
  activeId,
  onActiveIdChange,
}: {
  tabs: Tab[];
  activeId: string | undefined;
  onActiveIdChange: (id: string) => void;
}) {
  if (tabs.length <= 1) {
    return <>{tabs[0]?.content ?? null}</>;
  }

  return (
    <div>
      <div role="tablist" aria-label="Empresa" className="mb-6 flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onActiveIdChange(tab.id)}
              className={
                "border-b-2 px-3 py-2 text-sm font-medium transition-colors " +
                (selected
                  ? tab.id === "tekton"
                    ? "border-tk-primary text-tk-primary"
                    : "border-e11-blue text-e11-blue"
                  : "border-transparent text-slate-500 hover:text-slate-700")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Todas quedan montadas (nunca desmontadas) para no perder el estado de cada
          pestaña — ej. un checkbox tildado en Equals11 sigue tildado al volver de Tekton.
          Ocultar con `hidden` alcanza: no hay nada más caro que reflow acá adentro. */}
      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" hidden={tab.id !== activeId}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
