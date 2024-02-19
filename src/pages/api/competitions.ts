import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeServerCompetition } from "@/scripts/API/Competitions/ServerSide";
import {
  getCompetitionsAsServer,
  getCompetitionsAsUser,
  getCompetitionYearsAsServer,
  getCompetitionYearsAsUser,
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
    if (req.query.year != null) {
      year = req.query.year as string;
    }
    const yearsOnly = req.query.yearsOnly != null;
    if (yearsOnly) {
      await authorizeToRunCallback(
        req,
        res,
        xata,
        "admin", //
        async (_) => {
          res.status(200).json(await getCompetitionYearsAsServer(xata));
        }, //
        async (_) => {
          res.status(200).json(await getCompetitionYearsAsUser(xata));
        }, //
        async () => {
          res.status(200).json(await getCompetitionYearsAsUser(xata));
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
