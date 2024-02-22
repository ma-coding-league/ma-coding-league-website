import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeServerCompetition } from "@/scripts/API/Competitions/ServerSide";
import {
  getCompetitionByNameAsServer,
  getCompetitionByNameAsUser,
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
      const compEdit = deserializeServerCompetition(req.body);
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
    let year: null | string = null;
    let name: null | string = null;
    if (req.query.name !== undefined) {
      name = req.query.name as string;
    }
    if (req.query.year !== undefined) {
      year = req.query.year as string;
    }
    if (name !== null) {
      await authorizeToRunCallback(
        req,
        res,
        xata,
        "admin", //
        async (_) => {
          res.status(200).json(await getCompetitionByNameAsServer(xata, name!));
        }, //
        async (_) => {
          res.status(200).json(await getCompetitionByNameAsUser(xata, name!));
        }, //
        async () => {
          res.status(200).json(await getCompetitionByNameAsUser(xata, name!));
        },
      );
    } else {
      await authorizeToRunCallback(
        req,
        res,
        xata,
        "admin", //
        async (_) => {
          res.status(200).json(await getCompetitionsAsServer(xata, year));
        }, //
        async (_) => {
          res.status(200).json(await getCompetitionsAsUser(xata, year));
        }, //
        async () => {
          res.status(200).json(await getCompetitionsAsUser(xata, year));
        },
      );
    }
  }
}
