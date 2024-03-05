import { useSession } from "next-auth/react";
import React from "react";
import {
  SubmissionsManagerStateFunctionsContext,
  SubmissionsManagerStatesStoreContext,
} from "@/components/Submissions/SubmissionsManager/context";
import ErrorBoundary from "@/components/ErrorBoundary";
import { roleHasAdmin } from "@/database/users/roles";
import { loadingNotify } from "@/components/Notifications";
import { SubmissionsTableRows } from "@/components/Submissions/SubmissionsManager/Rows";
import { TeamsManagerStateFunctionsContext } from "@/components/Teams/TeamsManager/context";

export default function SubmissionsManagerTable({
  compName,
}: {
  compName: string;
}): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(SubmissionsManagerStatesStoreContext);
  const functions = React.useContext(SubmissionsManagerStateFunctionsContext);
  // const teamState = React.useContext(TeamsManagerStatesStoreContext);
  const teamFunctions = React.useContext(TeamsManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshSubmissions(compName);
    teamFunctions?.refreshTeams();
  }, [functions, compName, teamFunctions]);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        <button
          type="button"
          className="btn btn-success me-1"
          disabled={
            state?.status !== "loaded" ||
            !roleHasAdmin(session?.user.roles ?? "")
          }
          onClick={() => {
            if (functions === null) {
              return;
            }
            const cbs = loadingNotify(
              "Creating new submission...",
              "Successfully created new submission!",
              "Failed to create new submission!",
              "Canceled creating new submission!",
            );
            setTimeout(() => {
              functions
                .createNewSubmission(compName)
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
              "Refreshing submissions...",
              "Successfully refreshed submissions!",
              "Failed to refresh submissions!",
              "Canceled refreshing submissions!",
            );
            functions
              .refreshSubmissions(compName)
              .then(() => {
                return teamFunctions?.refreshTeams();
              })
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
              <th scope="col">Team</th>
              <th scope="col">Submission URL</th>
              <th scope="col">Score numerator</th>
              <th scope="col">Score denominator</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              switch (state?.status) {
                case "loading":
                  return (
                    <tr>
                      <td colSpan={6}>
                        <div
                          className="alert alert-secondary mb-0"
                          role="alert"
                        >
                          Loading submissions for {compName}...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.submissions.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No submissions found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return <SubmissionsTableRows />;
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={6}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching submissions, try refreshing the page!
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
