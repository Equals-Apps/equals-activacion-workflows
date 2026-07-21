export function isEmailAllowed(email: string | null | undefined, envVarName: string): boolean {
  if (!email) return false;
  const raw = process.env[envVarName];
  if (!raw) {
    console.error(`Whitelist env var ${envVarName} no está seteada`);
    return false; // fail closed: si falta la env var, nadie entra
  }
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .includes(email.trim().toLowerCase());
}
