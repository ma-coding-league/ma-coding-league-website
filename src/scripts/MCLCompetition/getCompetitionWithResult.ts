import PublicGoogleSheetsParser from "public-google-sheets-parser";
import GSDateToJSDate from "@/scripts/Utils/GSheetDateToJSDate";

export type MCLCompetitionWithResult = {
  name: string;
  place: string;
  date: string;
  startingTime: string;
  endingTime: string;
  hideThisOnWebsite: boolean;
  showResultOnWebsite: boolean;
  theme: string;
  result: MCLCompetitionResult;
};

export type MCLCompetitionResult = {
  team: string;
  submissionURL: string;
  score: string;
}[];

export default function getCompetitionWithResult(
  compsGSheetID: string,
  compName: string,
): Promise<MCLCompetitionWithResult> {
  let competition: MCLCompetitionWithResult;

  return new Promise((resolve, reject) => {
    console.log("Getting competition with result");
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse(compsGSheetID, "Competitions")
      .then((data) => {
        const comp = data.find((comp) => {
          return comp["Name"] === compName;
        });
        const date = GSDateToJSDate(comp["Date"]);
        const startTime = GSDateToJSDate(comp["Starting time"]);
        startTime.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        const endTime = GSDateToJSDate(comp["Ending time"]);
        endTime.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        competition = {
          name: comp["Name"],
          place: comp["Place"],
          date: date.toISOString(),
          startingTime: startTime.toISOString(),
          endingTime: endTime.toISOString(),
          hideThisOnWebsite: comp["Hide this on website"] ?? false,
          showResultOnWebsite: comp["Show result on website"] ?? false,
          theme: comp["Theme"],
          result: [],
        };
        return parser.parse(compsGSheetID, `${compName} result`);
      })
      .then((data) => {
        const scoreToDecimal = (score: string) => {
          const scoreSplit = score.split("/");
          return parseInt(scoreSplit[0]) / parseInt(scoreSplit[1]);
        };
        competition.result = data
          .map((submission) => {
            return {
              team: submission["Team"] ?? null,
              submissionURL: submission["Submission URL"] ?? null,
              score: submission["Score"] ?? "0/0",
            };
          })
          .sort((a, b) => {
            return scoreToDecimal(b.score) - scoreToDecimal(a.score);
          });
        console.log(`Got competition ${compName} with result`);
        resolve(competition);
      })
      .catch((err) => {
        console.error("Error getting competition with result");
        reject(err);
      });
  });
}
