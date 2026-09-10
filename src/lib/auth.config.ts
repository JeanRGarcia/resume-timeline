import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma/bcrypt imports) used by the proxy/middleware
 * to check session presence. The full config with the Credentials provider lives
 * in `auth.ts` and only runs in the Node.js runtime (Server Actions, API routes).
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
} satisfies NextAuthConfig;
