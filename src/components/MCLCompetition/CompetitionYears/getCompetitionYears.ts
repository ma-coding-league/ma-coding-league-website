import PublicGoogleSheetsParser from "public-google-sheets-parser";

export type MCLCompetitionsYear = {
  yearStart: number;
  yearEnd: number;
  yearFull: string;
  hide: boolean;
  competitionGSheetID: string;
};

export default function getCompetitionYears(
  compYearsGSheetID: string,
): Promise<MCLCompetitionsYear[]> {
  return new Promise((resolve, reject) => {
    console.log("Getting competition years");
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse(compYearsGSheetID, "Years")
      .then((data) => {
        const years: MCLCompetitionsYear[] = data.map((year) => {
          const yearNum = year["Year"];
          const url: string = year["Competition spreadsheet"];
          const secondHalf = url.replaceAll(
            "https://docs.google.com/spreadsheets/d/",
            "",
          );
          const competitionGSheetID = secondHalf.split("/")[0];
          return {
            yearStart: parseInt(yearNum.split("-")[0]),
            yearEnd: parseInt(yearNum.split("-")[1]),
            yearFull: yearNum,
            hide: year["Hide on website"],
            competitionGSheetID,
          };
        });
        console.log(`Got ${years.length} competition years`);
        resolve(years);
      })
      .catch((err) => {
        console.error("Error getting competition years");
        reject(err);
      });
  });
}
