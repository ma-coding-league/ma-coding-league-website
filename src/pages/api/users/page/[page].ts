import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { USER_PAGE_SIZE } from "@/pages/api/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();

  await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
    let page = 0;
    try {
      page = parseInt(req.query.page![0]);
      if (page < 0) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error("Invalid page number");
      }
    } catch (e) {
      res.status(400).end();
    }

    const users = await xata.db.nextauth_users.getPaginated({
      pagination: {
        size: USER_PAGE_SIZE,
        offset: USER_PAGE_SIZE * page,
      },
    });
    res.status(200).json(users.records);
  });
}
