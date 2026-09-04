import { isEmailAllowed } from "@/lib/allowed-emails";

export type EntityId = "equals11" | "tekton";

export interface Entity {
  id: EntityId;
  label: string;
  // Nombre de la env var de whitelist para esta entidad — misma que usan sus workflows
  // en WORKFLOWS (lib/workflows.ts). Fuente única: si una entidad todavía no tiene ningún
  // workflow (ej. Tekton hoy, con INC/SAC deshabilitados), esta lista sigue siendo la que
  // decide si la persona ve la pestaña.
  allowedEmailsEnv: string;
}

export const ENTITIES: readonly Entity[] = [
  { id: "equals11", label: "Equals11", allowedEmailsEnv: "EQUALS11_ALLOWED_EMAILS" },
  { id: "tekton", label: "Tekton", allowedEmailsEnv: "TEKTON_ALLOWED_EMAILS" },
];

// Un email puede estar en más de una whitelist (misma persona, un correo por empresa):
// no hay modelo de "usuario", cada string se chequea de forma independiente.
export function allowedEntitiesFor(email: string | null | undefined): EntityId[] {
  return ENTITIES.filter((entity) => isEmailAllowed(email, entity.allowedEmailsEnv)).map(
    (entity) => entity.id,
  );
}
