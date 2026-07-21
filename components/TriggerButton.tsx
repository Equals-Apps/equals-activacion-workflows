"use client";

import { WORKFLOWS } from "@/lib/workflows";

export function TriggerButton() {
  const workflow = WORKFLOWS[0];

  return <button type="button">{workflow.label}</button>;
}
