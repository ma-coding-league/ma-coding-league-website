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
  return <ServerSideCompetition>{
    id: compObject.id,
    name: compObject.name,
    location: compObject.location,
    start: compObject.start,
    end: compObject.end,
    yearRange: compObject.yearRange,
    theme: compObject.theme,
    showThis: compObject.showThis,
    showTheme: compObject.showTheme,
    showSubmissions: compObject.showSubmissions,
    showResults: compObject.showResults,
    submissions: compObject.submissions,
  };
}

export async function getServerSideCompetitionsFromAPI(): Promise<
  ServerSideCompetition[]
> {
  const response = await fetch("/api/competitions");

  return (await response.json()).map((comp: any) => {
    return <ServerSideCompetition>{
      id: comp.id,
      name: comp.name,
      location: comp.location,
      start: comp.start != null ? new Date(comp.start) : null,
      end: comp.end != null ? new Date(comp.end) : null,
      yearRange: comp.yearRange,
      theme: comp.theme,
      showThis: comp.showThis,
      showTheme: comp.showTheme,
      showSubmissions: comp.showSubmissions,
      showResults: comp.showResults,
      submissions: comp.submissions,
    };
  });
}

export async function getServerSideCompetitionYearsFromAPI(): Promise<
  string[]
> {
  const response = await fetch("/api/competitions?yearsOnly");
  return await response.json();
}
