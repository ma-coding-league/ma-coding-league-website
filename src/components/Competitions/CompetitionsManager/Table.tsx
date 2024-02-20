import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";
import { CompetitionsManagerStatesStoreContext } from "./context";
import { CompetitionsManagerStateFunctionsContext } from "@/components/Competitions/CompetitionsManager/context";
import { CompetitionsTableRows } from "@/components/Competitions/CompetitionsManager/Rows";

export default function CompetitionsManagerTable() {
  const { data: session } = useSession();
  const state = React.useContext(CompetitionsManagerStatesStoreContext);
  const functions = React.useContext(CompetitionsManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshCompetitions();
  }, [functions]);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        <button
          type="button"
          className="btn btn-success me-1"
          disabled={
            state?.status !== "loaded" ||
            !roleHasTechLead(session?.user.roles ?? "")
          }
          onClick={() => {
            if (functions === null) {
              return;
            }
            const cbs = loadingNotify(
              "Creating new competition...",
              "Successfully created new competition!",
              "Failed to create new competition!",
              "Canceled creating new competition!",
            );
            setTimeout(() => {
              functions
                .createNewCompetition()
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
              "Refreshing competitions...",
              "Successfully refreshed competitions!",
              "Failed to refresh competitions!",
              "Canceled refreshing competitions!",
            );
            functions
              .refreshCompetitions()
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
              <th scope="col">Name</th>
              <th scope="col">Location</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">Year taking place</th>
              <th scope="col">Theme</th>
              <th scope="col">Show this</th>
              <th scope="col">Show theme</th>
              <th scope="col">Show submissions</th>
              <th scope="col">Show results</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              switch (state?.status) {
                case "loading":
                  return (
                    <tr>
                      <td colSpan={3}>
                        <div
                          className="alert alert-secondary mb-0"
                          role="alert"
                        >
                          Loading competitions...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.competitions.length === 0) {
                    return (
                      <tr>
                        <td colSpan={3}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No competitions found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return <CompetitionsTableRows />;
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={3}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching competitions, try refreshing the page!
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
