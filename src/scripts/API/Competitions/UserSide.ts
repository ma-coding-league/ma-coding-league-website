import { fixUserSideCompetitionJSONResponse } from "@/scripts/API/Competitions/helpers";
import { UserSideSubmission } from "@/scripts/API/Submissions/UserSide";

export type UserSideCompetition = {
  id: string;
  name: string;
  location?: string | null;
  start?: Date | null;
  end?: Date | null;
  yearRange: string;
  theme?: string | null;
  showThis: boolean;
  showTheme: boolean;
  showSubmissions: boolean;
  showResults: boolean;
  submissions?: UserSideSubmission[] | null;
};

export function serializeUserCompetition(comp: UserSideCompetition): string {
  return JSON.stringify({
    id: comp.id,
    name: comp.name,
    location: comp.location,
    start: comp.start,
    end: comp.end,
    yearRange: comp.yearRange,
    theme: comp.theme,
    showThis: comp.showThis,
    showTheme: comp.showTheme,
    showSubmissions: comp.showSubmissions,
    showResults: comp.showResults,
    submission: comp.submissions,
  });
}

export function deserializeUserCompetition(comp: string): UserSideCompetition {
  const compObject = JSON.parse(comp);
  return fixUserSideCompetitionJSONResponse(compObject);
}

export async function getUserSideCompetitionsFromAPI(
  year: string | null = null,
): Promise<UserSideCompetition[]> {
  const response = await fetch(
    `/api/competitions${year != null ? `?year=${year}` : ""}`,
  );

  return (await response.json()).map((comp: any) => {
    return fixUserSideCompetitionJSONResponse(comp);
  });
}

export async function getUserSideCompetitionYearsFromAPI(): Promise<string[]> {
  const response = await fetch("/api/competitions/years");
  return await response.json();
}

export async function getUserSideCompetitionNamesFromAPI(
  year?: string | null,
): Promise<string[]> {
  const response = await fetch(
    `/api/competitions/names${year !== null ? `?year=${year}` : ""}`,
  );
  return await response.json();
}

export async function getUserSideCompetitionByNameFromAPI(
  name: string,
): Promise<UserSideCompetition | null> {
  const response = await fetch(`/api/competitions?name=${name}`);
  return fixUserSideCompetitionJSONResponse(await response.json());
}
