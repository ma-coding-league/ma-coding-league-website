import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { loadingNotify } from "@/components/Notifications";
import {
  TeamsManagerStateFunctionsContext,
  TeamsManagerStatesStoreContext,
} from "@/components/Teams/TeamsManager/context";
import { TeamTableRows } from "@/components/Teams/TeamsManager/Rows";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";

export default function TeamsTable() {
  const { data: session } = useSession();
  const state = React.useContext(TeamsManagerStatesStoreContext);
  const functions = React.useContext(TeamsManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshTeams();
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
              "Creating new team...",
              "Successfully created new team!",
              "Failed to create new team!",
              "Canceled creating new team!",
            );
            setTimeout(() => {
              functions
                .createNewTeam()
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
              "Refreshing teams...",
              "Successfully refreshed teams!",
              "Failed to refresh teams!",
              "Canceled refreshing teams!",
            );
            functions
              .refreshTeams()
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
                          Loading teams...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.teams.length === 0) {
                    return (
                      <tr>
                        <td colSpan={3}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No teams found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return <TeamTableRows />;
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={3}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching teams, try refreshing the page!
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
