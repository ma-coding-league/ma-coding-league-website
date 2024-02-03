import React from "react";
import getWebsiteAlertsFromAPI, {
  WebsiteAlert,
} from "@/components/WebsiteAlerts/websiteAlertsAPI";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WebsiteAlertRow, WebsiteAlertRowEditModal } from "./Row";

export default function WebsiteAlertTable() {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [alerts, setAlerts] = React.useState<WebsiteAlert[]>([]);

  const refresh = () => {
    setState("loading");
    setAlerts([]);
    getWebsiteAlertsFromAPI()
      .then((alerts) => {
        setAlerts(alerts);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <ErrorBoundary>
      {(() => {
        switch (state) {
          case "loading":
            return <p>Loading...</p>;
          case "loaded":
            return (
              <div className="table-responsive">
                <button
                  type="button"
                  className="btn btn-success me-1"
                  disabled={state !== "loaded"}
                >
                  Add new
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={state !== "loaded"}
                  onClick={refresh}
                >
                  Refresh
                </button>
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col" />
                      <th scope="col">ID</th>
                      <th scope="col">Enable</th>
                      <th scope="col">Start</th>
                      <th scope="col">End</th>
                      <th scope="col">Type</th>
                      <th scope="col">Can hide</th>
                      <th scope="col">Content</th>
                      <th scope="col">Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => {
                      return <WebsiteAlertRow alert={alert} key={alert.id} />;
                    })}
                  </tbody>
                </table>
                {alerts.map((alert) => {
                  return (
                    <WebsiteAlertRowEditModal alert={alert} key={alert.id} />
                  );
                })}
              </div>
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
