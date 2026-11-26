import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

declare module "next-auth" {
  interface User {
    role: string;
    companyId?: string;
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      companyId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    companyId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-me",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;
        await dbConnect();
        const user = await User.findOne({ email });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId ? String(user.companyId) : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: string }).role;
        token.companyId = (user as { companyId?: string }).companyId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    },
  },
});
