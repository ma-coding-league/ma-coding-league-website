import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { loadingNotify } from "@/components/Notifications";
import {
  UsersManagerStateFunctionsContext,
  UsersManagerStatesStoreContext,
} from "@/components/Users/UsersManager/context";
import { UserTableRows } from "@/components/Users/UsersManager/Rows";
import Pagination from "@/components/Pagination";

export default function UsersTable() {
  // const { data: session } = useSession();
  const state = React.useContext(UsersManagerStatesStoreContext);
  const functions = React.useContext(UsersManagerStateFunctionsContext);

  React.useEffect(() => {
    functions?.refreshUsers();
  }, [functions]);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={state?.status === "loading"}
          onClick={() => {
            if (functions === null) {
              return;
            }
            const cbs = loadingNotify(
              "Refreshing users...",
              "Successfully refreshed users!",
              "Failed to refresh users!",
              "Canceled refreshing users!",
            );
            functions
              .refreshUsers()
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
              <th scope="col">Email</th>
              <th scope="col">Roles</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              switch (state?.status) {
                case "loading":
                  return (
                    <tr>
                      <td colSpan={5}>
                        <div
                          className="alert alert-secondary mb-0"
                          role="alert"
                        >
                          Loading users...
                        </div>
                      </td>
                    </tr>
                  );
                case "loaded":
                  if (state?.users.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5}>
                          <div
                            className="alert alert-primary mb-0"
                            role="alert"
                          >
                            No users found, try adding one!
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return <UserTableRows />;
                  }
                default:
                case "error":
                  return (
                    <tr>
                      <td colSpan={5}>
                        <div className="alert alert-warning mb-0" role="alert">
                          Error fetching users, try refreshing the page!
                        </div>
                      </td>
                    </tr>
                  );
              }
            })()}
          </tbody>
        </table>
        <Pagination
          page={state.page}
          // pageCount={15}
          pageCount={state.pageCount}
          setPageCallback={(p) => {
            functions?.setPage(p);
          }}
          disabled={state.status !== "loaded"}
        />
      </div>
    </ErrorBoundary>
  );
}
