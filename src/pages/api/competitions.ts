import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeCompetition } from "@/components/Competitions/competitionsAPI";
import {
  getCompetitionsAsServer,
  getCompetitionsAsUser,
} from "@/database/competitions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      // @ts-ignore
      await xata.db.competitions.create({
        name: `New competition ${new Date().toISOString()}`,
      });
      res.status(201).end();
    });
  } else if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      const compEdit = deserializeCompetition(req.body);
      // @ts-ignore
      await xata.db.competitions.update(compEdit.id, compEdit);
      res.status(200).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      await xata.db.competitions.delete(req.body);
      res.status(200).end();
    });
  } else {
    await authorizeToRunCallback(
      req,
      res,
      xata,
      "admin", //
      async (_) => {
        res.status(200).json(await getCompetitionsAsServer(xata));
      }, //
      async (_) => {
        res.status(200).json(await getCompetitionsAsUser(xata));
      },
    );
  }
}
