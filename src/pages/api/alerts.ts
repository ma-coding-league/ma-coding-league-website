import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeWebsiteAlert } from "@/scripts/API/WebsiteAlerts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      // @ts-ignore
      await xata.db.alerts.create({
        enable: false,
        start: new Date(),
        end: new Date(),
        type: "primary",
        canHide: true,
        content: "This is a test alert.",
        links: [],
      });
      res.status(201).end();
    });
  } else if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      const newAlert = deserializeWebsiteAlert(req.body);
      // @ts-ignore
      await xata.db.alerts.update(newAlert.id, newAlert);
      res.status(200).end();
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
