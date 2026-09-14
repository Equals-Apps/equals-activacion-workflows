import type { EntityId } from "@/lib/entities";

export interface WorkflowTrigger {
  id: string;
  entity: EntityId;
  label: string;
  confirmationQuestion: string;
  successMessage: string;
  // Requerido a propósito: la card la muestra bajo el label. Estos botones escriben sobre
  // Sheets, Drive y Slack reales, así que ningún workflow debería llegar al panel sin
  // explicar qué hace. Si se agrega uno sin description, no compila.
  description: string;
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
    description:
      "Crea el archivo de P&L del mes en Drive a partir de la hoja Config (devs y clientes) y avisa en Slack cuando termina.",
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
    id: "revenue-new-invoices",
    entity: "equals11",
    label: "New Invoices",
    description:
      "Registra en el P&L las facturas nuevas que todavía no tienen fila en Revenue. " +
      "También recalcula las comisiones automáticamente (dispara Commissions Update dentro de n8n).",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_NEW_INVOICES_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_NEW_INVOICES_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "monthly-report-creator",
    entity: "equals11",
    label: "Monthly Report Creator",
    description:
      "Duplica la presentación del mes anterior en Slides y actualiza fechas, mes y trimestre automáticamente.",
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
    description:
      "Agrega las filas del Cashflow del mes más reciente a la base histórica en Sheets, evitando duplicados.",
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
    description:
      "Cruza horas de Timekeeping por dev contra la hoja COGS del P&L vigente y actualiza los totales.",
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
    description:
      "Compara el estado de las facturas emitidas contra la hoja Revenue del P&L y sincroniza lo que cambió.",
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
    description:
      "Crea la carpeta del mes en Drive para P&L, Cashflow y Monthly Report, copiando los archivos base.",
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
    description: "Copia la carpeta de Timekeeping del mes en Drive.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_TIMEKEEPING_FOLDER_COPY_WEBHOOK_URL",
      webhookSecret: "N8N_TIMEKEEPING_FOLDER_COPY_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  {
    id: "revenue-update",
    entity: "equals11",
    label: "Revenue Update",
    description:
      "Concilia estados y fechas de facturas ya emitidas contra la hoja Revenue del P&L vigente. " +
      "También recalcula las comisiones automáticamente (dispara Commissions Update dentro de n8n).",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_UPDATE_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_UPDATE_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_ALLOWED_EMAILS",
    },
  },
  // --- Equals11 — Producción ---
  // Mismos 6 workflows que ya corren en sandbox, mismo description/confirmationQuestion/
  // successMessage (misma lógica de negocio, solo cambia que ahora pegan a datos reales) —
  // pero con su propio par de env vars (N8N_..._PRODUCTION_*) y su propia whitelist
  // (EQUALS11_PRODUCTION_ALLOWED_EMAILS). Commissions Update queda afuera de este batch a
  // propósito: se dispara automáticamente desde Revenue Update dentro de n8n, y un botón
  // manual acá crearía riesgo de correrlo dos veces sobre la misma data.
  {
    id: "new-pl-creation-production",
    entity: "equals11-production",
    label: "Crear P&L del mes — Equals11",
    description:
      "Crea el archivo de P&L del mes en Drive a partir de la hoja Config (devs y clientes) y avisa en Slack cuando termina.",
    confirmationQuestion: "¿Ya se actualizaron devs y clientes en la hoja Config?",
    successMessage:
      "Solicitud enviada — vas a recibir la confirmación en #e11-monthly-report cuando termine (puede tardar varios minutos).",
    env: {
      webhookUrl: "N8N_PLL_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_PLL_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "revenue-new-invoices-production",
    entity: "equals11-production",
    label: "New Invoices",
    description:
      "Registra en el P&L las facturas nuevas que todavía no tienen fila en Revenue. " +
      "También recalcula las comisiones automáticamente (dispara Commissions Update dentro de n8n).",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_NEW_INVOICES_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_NEW_INVOICES_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "monthly-report-creator-production",
    entity: "equals11-production",
    label: "Monthly Report Creator",
    description:
      "Duplica la presentación del mes anterior en Slides y actualiza fechas, mes y trimestre automáticamente.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_MONTHLY_REPORT_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_MONTHLY_REPORT_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "cashflow-db-update-production",
    entity: "equals11-production",
    label: "Cashflow DB Update",
    description:
      "Agrega las filas del Cashflow del mes más reciente a la base histórica en Sheets, evitando duplicados.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_CASHFLOW_DB_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_CASHFLOW_DB_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "status-sync-production",
    entity: "equals11-production",
    label: "Status Sync",
    description:
      "Compara el estado de las facturas emitidas contra la hoja Revenue del P&L y sincroniza lo que cambió.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_STATUS_SYNC_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_STATUS_SYNC_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "revenue-update-production",
    entity: "equals11-production",
    label: "Revenue Update",
    description:
      "Concilia estados y fechas de facturas ya emitidas contra la hoja Revenue del P&L vigente. " +
      "También recalcula las comisiones automáticamente (dispara Commissions Update dentro de n8n).",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_REVENUE_UPDATE_PRODUCTION_WEBHOOK_URL",
      webhookSecret: "N8N_REVENUE_UPDATE_PRODUCTION_WEBHOOK_SECRET",
      allowedEmails: "EQUALS11_PRODUCTION_ALLOWED_EMAILS",
    },
  },
  {
    id: "tekton-inc",
    entity: "tekton",
    label: "Workflow INC",
    description:
      "Convierte el P&L contable de Tekton INC en el P&L de management: recalcula " +
      "regalías, rentings y vacaciones con el criterio que usa management, no el contable.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_TEKTON_INC_WEBHOOK_URL",
      webhookSecret: "N8N_TEKTON_INC_WEBHOOK_SECRET",
      allowedEmails: "TEKTON_ALLOWED_EMAILS",
    },
  },
  {
    id: "tekton-sac",
    entity: "tekton",
    label: "Workflow SAC",
    description:
      "Convierte el P&L contable de Tekton SAC en el P&L de management: recalcula " +
      "regalías, rentings y vacaciones con el criterio que usa management, no el contable.",
    confirmationQuestion: GENERIC_CONFIRMATION,
    successMessage: GENERIC_SUCCESS,
    env: {
      webhookUrl: "N8N_TEKTON_SAC_WEBHOOK_URL",
      webhookSecret: "N8N_TEKTON_SAC_WEBHOOK_SECRET",
      allowedEmails: "TEKTON_ALLOWED_EMAILS",
    },
  },
];
