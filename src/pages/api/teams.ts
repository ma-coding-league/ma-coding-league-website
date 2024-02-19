import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeTeam } from "@/scripts/API/Teams";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      // @ts-ignore
      await xata.db.teams.create({
        name: `New team ${new Date().toISOString()}`,
      });
      res.status(201).end();
    });
  } else if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      const teamEdit = deserializeTeam(req.body);
      // @ts-ignore
      await xata.db.teams.update(teamEdit.id, teamEdit);
      res.status(200).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      await xata.db.teams.delete(req.body);
      res.status(200).end();
    });
  } else {
    const alerts = await xata.db.teams.getAll();
    res.status(200).json(alerts);
  }
}
