import { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import {
  getCompetitionNamesAsServer,
  getCompetitionNamesAsUser,
} from "@/database/competitions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  let year: null | string = null;
  if (req.query.year !== undefined) {
    year = req.query.year as string;
  }

  await authorizeToRunCallback(
    req,
    res,
    xata,
    "admin", //
    async (_) => {
      res.status(200).json(await getCompetitionNamesAsServer(xata, year));
    }, //
    async (_) => {
      res.status(200).json(await getCompetitionNamesAsUser(xata, year));
    }, //
    async () => {
      res.status(200).json(await getCompetitionNamesAsUser(xata, year));
    },
  );
}
