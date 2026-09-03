import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { WorkflowCard } from "@/components/WorkflowCard";
import { WORKFLOWS } from "@/lib/workflows";
import logoEquals11 from "@/public/logo-equals11.png";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Image
            src={logoEquals11}
            alt="Equals11"
            priority
            className="mx-auto h-10 w-auto"
          />
          <h1 className="mt-6 text-lg font-semibold text-e11-blue">
            Panel de Triggers
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Acceso restringido al equipo de Equals11.
          </p>
          <Link
            href="/api/auth/signin"
            className="mt-6 block w-full rounded-lg bg-e11-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-e11-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-e11-blue"
          >
            Iniciar sesión con Google
          </Link>
        </div>
      </main>
    );
  }

  // Fail-closed en el render: por cada workflow chequeamos server-side que existan sus env vars
  // de webhook. Si faltan, la card sale deshabilitada (WorkflowCard lo maneja) en vez de ofrecer
  // un botón que terminaría en un 500. Pasar `workflow` al cliente es seguro: env guarda NOMBRES
  // de env var, no valores. La página ya es dinámica (await auth), así que process.env se lee por
  // request.
  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            {/* El logo ya contiene la palabra "Equals11": el h1 no la repite. */}
            <Image src={logoEquals11} alt="Equals11" priority className="h-8 w-auto" />
            <span aria-hidden="true" className="h-6 w-px bg-slate-200" />
            <h1 className="text-sm font-semibold text-e11-blue sm:text-base">
              Panel de Triggers
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* En mobile se oculta el email para que el header no se parta en dos líneas. */}
            <span className="hidden text-sm text-slate-500 sm:block">
              {session.user?.email}
            </span>
            {/* Server action en vez de <Link href="/api/auth/signout">: esa ruta renderiza la
                página de confirmación default de NextAuth, sin brandear y con un click extra.
                `signOut` ya viene exportado de auth.ts — no se modifica ese archivo. */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-e11-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-e11-blue"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {WORKFLOWS.map((workflow) => {
            const configured = Boolean(
              process.env[workflow.env.webhookUrl] && process.env[workflow.env.webhookSecret],
            );
            return (
              <WorkflowCard key={workflow.id} workflow={workflow} configured={configured} />
            );
          })}
        </div>
      </main>
    </div>
  );
}
