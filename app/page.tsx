import Link from "next/link";
import { auth } from "@/auth";
import { TriggerButton } from "@/components/TriggerButton";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main>
        <Link href="/api/auth/signin">Iniciar sesión con Google</Link>
      </main>
    );
  }

  return (
    <main>
      <TriggerButton />
    </main>
  );
}
