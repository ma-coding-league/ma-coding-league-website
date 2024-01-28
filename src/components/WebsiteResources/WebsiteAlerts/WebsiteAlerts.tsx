import ErrorBoundary from "@/components/ErrorBoundary";
import React from "react";
import getWebsiteAlerts, {
  WebsiteAlert,
} from "@/components/WebsiteResources/WebsiteAlerts/getWebsiteAlerts";
import markdownToHTML from "@/scripts/Utils/MarkdownToHTML";
import Link from "next/link";
import { isExternalLink } from "@/scripts/Utils/PageUtils";
import { nowBetween } from "@/scripts/Utils/DateAndTime/Helpers";

function WebsiteAlert({ alert }: { alert: WebsiteAlert }): JSX.Element {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [html, setHTML] = React.useState<string>("");

  React.useEffect(() => {
    setHTML("");
    setState("loading");
    markdownToHTML(alert.content)
      .then((html) => {
        setHTML(html);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  }, [alert.content]);

  return (
    <div
      className={`alert alert-${state === "error" ? "warning" : alert.type} ${
        alert.links.length === 0 ? "pb-0" : ""
      }`}
      role="alert"
      key={alert.content}
    >
      {(() => {
        switch (state) {
          case "loading":
            return (
              <p className="placeholder-glow">
                <span className="placeholder col-12" />
                <span className="placeholder col-12" />
              </p>
            );
          case "loaded":
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
          default:
          case "error":
            return "Error loading this alert content, try refreshing the page!";
        }
      })()}
      {alert.links.map((link) => {
        return isExternalLink(link.url) ? (
          <a
            className={`btn btn-${link.type} btn-sm me-1`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            key={link.name + ", " + link.url}
            role="button"
          >
            {link.name}
          </a>
        ) : (
          <Link
            className={`btn btn-${link.type} btn-sm me-1`}
            href={link.url}
            key={link.name + ", " + link.url}
            role="button"
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}

export default function WebsiteAlerts({
  resGSheetID,
}: {
  resGSheetID: string;
}) {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [alerts, setAlerts] = React.useState<WebsiteAlert[]>([]);

  React.useEffect(() => {
    setState("loading");
    setAlerts([]);
    getWebsiteAlerts(resGSheetID)
      .then((alerts) => {
        setAlerts(alerts);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  }, [resGSheetID]);

  return (
    <ErrorBoundary>
      {(() => {
        switch (state) {
          case "loading":
            return <></>;
          case "loaded":
            return (
              <>
                {alerts
                  .filter((alert) => {
                    return alert.enable && nowBetween(alert.show, alert.end);
                  })
                  .map((alert) => {
                    return (
                      <WebsiteAlert
                        alert={alert}
                        key={alert.content + "_" + alert.end.toISOString()}
                      />
                    );
                  })}
              </>
            );
          default:
          case "error":
            return (
              <div className="alert alert-warning" role="alert">
                Error fetching alerts, try refreshing the page!
              </div>
            );
        }
      })()}
    </ErrorBoundary>
  );
}
