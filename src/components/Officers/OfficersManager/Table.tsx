import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";
import {
  OfficersManagerStateFunctionsContext,
  OfficersManagerStatesStoreContext,
} from "@/components/Officers/OfficersManager/context";
import { OfficerTableRows } from "@/components/Officers/OfficersManager/Rows";

export default function OfficersTable() {
  const { data: session } = useSession();
  const state = React.useContext(OfficersManagerStatesStoreContext);
  const functions = React.useContext(OfficersManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshOfficers();
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
              "Creating new officer...",
              "Successfully created new officer!",
              "Failed to create new officer!",
              "Canceled creating new officer!",
            );
            setTimeout(() => {
              functions
                .createNewOfficer()
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
              "Refreshing officers...",
              "Successfully refreshed officers!",
              "Failed to refresh officers!",
              "Canceled refreshing officers!",
            );
            functions
              .refreshOfficers()
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
              <th scope="col">Role</th>
              <th scope="col">Description</th>
              <th scope="col">Person name</th>
              <th scope="col">Person school</th>
              <th scope="col">Open for application</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              switch (state?.status) {
                case "loading":
                  return (
                    <tr>
                      <td colSpan={7}>
                        <div
                          className="alert alert-secondary mb-0"
                          role="alert"
                        >
                          Loading officers...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.officers.length === 0) {
                    return (
                      <tr>
                        <td colSpan={7}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No officers found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return <OfficerTableRows />;
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={7}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching officers, try refreshing the page!
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
