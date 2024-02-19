import React from "react";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasAdmin } from "@/database/users/roles";
import {
  CompetitionsManagerStateFunctionsContext,
  CompetitionsManagerStatesStoreContext,
} from "@/components/Competitions/CompetitionsManager/context";
import { ServerSideCompetition } from "@/components/Competitions/competitionsAPI";
import { formatDateForInput } from "@/scripts/Utils/DateAndTime/Format";

function CompetitionsTableRow({
  competition,
}: {
  competition: ServerSideCompetition;
}): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(CompetitionsManagerStatesStoreContext);
  const functions = React.useContext(CompetitionsManagerStateFunctionsContext);

  const [modifiedCompetition, setModifiedCompetition] =
    React.useState<ServerSideCompetition>(structuredClone(competition));
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    const cbs = loadingNotify(
      "Editing competition...",
      "Successfully edited competition!",
      "Failed to edit competition!",
      "Canceled editing competition!",
    );
    setTimeout(() => {
      functions
        ?.editCompetition(modifiedCompetition)
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
                    "Deleting competition...",
                    "Successfully deleted competition!",
                    "Failed to delete competition!",
                    "Canceled deleting competition!",
                  );
                  functions
                    ?.deleteCompetition(competition.id)
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
        <code>{competition.id}</code>
      </th>
      <td>
        <input
          className="form-control"
          style={{ width: "12em" }}
          value={!editing ? competition.name : undefined}
          defaultValue={editing ? competition.name : undefined}
          onBlur={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              name: e.target.value,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          className="form-control"
          style={{ width: "12em" }}
          value={
            !editing && competition.location != null
              ? competition.location
              : undefined
          }
          defaultValue={
            editing && competition.location != null
              ? competition.location
              : undefined
          }
          onBlur={(e) => {
            const v = e.target.value.trim();
            setModifiedCompetition({
              ...modifiedCompetition,
              location: v === "" ? null : v,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="datetime-local"
          className="form-control"
          style={{ width: "12em" }}
          value={
            !editing && competition.start != null
              ? formatDateForInput(competition.start)
              : undefined
          }
          defaultValue={
            editing && competition.start != null
              ? formatDateForInput(competition.start)
              : undefined
          }
          onBlur={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              start: new Date(e.target.value),
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="datetime-local"
          className="form-control"
          style={{ width: "12em" }}
          value={
            !editing && competition.end != null
              ? formatDateForInput(competition.end)
              : undefined
          }
          defaultValue={
            editing && competition.end != null
              ? formatDateForInput(competition.end)
              : undefined
          }
          onBlur={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              end: new Date(e.target.value),
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          className="form-control"
          style={{ width: "12em" }}
          value={
            !editing && competition.theme != null
              ? competition.theme
              : undefined
          }
          defaultValue={
            editing && competition.theme != null ? competition.theme : undefined
          }
          onBlur={(e) => {
            const v = e.target.value.trim();
            setModifiedCompetition({
              ...modifiedCompetition,
              theme: v === "" ? null : v,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? competition.showThis : undefined}
          defaultChecked={editing ? competition.showThis : undefined}
          onChange={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              showThis: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? competition.showTheme : undefined}
          defaultChecked={editing ? competition.showTheme : undefined}
          onChange={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              showTheme: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? competition.showSubmissions : undefined}
          defaultChecked={editing ? competition.showSubmissions : undefined}
          onChange={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              showSubmissions: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? competition.showResults : undefined}
          defaultChecked={editing ? competition.showResults : undefined}
          onChange={(e) => {
            setModifiedCompetition({
              ...modifiedCompetition,
              showResults: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
    </tr>
  );
}

export function CompetitionsTableRows(): React.ReactNode {
  const state = React.useContext(CompetitionsManagerStatesStoreContext);
  // const functions = React.useContext(TeamsManagerStateFunctionsContext);

  return state?.competitions.map((competition) => {
    return (
      <CompetitionsTableRow
        competition={competition}
        key={JSON.stringify(competition)}
      />
    );
  });
}
