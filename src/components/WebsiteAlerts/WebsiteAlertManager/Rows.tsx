import {
  BoostrapAlertTypes,
  BootstrapAlertType,
  WebsiteAlert,
} from "@/components/WebsiteAlerts/websiteAlertsAPI";
import React from "react";
import {
  WebsiteAlertManagerStateFunctionsContext,
  WebsiteAlertManagerStateStoreContext,
} from "@/components/WebsiteAlerts/WebsiteAlertManager/context";
import { formatDateForInput } from "@/scripts/Utils/DateAndTime/Format";

function WebsiteAlertTableRow({
  alert,
}: {
  alert: WebsiteAlert;
}): React.ReactNode {
  const state = React.useContext(WebsiteAlertManagerStateStoreContext);
  const functions = React.useContext(WebsiteAlertManagerStateFunctionsContext);

  const [modifiedAlert, setModifiedAlert] = React.useState<WebsiteAlert>(
    structuredClone(alert),
  );
  const [editing, setEditing] = React.useState(false);

  const cancelChanges = () => {
    console.log("Cancel changes");
    setEditing(false);
  };

  const saveChanges = () => {
    functions?.editAlert(modifiedAlert);
    setEditing(false);
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
                disabled={state?.status !== "loaded"}
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
                disabled={state?.status !== "loaded"}
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                disabled={state?.status !== "loaded"}
                onClick={() => {
                  functions?.deleteAlert(alert.id);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
      <th scope="row">
        <code>{alert.id}</code>
      </th>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? alert.enable : undefined}
          defaultChecked={editing ? modifiedAlert.enable : undefined}
          onChange={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
              enable: e.target.checked,
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
          value={!editing ? formatDateForInput(alert.start) : undefined}
          defaultValue={
            editing ? formatDateForInput(modifiedAlert.start) : undefined
          }
          onBlur={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
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
          value={!editing ? formatDateForInput(alert.end) : undefined}
          defaultValue={
            editing ? formatDateForInput(modifiedAlert.end) : undefined
          }
          onBlur={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
              end: new Date(e.target.value),
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <select
          className="form-select"
          style={{ width: "7em" }}
          value={!editing ? alert.type : undefined}
          defaultValue={editing ? modifiedAlert.type : undefined}
          onChange={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
              type: e.target.value as BootstrapAlertType,
            });
          }}
          disabled={!editing}
        >
          {BoostrapAlertTypes.map((type) => {
            return (
              <option value={type} key={type}>
                {type}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          checked={!editing ? alert.canHide : undefined}
          defaultChecked={editing ? modifiedAlert.canHide : undefined}
          onChange={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
              canHide: e.target.checked,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td>
        <textarea
          className="form-control"
          style={{ width: "25em" }}
          rows={editing ? 3 : 1}
          value={!editing ? alert.content : undefined}
          defaultValue={editing ? modifiedAlert.content : undefined}
          onChange={(e) => {
            setModifiedAlert({
              ...modifiedAlert,
              content: e.target.value,
            });
          }}
          disabled={!editing}
        />
      </td>
      <td className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              {editing ? <th scope="col" /> : undefined}
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">URL</th>
            </tr>
          </thead>
          <tbody>
            {modifiedAlert.links.length > 0 ? (
              modifiedAlert.links.map((link) => {
                return (
                  <tr key={JSON.stringify(link)}>
                    {editing ? (
                      <th scope="row">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            disabled={state?.status !== "loaded"}
                            onClick={() => {
                              setModifiedAlert({
                                ...modifiedAlert,
                                links: modifiedAlert.links.filter((l) => {
                                  return l !== link;
                                }),
                              });
                            }}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            disabled={
                              state?.status !== "loaded" ||
                              modifiedAlert.links.indexOf(link) === 0
                            }
                            onClick={() => {
                              setModifiedAlert({
                                ...modifiedAlert,
                                links: (() => {
                                  const index =
                                    modifiedAlert.links.indexOf(link);
                                  if (index === 0) {
                                    return modifiedAlert.links;
                                  }
                                  const links = [...modifiedAlert.links];
                                  const temp = links[index];
                                  links[index] = links[index - 1];
                                  links[index - 1] = temp;
                                  return links;
                                })(),
                              });
                            }}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            disabled={
                              state?.status !== "loaded" ||
                              modifiedAlert.links.indexOf(link) ===
                                modifiedAlert.links.length - 1
                            }
                            onClick={() => {
                              setModifiedAlert({
                                ...modifiedAlert,
                                links: (() => {
                                  const index =
                                    modifiedAlert.links.indexOf(link);
                                  if (
                                    index ===
                                    modifiedAlert.links.length - 1
                                  ) {
                                    return modifiedAlert.links;
                                  }
                                  const links = [...modifiedAlert.links];
                                  const temp = links[index];
                                  links[index] = links[index + 1];
                                  links[index + 1] = temp;
                                  return links;
                                })(),
                              });
                            }}
                          >
                            Down
                          </button>
                        </div>
                      </th>
                    ) : undefined}
                    <td>
                      <input
                        className="form-control"
                        style={{ width: "8em" }}
                        value={!editing ? link.name : undefined}
                        defaultValue={editing ? link.name : undefined}
                        onBlur={(e) => {
                          setModifiedAlert({
                            ...modifiedAlert,
                            links: modifiedAlert.links.map((l) => {
                              if (l === link) {
                                return {
                                  ...l,
                                  name: e.target.value,
                                };
                              } else {
                                return l;
                              }
                            }),
                          });
                        }}
                        disabled={!editing}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: "7em" }}
                        value={!editing ? link.type : undefined}
                        defaultValue={editing ? link.type : undefined}
                        onChange={(e) => {
                          setModifiedAlert({
                            ...modifiedAlert,
                            links: modifiedAlert.links.map((l) => {
                              if (l === link) {
                                return {
                                  ...l,
                                  type: e.target.value as BootstrapAlertType,
                                };
                              } else {
                                return l;
                              }
                            }),
                          });
                        }}
                        disabled={!editing}
                      >
                        {BoostrapAlertTypes.map((type) => {
                          return (
                            <option value={type} key={type}>
                              {type}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="url"
                        className="form-control"
                        style={{ width: "8em" }}
                        value={!editing ? link.url : undefined}
                        defaultValue={editing ? link.url : undefined}
                        onBlur={(e) => {
                          setModifiedAlert({
                            ...modifiedAlert,
                            links: modifiedAlert.links.map((l) => {
                              if (l === link) {
                                return {
                                  ...l,
                                  url: e.target.value,
                                };
                              } else {
                                return l;
                              }
                            }),
                          });
                        }}
                        disabled={!editing}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="alert alert-primary mb-0" role="alert">
                    {editing ? (
                      "No links found, try adding one!"
                    ) : (
                      <em>No links</em>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {editing ? (
          <button
            type="button"
            className="btn btn-sm btn-success"
            disabled={state?.status !== "loaded"}
            onClick={() => {
              setModifiedAlert({
                ...modifiedAlert,
                links: [
                  ...modifiedAlert.links,
                  { name: "New link", type: "primary", url: "/" },
                ],
              });
            }}
          >
            New link
          </button>
        ) : undefined}
      </td>
    </tr>
  );
}

export function WebsiteAlertTableRows(): React.ReactNode {
  const state = React.useContext(WebsiteAlertManagerStateStoreContext);
  // const functions = React.useContext(WebsiteAlertManagerStateFunctionsContext);

  return state?.alerts.map((alert) => {
    return <WebsiteAlertTableRow alert={alert} key={JSON.stringify(alert)} />;
  });
}
