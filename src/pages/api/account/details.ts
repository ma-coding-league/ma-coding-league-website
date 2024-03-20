import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "GET") {
    return await authorizeToRunCallback(
      req,
      res,
      xata,
      "user",
      async (session) => {
        const user = await xata.db.nextauth_users
          .filter("email", session.user.email)
          .getFirst();
        if (user === null) {
          res.status(404).end();
          return;
        }
        res.status(200).json({
          team: user.team,
          graduationYear: user.graduationYear,
        });
      },
    );
  } else if (req.method === "PUT") {
    return await authorizeToRunCallback(
      req,
      res,
      xata,
      "user",
      async (session) => {
        const userDetailsEdit = JSON.parse(req.body);
        const user = await xata.db.nextauth_users
          .filter("email", session.user.email)
          .getFirst();
        if (user === null) {
          res.status(404).end();
          return;
        }
        await xata.db.nextauth_users.update(user.id, {
          team: await xata.db.teams
            .filter("name", userDetailsEdit.team)
            .getFirst(),
          teamVerified: false,
          graduationYear: userDetailsEdit.graduationYear,
        });
        res.status(202).end();
      },
    );
  }

  res.status(405).end();
}
