import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isEmailAllowed } from "@/lib/allowed-emails";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    async signIn({ profile }) {
      return isEmailAllowed(profile?.email, "EQUALS11_ALLOWED_EMAILS");
    },
  },
});
