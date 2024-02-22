import { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import {
  getCompetitionYearsAsServer,
  getCompetitionYearsAsUser,
} from "@/database/competitions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

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
}
