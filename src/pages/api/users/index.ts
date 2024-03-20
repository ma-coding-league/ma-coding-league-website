import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeUser } from "@/scripts/API/Users";

export const USER_PAGE_SIZE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      const userEdit = deserializeUser(req.body);
      // @ts-ignore
      await xata.db.nextauth_users.update(userEdit.id, {
        roles: userEdit.roles,
        team: userEdit.team,
        graduationYear: userEdit.graduationYear,
        teamVerified: userEdit.teamVerified,
      });
      res.status(200).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      await xata.db.nextauth_users.delete(req.body);
      res.status(200).end();
    });
  }

  res.status(405).end();
}
