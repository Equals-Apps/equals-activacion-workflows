"use client";

import { useState } from "react";
import Image from "next/image";
import { CompanyTabs } from "@/components/CompanyTabs";
import type { EntityId } from "@/lib/entities";
import logoEquals11 from "@/public/logo-equals11.png";
import logoEquals11White from "@/public/logo-equals11-white.png";

interface Tab {
  id: EntityId;
  label: string;
  content: React.ReactNode;
}

// El <header> necesita saber cuál pestaña está activa para cambiar de marca (logo, título,
// fondo), pero ese estado antes vivía adentro de CompanyTabs (client component), fuera del
// alcance del <header> que se renderizaba en page.tsx (server component). Este componente es
// el ancestro común: sube el estado acá y lo reparte a header + CompanyTabs.
export function AppShell({
  tabs,
  email,
  initialActiveId,
  signOutAction,
}: {
  tabs: Tab[];
  email: string | null | undefined;
  // Hint cosmético (viene de ?tab= en la URL de login) para elegir la pestaña inicial entre
  // las YA autorizadas — nunca agrega una pestaña que no estuviera en `tabs`. Si el hint no
  // matchea ninguna (o no vino), se cae a la primera pestaña permitida, como antes.
  initialActiveId?: EntityId;
  signOutAction: () => Promise<void>;
}) {
  const [activeId, setActiveId] = useState<EntityId | undefined>(
    initialActiveId && tabs.some((tab) => tab.id === initialActiveId)
      ? initialActiveId
      : tabs[0]?.id,
  );

  // Fondo sólido e11-blue-dark en toda la pantalla + logo, header, email y "Cerrar sesión" en
  // blanco cuando la pestaña activa es Producción, más el badge "PRODUCCIÓN" que Sandbox no
  // tiene. Las cards de WorkflowCard.tsx siguen siendo blancas en ambos casos (no pasan a modo
  // oscuro).
  const isEquals11Production = activeId === "equals11-production";
  const isEquals11Sandbox = activeId === "equals11";

  return (
    <div className={"min-h-screen " + (isEquals11Production ? "bg-e11-blue-dark" : "")}>
      <header
        className={
          "border-b " +
          (isEquals11Production ? "border-e11-blue-dark bg-e11-blue-dark" : "border-slate-200 bg-white")
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            {/* El logo ya contiene la palabra "Equals11": el h1 no la repite. */}
            <Image
              src={isEquals11Production ? logoEquals11White : logoEquals11}
              alt="Equals11"
              priority
              className="h-8 w-auto"
            />
            <span
              aria-hidden="true"
              className={"h-6 w-px " + (isEquals11Production ? "bg-white/30" : "bg-slate-200")}
            />
            <h1
              className={
                "text-sm font-semibold sm:text-base " +
                (isEquals11Production ? "text-white" : "text-e11-blue")
              }
            >
              Panel de Triggers
            </h1>
            {isEquals11Production && (
              <span className="rounded-full bg-e11-blue px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Producción
              </span>
            )}
            {isEquals11Sandbox && (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                Sandbox
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* En mobile se oculta el email para que el header no se parta en dos líneas. */}
            <span
              className={
                "hidden text-sm sm:block " + (isEquals11Production ? "text-white/80" : "text-slate-500")
              }
            >
              {email}
            </span>
            {/* Server action pasada como prop desde page.tsx (server component): sigue siendo
                la misma `signOut` de auth.ts, esto solo mueve dónde se renderiza el form. */}
            <form action={signOutAction}>
              <button
                type="submit"
                className={
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 " +
                  (isEquals11Production
                    ? "border-white/30 text-white hover:border-white hover:text-white/80 focus-visible:outline-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-e11-blue focus-visible:outline-e11-blue")
                }
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <CompanyTabs tabs={tabs} activeId={activeId} onActiveIdChange={(id) => setActiveId(id as EntityId)} />
      </main>
    </div>
  );
}
