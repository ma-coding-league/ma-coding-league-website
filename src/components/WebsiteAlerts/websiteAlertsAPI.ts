export const BoostrapAlertTypes = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
] as const;

export type BootstrapAlertType = (typeof BoostrapAlertTypes)[number];

export type WebsiteAlertLink = {
  name: string;
  type: BootstrapAlertType;
  url: string;
};

export type WebsiteAlert = {
  id: string;
  enable: boolean;
  start: Date;
  end: Date;
  type: BootstrapAlertType;
  canHide: boolean;
  content: string;
  links: WebsiteAlertLink[];
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

export default async function getWebsiteAlertsFromAPI(): Promise<
  WebsiteAlert[]
> {
  const response = await fetch("/api/alerts");

  return (await response.json()).map((alert: any) => {
    return <WebsiteAlert>{
      id: alert.id,
      enable: alert.enable,
      start: new Date(alert.start),
      end: new Date(alert.end),
      type: alert.type,
      canHide: alert.canHide,
      content: alert.content,
      links: (() => {
        try {
          return alert.links!.split("\n").map((link: string) => {
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
    };
  });
}
