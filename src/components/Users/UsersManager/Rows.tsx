import React from "react";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";

import { User } from "@/scripts/API/Users";
import {
  UsersManagerStateFunctionsContext,
  UsersManagerStatesStoreContext,
} from "@/components/Users/UsersManager/context";
import RoleBadges from "@/components/Authentication/Roles/RoleBadges";
import { TeamsManagerStatesStoreContext } from "@/components/Teams/TeamsManager/context";

function UserTableRow({ user }: { user: User }): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(UsersManagerStatesStoreContext);
  const functions = React.useContext(UsersManagerStateFunctionsContext);
  const teamState = React.useContext(TeamsManagerStatesStoreContext);

  const [modifiedUser, setModifiedUser] = React.useState<User>(
    structuredClone(user),
  );
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    const cbs = loadingNotify(
      "Editing user...",
      "Successfully edited user!",
      "Failed to edit user!",
      "Canceled editing user!",
    );
    setTimeout(() => {
      functions
        ?.editUser(modifiedUser)
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
                    "Deleting user...",
                    "Successfully deleted user!",
                    "Failed to delete user!",
                    "Canceled deleting user!",
                  );
                  functions
                    ?.deleteUser(user.id)
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
        <code>{user.id}</code>
      </th>
      <td>
        <span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.image}
            alt={`Profile picture of ${user.name}`}
            style={{
              width: "1.5em",
              height: "1.5em",
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
          <span className="ms-2">{user.name}</span>
        </span>
      </td>
      <td>
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>{user.email}</code>
        </a>
      </td>
      <td>
        {!editing ? (
          <RoleBadges roles={user.roles} />
        ) : (
          <input
            className="form-control"
            type="text"
            value={!editing ? user.roles : undefined}
            defaultValue={editing ? user.roles : undefined}
            onBlur={(e) => {
              setModifiedUser({
                ...modifiedUser,
                roles: e.target.value,
              });
            }}
            disabled={!editing}
          />
        )}
      </td>
      <td>
        <select
          className="form-select"
          style={{ width: "16em" }}
          value={!editing && user.team != null ? user.team.id : undefined}
          defaultValue={editing && user.team != null ? user.team.id : undefined}
          onChange={(e) => {
            setModifiedUser({
              ...user,
              team: { id: e.target.value },
            });
          }}
          disabled={!editing}
        >
          <option>Select a team...</option>
          {teamState?.teams.map((team) => {
            return (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          type="number"
          step="1"
          value={!editing ? user.graduationYear ?? undefined : undefined}
          defaultValue={editing ? user.graduationYear ?? undefined : undefined}
          onBlur={(e) => {
            setModifiedUser({
              ...user,
              graduationYear: parseInt(e.target.value) ?? null,
            });
          }}
          className="form-control mt-2"
          placeholder="Graduation year"
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? user.teamVerified : undefined}
          defaultChecked={editing ? user.teamVerified : undefined}
          onChange={(e) => {
            setModifiedUser({
              ...user,
              teamVerified: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
    </tr>
  );
}

export function UserTableRows(): React.ReactNode {
  const state = React.useContext(UsersManagerStatesStoreContext);
  // const functions = React.useContext(UsersManagerStateFunctionsContext);

  return state?.users.map((user) => {
    return <UserTableRow user={user} key={JSON.stringify(user)} />;
  });
}
