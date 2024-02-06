import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      // @ts-ignore
      await xata.db.alerts.create({
        enable: true,
        start: new Date(),
        end: new Date(),
        type: "primary",
        canHide: true,
        content: "This is a test alert.",
        links: null,
      });
      res.status(201).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      await xata.db.alerts.delete(req.body);
      res.status(200).end();
    });
  } else {
    const alerts = await xata.db.alerts.getAll();
    res.status(200).json(alerts);
  }
}
