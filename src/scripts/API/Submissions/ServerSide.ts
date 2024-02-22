import { fixServerSideCompetitionJSONResponse } from "@/scripts/API/Competitions/helpers";
import { fixServerSideSubmissionJSONResponse } from "@/scripts/API/Submissions/helpers";

export type ServerSideSubmission = {
  team: string;
  submissionURL: string | null;
  scoreNumerator: number | null;
  scoreDenominator: number;
  passcode: number;
};

export function serializeServerSubmission(sub: ServerSideSubmission): string {
  return JSON.stringify({
    team: sub.team,
    submissionURL: sub.submissionURL,
    scoreNumerator: sub.scoreNumerator,
    scoreDenominator: sub.scoreDenominator,
    passcode: sub.passcode,
  });
}

export function deserializeServerSubmission(sub: string): ServerSideSubmission {
  const subObj = JSON.parse(sub);
  return fixServerSideSubmissionJSONResponse(subObj);
}

export async function getServerSideSubmissionsFromAPI(
  name: string,
): Promise<ServerSideSubmission[]> {
  const response = await fetch(`/api/submissions?name=${name}`);

  return (await response.json()).map((comp: any) => {
    return fixServerSideCompetitionJSONResponse(comp);
  });
}
