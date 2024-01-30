import PublicGoogleSheetsParser from "public-google-sheets-parser";
import GSDateToJSDate from "@/scripts/Utils/GSheetDateToJSDate";

export type MCLCompetition = {
  name: string;
  place: string;
  date: string;
  startingTime: string;
  endingTime: string;
  hideThisOnWebsite: boolean;
  showSubmissionURLOnWebsite: boolean;
  showResultOnWebsite: boolean;
  theme: string;
  submissionURL: string;
};

export default function getCompetitions(
  compsGSheetID: string,
): Promise<MCLCompetition[]> {
  return new Promise((resolve, reject) => {
    console.log("Getting competitions");
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse(compsGSheetID, "Competitions")
      .then((data) => {
        const competitions: MCLCompetition[] = data.map((comp) => {
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
          return {
            name: comp["Name"],
            place: comp["Place"],
            date: date.toISOString(),
            startingTime: startTime.toISOString(),
            endingTime: endTime.toISOString(),
            hideThisOnWebsite: comp["Hide this on website"] ?? false,
            showSubmissionURLOnWebsite:
              comp["Show submission URL on website"] ?? false,
            showResultOnWebsite: comp["Show result on website"] ?? false,
            theme: comp["Theme"],
            submissionURL: comp["Submission URL"] ?? null,
          };
        });
        console.log(`Got ${competitions.length} competitions`);
        resolve(competitions);
      })
      .catch((err) => {
        console.error("Error getting competitions");
        reject(err);
      });
  });
}
