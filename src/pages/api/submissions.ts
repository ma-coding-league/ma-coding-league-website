import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "@/xata";
import { authorizeToRunCallback } from "@/scripts/Utils/Auth/Authorization";
import { getCompetitionByNameAsServer } from "@/database/competitions";
import {
  deserializeServerSubmission,
  ServerSideSubmission,
} from "@/scripts/API/Submissions/ServerSide";
import {
  getSubmissionsAsServer,
  getSubmissionsAsUser,
} from "@/database/submissions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const xata = getXataClient();
  let name: null | string = null;
  let team: null | string = null;
  if (req.query.name !== undefined) {
    name = req.query.name as string;
  } else {
    res.status(400).end();
    return;
  }
  if (req.query.team !== undefined) {
    team = req.query.team as string;
  }

  const oldComp = await getCompetitionByNameAsServer(xata, name);
  if (oldComp === null) {
    res.status(404).end();
    return;
  }

  if (req.method === "POST") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      // @ts-ignore
      await xata.db.competitions.update(oldComp.id, {
        submissions: [
          ...oldComp.submissions,
          <ServerSideSubmission>{
            team: `New team ${new Date().toISOString()}`,
            submissionURL: null,
            scoreNumerator: null,
            scoreDenominator: 100,
          },
        ],
      });
      res.status(201).end();
    });
  } else if (req.method === "PUT") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      if (team === null) {
        res.status(400).end();
        return;
      }
      const subEdit = deserializeServerSubmission(req.body);
      // @ts-ignore
      await xata.db.competitions.update(oldComp.id, {
        submissions: oldComp.submissions.map((sub) => {
          if (sub.team === team) {
            return subEdit;
          } else {
            return sub;
          }
        }),
      });
      res.status(200).end();
    });
  } else if (req.method === "DELETE") {
    await authorizeToRunCallback(req, res, xata, "admin", async (_) => {
      if (team === null) {
        res.status(400).end();
        return;
      }
      // @ts-ignore
      await xata.db.competitions.update(oldComp.id, {
        submissions: oldComp.submissions.filter((sub) => {
          return sub.team !== team;
        }),
      });
      res.status(200).end();
    });
  } else {
    await authorizeToRunCallback(
      req,
      res,
      xata,
      "admin", //
      async (_) => {
        res.status(200).json(await getSubmissionsAsServer(xata, name!));
      }, //
      async (_) => {
        res.status(200).json(await getSubmissionsAsUser(xata, name!));
      }, //
      async () => {
        res.status(200).json(await getSubmissionsAsUser(xata, name!));
      },
    );
  }
}
