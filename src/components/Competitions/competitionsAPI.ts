export type UserSideSubmission = {
  team: string;
  submissionURL?: string | null;
  scoreNumerator?: number | null;
  scoreDenominator?: number | null;
};

export type UserSideCompetition = {
  id: string;
  name: string;
  location?: string | null;
  start?: Date | null;
  end?: Date | null;
  theme?: string | null;
  showThis: boolean;
  showTheme: boolean;
  showSubmissions: boolean;
  showResults: boolean;
  submissions?: UserSideSubmission[] | null;
};

export type ServerSideSubmission = {
  team: string;
  submissionURL: string | null;
  scoreNumerator: number | null;
  scoreDenominator: number;
};

export type ServerSideCompetition = {
  id: string;
  name: string;
  location: string | null;
  start: Date | null;
  end: Date | null;
  theme: string | null;
  showThis: boolean;
  showTheme: boolean;
  showSubmissions: boolean;
  showResults: boolean;
  submissions: ServerSideSubmission[];
};

export function serializeCompetition(
  comp: ServerSideCompetition | UserSideCompetition,
): string {
  return JSON.stringify({
    id: comp.id,
    name: comp.name,
    location: comp.location,
    start: comp.start,
    end: comp.end,
    theme: comp.theme,
    showThis: comp.showThis,
    showTheme: comp.showTheme,
    showSubmissions: comp.showSubmissions,
    showResults: comp.showResults,
    submission: comp.submissions,
  });
}

export function deserializeCompetition(
  comp: string,
): ServerSideCompetition | UserSideCompetition {
  const compObject = JSON.parse(comp);
  return <UserSideCompetition>{
    id: compObject.id,
    name: compObject.name,
    location: compObject.location,
    start: compObject.start,
    end: compObject.end,
    theme: compObject.theme,
    showThis: compObject.showThis,
    showTheme: compObject.showTheme,
    showSubmissions: compObject.showSubmissions,
    showResults: compObject.showResults,
    submissions: compObject.submissions,
  };
}

export async function getUserSideCompetitionsFromAPI(): Promise<
  UserSideCompetition[]
> {
  const response = await fetch("/api/competitions");

  return (await response.json()).map((team: any) => {
    return <UserSideCompetition>{
      id: team.id,
      name: team.name,
      location: team.location,
      start: team.start != null ? new Date(team.start) : null,
      end: team.end != null ? new Date(team.end) : null,
      theme: team.theme,
      showThis: team.showThis,
      showTheme: team.showTheme,
      showSubmissions: team.showSubmissions,
      showResults: team.showResults,
      submissions: team.submissions,
    };
  });
}

export async function getServerSideCompetitionsFromAPI(): Promise<
  ServerSideCompetition[]
> {
  const response = await fetch("/api/competitions");

  return (await response.json()).map((team: any) => {
    return <ServerSideCompetition>{
      id: team.id,
      name: team.name,
      location: team.location,
      start: team.start != null ? new Date(team.start) : null,
      end: team.end != null ? new Date(team.end) : null,
      theme: team.theme,
      showThis: team.showThis,
      showTheme: team.showTheme,
      showSubmissions: team.showSubmissions,
      showResults: team.showResults,
      submissions: team.submissions,
    };
  });
}
