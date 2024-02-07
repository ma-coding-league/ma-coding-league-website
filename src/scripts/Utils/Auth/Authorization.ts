import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UsersRecord, XataClient } from "@/xata";
import { splitRoles } from "@/database/users/roles";
import {
  SelectableColumnWithObjectNotation,
  SelectedPick,
} from "@xata.io/client";

export async function getServerSessionAndCheckForRole(
  req: NextApiRequest,
  res: NextApiResponse,
  dbClient: XataClient,
  role: string,
): Promise<
  [
    Session | null,
    SelectedPick<
      UsersRecord,
      SelectableColumnWithObjectNotation<UsersRecord, []>[]
    > | null,
    "unauthenticated" | "unauthorized" | null,
  ]
> {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const user = await dbClient.db.users.read(session.user.id);
    if (user != null && splitRoles(user.roles).includes(role)) {
      return [session, user, null];
    } else {
      return [null, null, "unauthorized"];
    }
  } else {
    return [null, null, "unauthenticated"];
  }
}

export async function authorizeToRunCallback(
  req: NextApiRequest,
  res: NextApiResponse,
  dbClient: XataClient,
  role: string,
  runIfAuthenticated: (session: Session) => Promise<void>,
) {
  const [session, _, error] = await getServerSessionAndCheckForRole(
    req,
    res,
    dbClient,
    role,
  );
  if (session) {
    try {
      await runIfAuthenticated(session);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  } else if (error === "unauthorized") {
    res.status(403).end();
  } else if (error === "unauthenticated") {
    res.status(401).end();
  } else {
    res.status(500).end();
  }
}
