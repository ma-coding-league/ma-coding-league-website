import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";
import { fixServerSideCompetitionJSONResponse } from "@/scripts/API/Competitions/helpers";
import { ServerSideSubmission } from "@/scripts/API/Submissions/ServerSide";

export type ServerSideCompetition = {
  id: string;
  name: string;
  location: string | null;
  start: Date | null;
  end: Date | null;
  yearRange: string;
  theme: string | null;
  showThis: boolean;
  showTheme: boolean;
  showSubmissions: boolean;
  showResults: boolean;
  submissions: ServerSideSubmission[];
};

export function serializeServerCompetition(
  comp: ServerSideCompetition,
): string {
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

export function deserializeServerCompetition(
  comp: string,
): ServerSideCompetition {
  const compObject = JSON.parse(comp);
  return fixServerSideCompetitionJSONResponse(compObject);
}

export async function getServerSideCompetitionsFromAPI(): Promise<
  ServerSideCompetition[]
> {
  const response = await fetch("/api/competitions");

  return (await response.json()).map((comp: any) => {
    return fixServerSideCompetitionJSONResponse(comp);
  });
}

export async function getServerSideCompetitionYearsFromAPI(): Promise<
  string[]
> {
  const response = await fetch("/api/competitions/years");
  return await response.json();
}

export async function getServerSideCompetitionNamesFromAPI(
  year?: string | null,
): Promise<string[]> {
  const response = await fetch(
    `/api/competitions/names${year !== null ? `?year=${year}` : ""}`,
  );
  return await response.json();
}

export async function getServerSideCompetitionByNameFromAPI(
  name: string,
): Promise<UserSideCompetition | null> {
  const response = await fetch(`/api/competitions?name=${name}`);
  return fixServerSideCompetitionJSONResponse(await response.json());
}
