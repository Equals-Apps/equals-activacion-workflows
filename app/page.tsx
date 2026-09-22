import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { AppShell } from "@/components/AppShell";
import { AutomatedWorkflowCard } from "@/components/AutomatedWorkflowCard";
import { WorkflowCard } from "@/components/WorkflowCard";
import { ENTITIES, allowedEntitiesFor, type EntityId } from "@/lib/entities";
import { WORKFLOWS } from "@/lib/workflows";
import logoEquals11 from "@/public/logo-equals11.png";

// Server action compartida por el botón de "Cerrar sesión" del header (vía AppShell, client
// component) y por la pantalla de "sin acceso" más abajo. Sigue siendo la misma `signOut` de
// auth.ts — esto no le agrega ni le saca lógica, solo permite pasarla como prop a un client
// component (patrón soportado: server actions definidas en un Server Component se pueden pasar
// por props).
async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-16">
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
            href={`/api/auth/signin?callbackUrl=${encodeURIComponent("/?tab=equals11")}`}
            className="mt-6 block w-full rounded-lg bg-e11-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-e11-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-e11-blue"
          >
            Iniciar sesión con Google
          </Link>
        </div>
      </main>
    );
  }

  // Qué entidades (empresas) puede ver esta persona — puede ser más de una (ej. Alonso).
  // El login (auth.ts) ya exige pertenecer a AL MENOS una; esto decide específicamente cuáles.
  const email = session.user?.email;
  const allowedEntities = allowedEntitiesFor(email);

  // Hint puramente cosmético (viene de ?tab= en la URL de login, ver los dos <Link> de arriba):
  // AppShell solo lo usa para elegir con cuál pestaña abrir entre las que `allowedEntities` ya
  // autorizó. Si el email no tiene acceso a la entidad que hintea, AppShell cae sola a la
  // primera pestaña permitida — no hay ninguna ruta donde este valor amplíe acceso.
  const { tab } = await searchParams;
  const tabHint: EntityId | undefined = tab === "equals11" ? tab : undefined;

  // Solo alcanzable si a alguien se le sacó de TODAS las whitelists después de que su sesión
  // JWT ya se emitió (revocación sin logout forzado — mismo caso que ya maneja /api/trigger).
  // Fail-closed también acá: sin esto, `tabs` quedaría vacío y CompanyTabs no renderizaría nada,
  // una pantalla en blanco sin explicación.
  if (allowedEntities.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-e11-blue">Sin acceso</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tu cuenta ({email}) ya no tiene ningún workflow habilitado. Si esto es un error,
            avisá en el canal.
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-300"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Fail-closed en el render: por cada workflow chequeamos server-side que existan sus env vars
  // de webhook. Si faltan, la card sale deshabilitada (WorkflowCard lo maneja) en vez de ofrecer
  // un botón que terminaría en un 500. Pasar `workflow` al cliente es seguro: env guarda NOMBRES
  // de env var, no valores. La página ya es dinámica (await auth), así que process.env se lee por
  // request.
  const equals11Content = (
    <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {WORKFLOWS.filter((workflow) => workflow.entity === "equals11").map((workflow) => {
        const configured = Boolean(
          process.env[workflow.env.webhookUrl] && process.env[workflow.env.webhookSecret],
        );
        return (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            configured={configured}
            isProduction={false}
          />
        );
      })}
    </div>
  );

  const equals11ProductionContent = (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Workflows manuales
        </h3>
        <div className="mt-3 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {WORKFLOWS.filter((workflow) => workflow.entity === "equals11-production").map(
            (workflow) => {
              const configured = Boolean(
                process.env[workflow.env.webhookUrl] && process.env[workflow.env.webhookSecret],
              );
              return (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  configured={configured}
                  isProduction={true}
                />
              );
            },
          )}
        </div>
      </div>

      {/* No son workflows de trigger manual — corren solos al detectar un archivo en Drive,
          así que no usan WorkflowCard (no hay botón que activar): recuadros colapsables
          aparte, separados de la sección de arriba. */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Workflows automáticos
        </h3>
        <div className="mt-3 grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
          <AutomatedWorkflowCard
            label="Cashflow Automation"
            description="Actualiza automáticamente la base de Cashflow al detectar el extracto del mes en Drive."
            isProduction={true}
            steps={[
              "Entra a la cuenta checking de BofA desde la web, usando las credenciales de Equals11.",
              "Descarga el extracto (statement) en formato .csv, con las transacciones del mes que se va a trabajar.",
              "Coloca el archivo .csv dentro de Drive, en la carpeta Cashflow → BOFA CSV Inputs → carpeta del año correspondiente.",
              "El workflow corre automáticamente al detectar el archivo — no requiere activación manual.",
              "Resultado: se crea automáticamente un documento nuevo con la base de datos actualizada, dentro de Cashflow → Cashflow Sheets → carpeta del año correspondiente.",
            ]}
          />
          <AutomatedWorkflowCard
            label="SG&A Update"
            description="Registra automáticamente los gastos de SG&A del mes en el spreadsheet maestro al detectar los .csv en Drive."
            isProduction={true}
            warning="⚠️ Antes de descargar los archivos, confirma con Marjori que ya terminó de registrar los gastos del mes en QuickBooks."
            steps={[
              "En QuickBooks, ve a la pestaña P&L y descarga el .csv de Expenses del mes.",
              "Descarga también el .csv de COGS (tools) del mismo mes.",
              "Coloca el .csv de Expenses en Drive, en la carpeta P&Ls → SG&A CSV → SGA-Expenses.",
              "Coloca el .csv de COGS/Tools en Drive, en la carpeta P&Ls → SG&A CSV → SGA-COGS-Tools.",
              "El workflow corre automáticamente al detectar los archivos — no requiere activación manual.",
              "Resultado: los gastos quedan registrados en la hoja SG&A del spreadsheet maestro Invoices/Config, con banderas de color: 🟢 recurrente, 🟡 mismo proveedor con monto distinto, 🔴 proveedor nuevo. Los gastos se registran en negativo, excepto Credit Card Credit y Deposit, que mantienen su signo original.",
            ]}
          />
        </div>
      </div>
    </div>
  );

  // Orden fijo (el de ENTITIES), no el de allowedEntities: así la posición de cada pestaña no
  // depende del orden en que matchearon las whitelists.
  const tabs = ENTITIES.filter((entity) => allowedEntities.includes(entity.id)).map((entity) => {
    const content = entity.id === "equals11" ? equals11Content : equals11ProductionContent;
    return { id: entity.id, label: entity.label, content };
  });

  return (
    <AppShell tabs={tabs} email={email} initialActiveId={tabHint} signOutAction={signOutAction} />
  );
}
