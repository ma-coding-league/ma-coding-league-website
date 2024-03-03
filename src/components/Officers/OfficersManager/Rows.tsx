import React from "react";
import { loadingNotify } from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { roleHasTechLead } from "@/database/users/roles";

import { Officer } from "@/scripts/API/Officers";
import {
  OfficersManagerStateFunctionsContext,
  OfficersManagerStatesStoreContext,
} from "@/components/Officers/OfficersManager/context";

function OfficerTableRow({ officer }: { officer: Officer }): React.ReactNode {
  const { data: session } = useSession();
  const state = React.useContext(OfficersManagerStatesStoreContext);
  const functions = React.useContext(OfficersManagerStateFunctionsContext);

  const [modifiedOfficer, setModifiedOfficer] = React.useState<Officer>(
    structuredClone(officer),
  );
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    const cbs = loadingNotify(
      "Editing officer...",
      "Successfully edited officer!",
      "Failed to edit officer!",
      "Canceled editing officer!",
    );
    setTimeout(() => {
      functions
        ?.editOfficer(modifiedOfficer)
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
                    "Deleting officer...",
                    "Successfully deleted officer!",
                    "Failed to delete officer!",
                    "Canceled deleting officer!",
                  );
                  functions
                    ?.deleteOfficer(officer.id)
                    .then(cbs.successCallback)
                    .catch(cbs.errorCallback);
                }}
              >
                Delete
              </button>
              {/*<button*/}
              {/*  type="button"*/}
              {/*  className="btn btn-sm btn-secondary"*/}
              {/*  disabled={*/}
              {/*    state?.status !== "loaded" || officers.indexOf(link) === 0*/}
              {/*  }*/}
              {/*  onClick={() => {*/}
              {/*    setModifiedAlert({*/}
              {/*      ...modifiedAlert,*/}
              {/*      links: (() => {*/}
              {/*        const index = modifiedAlert.links.indexOf(link);*/}
              {/*        if (index === 0) {*/}
              {/*          return modifiedAlert.links;*/}
              {/*        }*/}
              {/*        const links = [...modifiedAlert.links];*/}
              {/*        const temp = links[index];*/}
              {/*        links[index] = links[index - 1];*/}
              {/*        links[index - 1] = temp;*/}
              {/*        return links;*/}
              {/*      })(),*/}
              {/*    });*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Up*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  type="button"*/}
              {/*  className="btn btn-sm btn-secondary"*/}
              {/*  disabled={*/}
              {/*    state?.status !== "loaded" ||*/}
              {/*    modifiedAlert.links.indexOf(link) ===*/}
              {/*      modifiedAlert.links.length - 1*/}
              {/*  }*/}
              {/*  onClick={() => {*/}
              {/*    setModifiedAlert({*/}
              {/*      ...modifiedAlert,*/}
              {/*      links: (() => {*/}
              {/*        const index = modifiedAlert.links.indexOf(link);*/}
              {/*        if (index === modifiedAlert.links.length - 1) {*/}
              {/*          return modifiedAlert.links;*/}
              {/*        }*/}
              {/*        const links = [...modifiedAlert.links];*/}
              {/*        const temp = links[index];*/}
              {/*        links[index] = links[index + 1];*/}
              {/*        links[index + 1] = temp;*/}
              {/*        return links;*/}
              {/*      })(),*/}
              {/*    });*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Down*/}
              {/*</button>*/}
            </>
          )}
        </div>
      </td>
      <th scope="row">
        <code>{officer.id}</code>
      </th>
      <td>
        <input
          className="form-control"
          value={!editing ? officer.role : undefined}
          defaultValue={editing ? officer.role : undefined}
          onBlur={(e) => {
            setModifiedOfficer({
              ...modifiedOfficer,
              role: e.target.value,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <textarea
          className="form-control"
          rows={1}
          value={!editing ? officer.description : undefined}
          defaultValue={editing ? officer.description : undefined}
          onBlur={(e) => {
            setModifiedOfficer({
              ...modifiedOfficer,
              description: e.target.value,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          className="form-control"
          value={
            !editing && officer.personName != null
              ? officer.personName
              : undefined
          }
          defaultValue={
            editing && officer.personName != null
              ? officer.personName
              : undefined
          }
          onBlur={(e) => {
            const s = e.target.value;
            setModifiedOfficer({
              ...modifiedOfficer,
              personName: s.length === 0 ? null : s,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          className="form-control"
          value={
            !editing && officer.personSchool != null
              ? officer.personSchool
              : undefined
          }
          defaultValue={
            editing && officer.personSchool != null
              ? officer.personSchool
              : undefined
          }
          onBlur={(e) => {
            const s = e.target.value;
            setModifiedOfficer({
              ...modifiedOfficer,
              personSchool: s.length === 0 ? null : s,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={
            !editing && officer.openForApplication != null
              ? officer.openForApplication
              : undefined
          }
          defaultChecked={
            editing && officer.openForApplication != null
              ? officer.openForApplication
              : undefined
          }
          onBlur={(e) => {
            setModifiedOfficer({
              ...modifiedOfficer,
              openForApplication: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
    </tr>
  );
}

export function OfficerTableRows(): React.ReactNode {
  const state = React.useContext(OfficersManagerStatesStoreContext);
  // const functions = React.useContext(OfficersManagerStateFunctionsContext);

  return state?.officers.map((officer) => {
    return <OfficerTableRow officer={officer} key={JSON.stringify(officer)} />;
  });
}
