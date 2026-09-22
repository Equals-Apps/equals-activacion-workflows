import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { ENTITIES } from "@/lib/entities";
import { isEmailAllowed } from "@/lib/allowed-emails";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    // Antes chequeaba solo EQUALS11_ALLOWED_EMAILS: alguien allowed únicamente para otra
    // entidad (ej. Producción) quedaba bloqueado por Google antes de llegar a la app. El gate
    // de login es "¿pertenece a ALGUNA entidad?" — cuál puede ver, lo decide cada página.
    async signIn({ profile }) {
      return ENTITIES.some((entity) => isEmailAllowed(profile?.email, entity.allowedEmailsEnv));
    },
  },
});
