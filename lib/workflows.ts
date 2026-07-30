export interface WorkflowTrigger {
  id: string;
  entity: "equals11";
  label: string;
  confirmationQuestion: string;
  successMessage: string;
  // Opcional y todavía sin usar: reservado para cuando se pida mostrar una descripción
  // por card, sin tener que volver a tocar el tipo. Dejar undefined en las entradas.
  description?: string;
  env: {
    webhookUrl: string;
    webhookSecret: string;
    allowedEmails: string;
  };
}

// Copia genérica compartida por los workflows que todavía no tienen un texto propio.
// P&L (new-pl-creation) mantiene su pregunta y su mensaje específicos, no estos.
const GENERIC_CONFIRMATION = "Confirmo que quiero correr este workflow ahora.";
const GENERIC_SUCCESS =
  "Solicitud enviada — vas a recibir la confirmación cuando termine.";

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
  {
    id: "revenue-update",
    entity: "equals11",
    label: "Revenue Update",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_UPDATE_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_UPDATE_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "monthly-report-creator",
    entity: "equals11",
    label: "Monthly Report Creator",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_MONTHLY_REPORT_WEBHOOK_URL",
      webhookSecret: "N8N_MONTHLY_REPORT_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "cashflow-db-update",
    entity: "equals11",
    label: "Cashflow DB Update",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_CASHFLOW_DB_WEBHOOK_URL",
      webhookSecret: "N8N_CASHFLOW_DB_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "cogs-hours-update",
    entity: "equals11",
    label: "COGS Hours Update",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_COGS_HOURS_WEBHOOK_URL",
      webhookSecret: "N8N_COGS_HOURS_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "status-sync",
    entity: "equals11",
    label: "Status Sync",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_STATUS_SYNC_WEBHOOK_URL",
      webhookSecret: "N8N_STATUS_SYNC_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "pnl-folder-copy-monthly",
    entity: "equals11",
    label: "P&L Folder Copy - Monthly",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_PNL_FOLDER_COPY_WEBHOOK_URL",
      webhookSecret: "N8N_PNL_FOLDER_COPY_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "timekeeping-folder-copy-monthly",
    entity: "equals11",
    label: "Timekeeping Folder Copy Monthly",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_TIMEKEEPING_FOLDER_COPY_WEBHOOK_URL",
      webhookSecret: "N8N_TIMEKEEPING_FOLDER_COPY_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "revenue-new-invoices",
    entity: "equals11",
    label: "New Invoices",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_NEW_INVOICES_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_NEW_INVOICES_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
];
