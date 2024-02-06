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
    setTimeout(() => {
      getWebsiteAlertsFromAPI()
        .then((alerts) => {
          setAlerts(alerts);
          setState("loaded");
        })
        .catch((err) => {
          console.error(err);
          setState("error");
        });
    }, 200);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  const [disableAddButton, setDisableAddButton] = React.useState(false);

  const addNewAlert = () => {
    console.log("Adding new alert");
    setDisableAddButton(true);
    fetch("/api/alerts", { method: "POST" })
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Failed to add new alert");
        }
        setTimeout(refresh);
      })
      .catch(() => {
        console.error("Failed to add new alert");
      })
      .finally(() => {
        setDisableAddButton(false);
      });
  };

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        <button
          type="button"
          className="btn btn-success me-1"
          disabled={state !== "loaded" || disableAddButton}
          onClick={addNewAlert}
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
            {(() => {
              switch (state) {
                case "loading":
                  const row = (
                    <tr className="placeholder-glow">
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={true}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            disabled={true}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="placeholder col-10" />
                      </td>
                      <td>
                        <span className="placeholder col-4" />
                      </td>
                      <td>
                        <span className="placeholder col-10" />
                      </td>
                      <td>
                        <span className="placeholder col-10" />
                      </td>
                      <td>
                        <span className="placeholder col-6" />
                      </td>
                      <td>
                        <span className="placeholder col-4" />
                      </td>
                      <td>
                        <span className="placeholder col-10" />
                      </td>
                      <td>
                        <span className="placeholder col-10" />
                      </td>
                    </tr>
                  );
                  return (
                    <>
                      {row}
                      {row}
                      {row}
                    </>
                  );
                case "loaded":
                  if (alerts.length === 0) {
                    return (
                      <tr>
                        <td colSpan={9}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No alerts found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return alerts.map((alert) => {
                      return (
                        <WebsiteAlertRow
                          alert={alert}
                          key={alert.id}
                          refreshCbRef={refresh}
                        />
                      );
                    });
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={9}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching alerts, try refreshing the page!
                        </div>
                      </td>
                    </tr>
                  );
              }
            })()}
          </tbody>
        </table>
        {state == "loaded"
          ? alerts.map((alert) => {
              return <WebsiteAlertRowEditModal alert={alert} key={alert.id} />;
            })
          : null}
      </div>
    </ErrorBoundary>
  );
}
