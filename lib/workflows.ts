export interface WorkflowTrigger {
  id: string;
  entity: "equals11";
  label: string;
  confirmationQuestion: string;
  successMessage: string;
  env: {
    webhookUrl: string;
    webhookSecret: string;
    allowedEmails: string;
  };
}

export const WORKFLOWS: readonly WorkflowTrigger[] = [
  {
    id: "new-pl-creation",
    entity: "equals11",
    label: "Crear P&L del mes — Equals11",
    confirmationQuestion: "¿Ya se actualizaron devs y clientes en la hoja Config?",
    successMessage:
      "Solicitud enviada — vas a recibir la confirmación en #e11-monthly-report cuando termine (puede tardar varios minutos).",
    env: {
      webhookUrl: "N8N_PLL_WEBHOOK_URL",
      webhookSecret: "N8N_PLL_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
];
