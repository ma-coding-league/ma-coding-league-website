import { ServerSideCompetition } from "@/scripts/API/Competitions/ServerSide";
import { XataClient } from "@/xata";

export async function getCompetitionsAsServer(
  xata: XataClient,
  year?: string | null | undefined,
): Promise<ServerSideCompetition[]> {
  let dbComps;
  if (year !== null && year !== undefined) {
    dbComps = await xata.db.competitions.filter("yearRange", year).getAll();
  } else {
    dbComps = await xata.db.competitions.getAll();
  }

  return dbComps.map((dbComp) => {
    return <ServerSideCompetition>{
      id: dbComp.id,
      name: dbComp.name,
      location: dbComp.location,
      start: dbComp.start,
      end: dbComp.end,
      yearRange: dbComp.yearRange,
      theme: dbComp.theme,
      showThis: dbComp.showThis,
      showTheme: dbComp.showTheme,
      showSubmissions: dbComp.showSubmissions,
      showResults: dbComp.showResults,
      submissions: dbComp.submissions.map((dbSub: any) => {
        return {
          team: dbSub.team,
          submissionURL: dbSub.submissionURL,
          scoreNumerator: dbSub.scoreNumerator,
          scoreDenominator: dbSub.scoreDenominator,
        };
      }),
    };
  });
}

export async function getCompetitionsAsUser(
  xata: XataClient,
  year?: string | null | undefined,
): Promise<ServerSideCompetition[]> {
  let dbComps;
  if (year !== null && year !== undefined) {
    dbComps = await xata.db.competitions.filter("yearRange", year).getAll();
  } else {
    dbComps = await xata.db.competitions.getAll();
  }

  return dbComps
    .filter((dbComp) => {
      return dbComp.showThis;
    })
    .map((dbComp) => {
      return <ServerSideCompetition>{
        id: dbComp.id,
        name: dbComp.name,
        location: dbComp.location,
        start: dbComp.start,
        end: dbComp.end,
        yearRange: dbComp.yearRange,
        theme: dbComp.showTheme ? dbComp.theme : null,
        showThis: dbComp.showThis,
        showTheme: dbComp.showTheme,
        showSubmissions: dbComp.showSubmissions,
        showResults: dbComp.showResults,
        submissions: dbComp.showSubmissions
          ? dbComp.submissions.map((dbSub: any) => {
              return {
                team: dbSub.team,
                submissionURL: dbSub.submissionURL,
                scoreNumerator: dbComp.showResults
                  ? dbSub.scoreNumerator
                  : null,
                scoreDenominator: dbComp.showResults
                  ? dbSub.scoreDenominator
                  : null,
              };
            })
          : null,
      };
    });
}

export async function getCompetitionYearsAsServer(
  xata: XataClient,
): Promise<string[]> {
  const dbComps = await xata.db.competitions
    .sort("yearRange", "desc")
    .select(["yearRange"])
    .getAll();
  const years = dbComps.map((dbComp) => {
    return dbComp.yearRange;
  });
  return Array.from(new Set(years)) as string[];
}

export async function getCompetitionYearsAsUser(
  xata: XataClient,
): Promise<string[]> {
  const dbComps = await xata.db.competitions
    .sort("yearRange", "desc")
    .select(["yearRange", "showThis"])
    .getAll();
  const years = dbComps
    .filter((dbComp) => {
      return dbComp.showThis;
    })
    .map((dbComp) => {
      return dbComp.yearRange;
    });
  return Array.from(new Set(years)) as string[];
}

export async function getCompetitionNamesAsServer(
  xata: XataClient,
  year?: string | null | undefined,
): Promise<string[]> {
  let dbComps;
  if (year !== null && year !== undefined) {
    dbComps = await xata.db.competitions
      .select(["name", "yearRange"])
      .filter("yearRange", year)
      .getAll();
  } else {
    dbComps = await xata.db.competitions.select(["name"]).getAll();
  }

  return dbComps.map((dbComp) => {
    return dbComp.name;
  }) as string[];
}

export async function getCompetitionNamesAsUser(
  xata: XataClient,
  year?: string | null | undefined,
): Promise<string[]> {
  let dbComps;
  if (year !== null && year !== undefined) {
    dbComps = await xata.db.competitions
      .select(["name", "yearRange", "showThis"])
      .filter("yearRange", year)
      .getAll();
  } else {
    dbComps = await xata.db.competitions.select(["name", "showThis"]).getAll();
  }

  return dbComps
    .filter((dbComp) => {
      return dbComp.showThis;
    })
    .map((dbComp) => {
      return dbComp.name;
    }) as string[];
}

export async function getCompetitionByNameAsServer(
  xata: XataClient,
  name: string,
): Promise<ServerSideCompetition | null> {
  const dbComp = await xata.db.competitions.filter("name", name).getFirst();

  if (dbComp == null) {
    return null;
  } else {
    return <ServerSideCompetition>{
      id: dbComp.id,
      name: dbComp.name,
      location: dbComp.location,
      start: dbComp.start,
      end: dbComp.end,
      yearRange: dbComp.yearRange,
      theme: dbComp.theme,
      showThis: dbComp.showThis,
      showTheme: dbComp.showTheme,
      showSubmissions: dbComp.showSubmissions,
      showResults: dbComp.showResults,
      submissions: dbComp.submissions.map((dbSub: any) => {
        return {
          team: dbSub.team,
          submissionURL: dbSub.submissionURL,
          scoreNumerator: dbSub.scoreNumerator,
          scoreDenominator: dbSub.scoreDenominator,
        };
      }),
    };
  }
}

export async function getCompetitionByNameAsUser(
  xata: XataClient,
  name: string,
): Promise<ServerSideCompetition | null> {
  const dbComp = await xata.db.competitions
    .filter("showThis", true)
    .filter("name", name)
    .getFirst();

  if (dbComp == null) {
    return null;
  } else {
    return <ServerSideCompetition>{
      id: dbComp.id,
      name: dbComp.name,
      location: dbComp.location,
      start: dbComp.start,
      end: dbComp.end,
      yearRange: dbComp.yearRange,
      theme: dbComp.theme,
      showThis: dbComp.showThis,
      showTheme: dbComp.showTheme,
      showSubmissions: dbComp.showSubmissions,
      showResults: dbComp.showResults,
      submissions: dbComp.submissions.map((dbSub: any) => {
        return {
          team: dbSub.team,
          submissionURL: dbSub.submissionURL,
          scoreNumerator: dbSub.scoreNumerator,
          scoreDenominator: dbSub.scoreDenominator,
        };
      }),
    };
  }
}
