import { ServerSideCompetition } from "@/scripts/API/Competitions/ServerSide";
import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";

export function fixServerSideCompetitionJSONResponse(
  comp: any,
): ServerSideCompetition {
  comp.start = comp.start != null ? new Date(comp.start) : null;
  comp.end = comp.end != null ? new Date(comp.end) : null;
  return comp;
}

export function fixUserSideCompetitionJSONResponse(
  comp: any,
): UserSideCompetition {
  comp.start = comp.start != null ? new Date(comp.start) : null;
  comp.end = comp.end != null ? new Date(comp.end) : null;
  return comp;
}
