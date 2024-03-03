import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getXataClient, XataClient } from "@/xata";
import { XataAdapter } from "@next-auth/xata-adapter";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

const client = new XataClient();

export const authOptions = {
  adapter: XataAdapter(client),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({
      session,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) {
      const xata = getXataClient();
      const dbUser = await xata.db.nextauth_users
        .filter("email", session.user.email)
        .getFirst();
      if (dbUser !== null) {
        session.user.id = dbUser.id;
        session.user.roles = dbUser.roles ?? "user";
      }
      return session;
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
