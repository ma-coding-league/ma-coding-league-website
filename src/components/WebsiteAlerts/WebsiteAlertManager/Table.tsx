import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WebsiteAlertTableRows } from "./Rows";
import {
  WebsiteAlertManagerStateFunctionsContext,
  WebsiteAlertManagerStateStoreContext,
} from "@/components/WebsiteAlerts/WebsiteAlertManager/context";
import { loadingNotify } from "@/components/Notifications";

export default function WebsiteAlertTable() {
  const state = React.useContext(WebsiteAlertManagerStateStoreContext);
  const functions = React.useContext(WebsiteAlertManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshAlerts();
  }, [functions]);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        <button
          type="button"
          className="btn btn-success me-1"
          disabled={state?.status !== "loaded"}
          onClick={() => {
            if (functions === null) {
              return;
            }
            const cbs = loadingNotify(
              "Creating new alert...",
              "Successfully created new alert!",
              "Failed to create new alert!",
              "Canceled creating new alert!",
            );
            setTimeout(() => {
              functions
                .createNewAlert()
                .then(cbs.successCallback)
                .catch(cbs.errorCallback);
            });
          }}
        >
          Add new
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={state?.status === "loading"}
          onClick={() => {
            if (functions === null) {
              return;
            }
            const cbs = loadingNotify(
              "Refreshing alerts...",
              "Successfully refreshed alerts!",
              "Failed to refresh alerts!",
              "Canceled refreshing alerts!",
            );
            functions
              .refreshAlerts()
              .then(cbs.successCallback)
              .catch(cbs.errorCallback);
          }}
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
              switch (state?.status) {
                case "loading":
                  return (
                    <tr>
                      <td colSpan={9}>
                        <div
                          className="alert alert-secondary mb-0"
                          role="alert"
                        >
                          Loading alerts...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.alerts.length === 0) {
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
                    return <WebsiteAlertTableRows />;
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
      </div>
    </ErrorBoundary>
  );
}
