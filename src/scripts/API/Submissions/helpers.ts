import { ServerSideSubmission } from "@/scripts/API/Submissions/ServerSide";
import { UserSideSubmission } from "@/scripts/API/Submissions/UserSide";

export function fixServerSideSubmissionJSONResponse(
  sub: any,
): ServerSideSubmission {
  return sub;
}

export function fixUserSideSubmissionJSONResponse(
  sub: any,
): UserSideSubmission {
  return sub;
}
