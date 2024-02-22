import { fixUserSideSubmissionJSONResponse } from "@/scripts/API/Submissions/helpers";

export type UserSideSubmission = {
  team: string;
  submissionURL?: string | null;
  scoreNumerator?: number | null;
  scoreDenominator?: number | null;
};

export function serializeUserSubmission(sub: UserSideSubmission): string {
  return JSON.stringify({
    team: sub.team,
    submissionURL: sub.submissionURL,
    scoreNumerator: sub.scoreNumerator,
    scoreDenominator: sub.scoreDenominator,
  });
}

export function deserializeUserSubmission(sub: string): UserSideSubmission {
  const subObj = JSON.parse(sub);
  return fixUserSideSubmissionJSONResponse(subObj);
}

export async function getUserSideSubmissionFromAPI(
  name: string,
): Promise<UserSideSubmission[]> {
  const response = await fetch(`/api/submissions?name=${name}`);

  return (await response.json()).map((comp: any) => {
    return fixUserSideSubmissionJSONResponse(comp);
  });
}
