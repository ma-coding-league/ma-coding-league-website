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
};

export default function getCompetitionWithResult(
  compsGSheetID: string,
  compName: string,
): Promise<MCLCompetitionWithResult> {
  return new Promise((resolve, reject) => {
    console.log("Getting competition");
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse(compsGSheetID, "Competitions")
      .then((data) => {
        const comp = data.find((comp) => {
          return comp["Name"] === compName;
        });
        console.log("COMP", comp);
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
        const competition = {
          name: comp["Name"],
          place: comp["Place"],
          date: date.toISOString(),
          startingTime: startTime.toISOString(),
          endingTime: endTime.toISOString(),
          hideThisOnWebsite: comp["Hide this on website"] ?? false,
          showResultOnWebsite: comp["Show result on website"] ?? false,
          theme: comp["Theme"],
        };
        console.log(`Got competition ${compName}`);
        resolve(competition);
      })
      .catch((err) => {
        console.error("Error getting competition");
        reject(err);
      });
  });
}
