import PublicGoogleSheetsParser from "public-google-sheets-parser";

export type BootstrapAlertType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

export type WebsiteAlertLink = {
  name: string;
  type: BootstrapAlertType;
  url: string;
};

export type WebsiteAlert = {
  enable: boolean;
  show: Date;
  end: Date;
  type: BootstrapAlertType;
  canHide: boolean;
  links: WebsiteAlertLink[];
  content: string;
};

function convertStringDateToJSDate(date: string): Date {
  const numString = date.replace("Date(", "").replace(")", "");
  const numArray = numString.split(",");
  if (numArray.length === 3) {
    return new Date(
      parseInt(numArray[0]),
      parseInt(numArray[1]),
      parseInt(numArray[2]),
    );
  } else if (numArray.length === 6) {
    return new Date(
      parseInt(numArray[0]),
      parseInt(numArray[1]),
      parseInt(numArray[2]),
      parseInt(numArray[3]),
      parseInt(numArray[4]),
      parseInt(numArray[5]),
    );
  } else {
    throw new Error("Invalid date format");
  }
}

export default function getWebsiteAlerts(
  resGSheetID: string,
): Promise<WebsiteAlert[]> {
  return new Promise((resolve, reject) => {
    console.log("Fetching alerts");
    const parser = new PublicGoogleSheetsParser();
    parser
      .parse(resGSheetID, "Alerts")
      .then((data) => {
        const alerts = [];
        for (const row of data) {
          alerts.push(<WebsiteAlert>{
            enable: row["Enable"] ?? false,
            show:
              convertStringDateToJSDate(row["Show"]) ??
              new Date(-8640000000000000),
            end:
              convertStringDateToJSDate(row["End"]) ??
              new Date(8640000000000000),
            type: row["Type"] ?? "secondary",
            canHide: row["Can hide"] ?? false,
            links: (() => {
              try {
                return row["Links"].split("\n").map((link: string) => {
                  const linkParts = link.split(" :: ");
                  if (linkParts.length === 2) {
                    return {
                      name: linkParts[0],
                      type: "secondary",
                      url: linkParts[1],
                    };
                  } else {
                    return {
                      name: linkParts[0],
                      type: linkParts[1] as BootstrapAlertType,
                      url: linkParts[2],
                    };
                  }
                });
              } catch {
                return [];
              }
            })(),
            content: row["Content"] ?? "",
          });
        }

        console.log(`Successfully fetched ${alerts.length} alerts`);
        resolve(alerts);
      })
      .catch((err) => {
        console.error("Error fetching alerts");
        reject(err);
      });
  });
}
