import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { deserializeOfficer } from "@/scripts/API/Officers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      // @ts-ignore
      await xata.db.officers.create({
        role: `New role ${new Date().toISOString()}`,
        description: "New role description",
        personName: null,
        personSchool: null,
        openForApplication: false,
      });
      res.status(201).end();
    });
  } else if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      const officerEdit = deserializeOfficer(req.body);
      // @ts-ignore
      await xata.db.officers.update(officerEdit.id, officerEdit);
      res.status(200).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "tech lead", async (_) => {
      await xata.db.officers.delete(req.body);
      res.status(200).end();
    });
  } else {
    const officers = await xata.db.officers.getAll();
    res.status(200).json(officers);
  }
}
