import { XataClient } from "@/xata";
import { ServerSideSubmission } from "@/scripts/API/Submissions/ServerSide";
import {
  fixServerSideSubmissionJSONResponse,
  fixUserSideSubmissionJSONResponse,
} from "@/scripts/API/Submissions/helpers";
import { getCompetitionByNameAsServer } from "@/database/competitions";
import { UserSideSubmission } from "@/scripts/API/Submissions/UserSide";

export async function getSubmissionsAsServer(
  xata: XataClient,
  name: string,
): Promise<ServerSideSubmission[] | null> {
  const comp = await getCompetitionByNameAsServer(xata, name);
  if (comp === null) {
    return null;
  }

  return comp.submissions.map((sub: any) => {
    return fixServerSideSubmissionJSONResponse(sub);
  });
}

export async function getSubmissionsAsUser(
  xata: XataClient,
  name: string,
): Promise<UserSideSubmission[] | null> {
  const comp = await getCompetitionByNameAsServer(xata, name);
  if (comp === null || !comp.showSubmissions) {
    return null;
  }

  return comp.submissions.map((sub: any) => {
    return fixUserSideSubmissionJSONResponse({
      team: sub.team,
      submissionURL: sub.submissionURL,
      scoreNumerator: comp.showResults ? sub.scoreNumerator : null,
      scoreDenominator: comp.showResults ? sub.scoreDenominator : null,
    });
  });
}
