import React from "react";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasAdmin } from "@/database/users/roles";
import { ServerSideSubmission } from "@/scripts/API/Submissions/ServerSide";
import {
  SubmissionsManagerStateFunctionsContext,
  SubmissionsManagerStatesStoreContext,
} from "@/components/Submissions/SubmissionsManager/context";
import { TeamsManagerStatesStoreContext } from "@/components/Teams/TeamsManager/context";

function SubmissionsTableRow({
  submission,
}: {
  submission: ServerSideSubmission;
}): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(SubmissionsManagerStatesStoreContext);
  const functions = React.useContext(SubmissionsManagerStateFunctionsContext);
  const teamState = React.useContext(TeamsManagerStatesStoreContext);
  // const teamFunctions = React.useContext(TeamsManagerStateFunctionsContext);

  const [modifiedSubmission, setModifiedSubmission] =
    React.useState<ServerSideSubmission>(structuredClone(submission));
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    const cbs = loadingNotify(
      "Editing submission...",
      "Successfully edited submission!",
      "Failed to edit submission!",
      "Canceled editing submission!",
    );
    setTimeout(() => {
      functions
        ?.editSubmission(state.compName, submission.team, modifiedSubmission)
        .then(cbs.successCallback)
        .catch(cbs.errorCallback)
        .finally(() => {
          setEditing(false);
        });
    });
  };

  return (
    <tr>
      <td>
        <div className="btn-group">
          {editing ? (
            <>
              <button
                type="button"
                className="btn btn-sm btn-success"
                disabled={state?.status !== "loaded"}
                onClick={() => {
                  saveChanges();
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                disabled={
                  state?.status !== "loaded" ||
                  !roleHasAdmin(session?.user.roles ?? "")
                }
                onClick={() => {
                  cancelChanges();
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={
                  state?.status !== "loaded" ||
                  !roleHasAdmin(session?.user.roles ?? "")
                }
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                disabled={
                  state?.status !== "loaded" ||
                  !roleHasAdmin(session?.user.roles ?? "")
                }
                onClick={() => {
                  const cbs = loadingNotify(
                    "Deleting submission...",
                    "Successfully deleted submission!",
                    "Failed to delete submission!",
                    "Canceled deleting submission!",
                  );
                  functions
                    ?.deleteSubmission(state.compName, submission.team)
                    .then(cbs.successCallback)
                    .catch(cbs.errorCallback);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
      <th scope="row">
        <select
          className="form-select"
          style={{ width: "16em" }}
          value={
            !editing && submission.team != null ? submission.team : undefined
          }
          defaultValue={
            editing && submission.team != null ? submission.team : undefined
          }
          onChange={(e) => {
            setModifiedSubmission({
              ...modifiedSubmission,
              team: e.target.value,
            });
          }}
          disabled={!editing}
        >
          <option>Select a team...</option>
          {teamState?.teams.map((team) => {
            return (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            );
          })}
        </select>
      </th>
      <td>
        <input
          type="url"
          className="form-control"
          style={{ width: "16em" }}
          value={
            !editing && submission.submissionURL != null
              ? submission.submissionURL
              : undefined
          }
          defaultValue={
            editing && submission.submissionURL != null
              ? submission.submissionURL
              : undefined
          }
          onBlur={(e) => {
            const v = e.target.value.trim();
            setModifiedSubmission({
              ...modifiedSubmission,
              submissionURL: v === "" ? null : v,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          style={{ width: "8em" }}
          min={0}
          value={
            !editing && submission.scoreNumerator != null
              ? submission.scoreNumerator
              : undefined
          }
          defaultValue={
            editing && submission.scoreNumerator != null
              ? submission.scoreNumerator
              : undefined
          }
          onBlur={(e) => {
            const v = e.target.value.trim();
            setModifiedSubmission({
              ...modifiedSubmission,
              scoreNumerator: v === "" ? null : parseInt(v),
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          style={{ width: "8em" }}
          min={1}
          value={
            !editing && submission.scoreDenominator != null
              ? submission.scoreDenominator
              : undefined
          }
          defaultValue={
            editing && submission.scoreDenominator != null
              ? submission.scoreDenominator
              : undefined
          }
          onBlur={(e) => {
            const v = e.target.value.trim();
            setModifiedSubmission({
              ...modifiedSubmission,
              scoreDenominator: v === "" ? 1 : parseInt(v),
            });
          }}
          disabled={!editing}
        />
      </td>
    </tr>
  );
}

export function SubmissionsTableRows(): React.ReactNode {
  const state = React.useContext(SubmissionsManagerStatesStoreContext);
  // const functions = React.useContext(SubmissionsManagerStateFunctionsContext);

  return state?.submissions.map((submission) => {
    return (
      <SubmissionsTableRow
        submission={submission}
        key={JSON.stringify(submission)}
      />
    );
  });
}
