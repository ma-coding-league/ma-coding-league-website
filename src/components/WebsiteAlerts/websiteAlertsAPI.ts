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

export function serializeWebsiteAlert(alert: WebsiteAlert): string {
  return JSON.stringify({
    id: alert.id,
    enable: alert.enable,
    start: alert.start.toISOString(),
    end: alert.end.toISOString(),
    type: alert.type,
    canHide: alert.canHide,
    content: alert.content,
    links: alert.links,
  });
}

export function deserializeWebsiteAlert(alert: string): WebsiteAlert {
  const alertObject = JSON.parse(alert);
  return <WebsiteAlert>{
    id: alertObject.id,
    enable: alertObject.enable,
    start: new Date(alertObject.start),
    end: new Date(alertObject.end),
    type: alertObject.type,
    canHide: alertObject.canHide,
    content: alertObject.content,
    links: alertObject.links,
  };
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
      links: alert.links,
    };
  });
}
