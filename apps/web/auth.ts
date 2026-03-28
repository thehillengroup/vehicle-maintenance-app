import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { ensureUserByEmail } from "@repo/db";

const result: NextAuthResult = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await ensureUserByEmail(user.email);
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export const { handlers, signIn, signOut, auth } = result;
