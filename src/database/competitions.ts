import { ServerSideCompetition } from "@/components/Competitions/competitionsAPI";
import { XataClient } from "@/xata";

export async function getCompetitionsAsServer(
  xata: XataClient,
): Promise<ServerSideCompetition[]> {
  const dbComps = await xata.db.competitions.getAll();

  return dbComps.map((dbComp) => {
    return <ServerSideCompetition>{
      id: dbComp.id,
      name: dbComp.name,
      location: dbComp.location,
      start: dbComp.start,
      end: dbComp.end,
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
): Promise<ServerSideCompetition[]> {
  const dbComps = await xata.db.competitions.getAll();

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
