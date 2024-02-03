import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { getServerSessionAndCheckForRole } from "@/scripts/Utils/Auth/Authorization";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    const [session, _, error] = await getServerSessionAndCheckForRole(
      req,
      res,
      xata,
      "admin",
    );
    if (session) {
      res.status(200).send(req.body);
    } else if (error === "unauthorized") {
      res.status(403).end();
    } else if (error === "unauthenticated") {
      res.status(401).end();
    } else {
      res.status(500).end();
    }
  } else {
    const alerts = await xata.db.alerts.getAll();
    res.status(200).json(alerts);
  }
}
