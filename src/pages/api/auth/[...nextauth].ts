import NextAuth, { Account, Profile, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { AdapterUser } from "next-auth/adapters";
import { getXataClient } from "@/xata";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      email?: { verificationRequest?: boolean | undefined } | undefined;
      credentials?: any | undefined;
    }) {
      const xata = getXataClient();
      if ((await xata.db.users.read(user.id)) == null) {
        await xata.db.users.create({ id: user.id });
      }
      return true;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      trigger?: "signIn" | "signUp" | "update" | undefined;
      isNewUser?: boolean | undefined;
      session?: any;
    }) {
      const xata = getXataClient();
      if (user) {
        const dbUser = await xata.db.users.read(user.id);
        token.id = user.id;
        token.roles = dbUser != null ? dbUser.roles : "";
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      return session;
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
