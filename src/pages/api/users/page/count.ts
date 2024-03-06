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
    const recordsCount = await xata.db.nextauth_users.aggregate({
      totalCount: {
        count: "*",
      },
    });
    return res
      .status(200)
      .json(Math.ceil(recordsCount.aggs.totalCount / USER_PAGE_SIZE));
  });
}
