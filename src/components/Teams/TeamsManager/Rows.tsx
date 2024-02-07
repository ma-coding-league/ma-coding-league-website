import React from "react";
import { loadingNotify } from "@/components/Notifications";
import { Team } from "@/components/Teams/teamsAPI";
import {
  TeamsManagerStateFunctionsContext,
  TeamsManagerStatesStoreContext,
} from "@/components/Teams/TeamsManager/context";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";

function TeamTableRow({ team }: { team: Team }): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(TeamsManagerStatesStoreContext);
  const functions = React.useContext(TeamsManagerStateFunctionsContext);

  const [modifiedTeam, setModifiedTeam] = React.useState<Team>(
    structuredClone(team),
  );
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    const cbs = loadingNotify(
      "Editing team...",
      "Successfully edited team!",
      "Failed to edit team!",
      "Canceled editing team!",
    );
    setTimeout(() => {
      functions
        ?.editTeam(modifiedTeam)
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
                  !roleHasTechLead(session?.user.roles ?? "")
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
                  !roleHasTechLead(session?.user.roles ?? "")
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
                  !roleHasTechLead(session?.user.roles ?? "")
                }
                onClick={() => {
                  const cbs = loadingNotify(
                    "Deleting team...",
                    "Successfully deleted team!",
                    "Failed to delete team!",
                    "Canceled deleting team!",
                  );
                  functions
                    ?.deleteTeam(team.id)
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
        <code>{team.id}</code>
      </th>
      <td>
        <input
          className="form-control"
          value={!editing ? team.name : undefined}
          defaultValue={editing ? team.name : undefined}
          onBlur={(e) => {
            setModifiedTeam({
              ...modifiedTeam,
              name: e.target.value,
            });
          }}
          disabled={!editing}
        />
      </td>
    </tr>
  );
}

export function TeamTableRows(): React.ReactNode {
  const state = React.useContext(TeamsManagerStatesStoreContext);
  // const functions = React.useContext(TeamsManagerStateFunctionsContext);

  return state?.teams.map((team) => {
    return <TeamTableRow team={team} key={JSON.stringify(team)} />;
  });
}
