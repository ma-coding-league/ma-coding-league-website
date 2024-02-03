import {
  BoostrapAlertTypes,
  WebsiteAlert,
} from "@/components/WebsiteAlerts/websiteAlertsAPI";
import React from "react";
import { WebsiteAlertRenderer } from "@/components/WebsiteAlerts/WebsiteAlerts";
import { nowBetween } from "@/scripts/Utils/DateAndTime/Helpers";
import getElement from "@/scripts/Utils/Element";

export function WebsiteAlertRowEditModal({
  alert,
}: {
  alert: WebsiteAlert;
}): JSX.Element {
  const [modifiedAlert, setModifiedAlert] = React.useState<WebsiteAlert>(alert);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    const onShow = () => {
      setModifiedAlert(structuredClone(alert));
      setShowPreview(false);
    };

    getElement(`editAlert${alert.id}`).addEventListener(
      "show.bs.modal",
      onShow,
    );

    return () => {
      getElement(`editAlert${alert.id}`).removeEventListener(
        "show.bs.modal",
        onShow,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal fade" id={`editAlert${alert.id}`}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {showPreview ? "Previewing" : "Editing"} website alert{" "}
              <code>{alert.id}</code>
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {showPreview ? (
              <div>
                <>
                  {/*<p>*/}
                  {/*  <code>{JSON.stringify(modifiedAlert, null, 2)}</code>*/}
                  {/*</p>*/}
                  {modifiedAlert.enable ? (
                    <p>
                      <em>Alert will be enabled.</em>
                    </p>
                  ) : (
                    <p>
                      <em>Alert will not be enabled.</em>
                    </p>
                  )}
                  {nowBetween(modifiedAlert.start, modifiedAlert.end) ? (
                    <p>
                      <em>Alert will be active.</em>
                    </p>
                  ) : (
                    <p>
                      <em>Alert will not be active.</em>
                    </p>
                  )}
                </>
                <p>
                  <em>Preview:</em>
                </p>
                <WebsiteAlertRenderer alert={modifiedAlert} forceExternal />
              </div>
            ) : (
              <form>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id={`editAlertEnableCheckInput${modifiedAlert.id}`}
                    className="form-check-input"
                    checked={modifiedAlert.enable}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        enable: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`editAlertEnableCheckInput${modifiedAlert.id}`}
                  >
                    Enable
                  </label>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`editAlertStartInput${modifiedAlert.id}`}
                    className="form-label"
                  >
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    id={`editAlertStartInput${modifiedAlert.id}`}
                    className="form-control"
                    value={modifiedAlert.start.toISOString().split(".")[0]}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        start: new Date(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`editAlertEndInput${modifiedAlert.id}`}
                    className="form-label"
                  >
                    End
                  </label>
                  <input
                    type="datetime-local"
                    id={`editAlertEndInput${modifiedAlert.id}`}
                    className="form-control"
                    value={modifiedAlert.end.toISOString().split(".")[0]}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        end: new Date(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`editAlertTypeSelect${modifiedAlert.id}`}
                    className="form-label"
                  >
                    Type
                  </label>
                  <select
                    id={`editAlertTypeSelect${modifiedAlert.id}`}
                    className="form-select"
                    value={modifiedAlert.type}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        // @ts-ignore
                        type: e.target.value,
                      });
                    }}
                  >
                    {BoostrapAlertTypes.map((type) => {
                      return (
                        <option value={type} key={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id={`editAlertCanHideCheckInput${modifiedAlert.id}`}
                    className="form-check-input"
                    checked={modifiedAlert.canHide}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        canHide: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`editAlertCanHideCheckInput${modifiedAlert.id}`}
                  >
                    Can hide
                  </label>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    htmlFor={`editAlertContextTextarea${modifiedAlert.id}`}
                  >
                    Content
                  </label>
                  <textarea
                    className="form-control"
                    id={`editAlertContextTextarea${modifiedAlert.id}`}
                    value={modifiedAlert.content}
                    onChange={(e) => {
                      setModifiedAlert({
                        ...modifiedAlert,
                        content: e.target.value,
                      });
                    }}
                    rows={3}
                  />
                  <div id="passwordHelpBlock" className="form-text">
                    Markdown, extended / {'"'}GitHub{'"'} markdown, and LaTeX is
                    supported.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    htmlFor={`editAlertLinksTextarea${modifiedAlert.id}`}
                  >
                    Links
                  </label>
                  <textarea
                    className="form-control"
                    id={`editAlertContextTextarea${modifiedAlert.id}`}
                    value={JSON.stringify(modifiedAlert.links, null, 2)}
                    onChange={(e) => {
                      try {
                        setModifiedAlert({
                          ...modifiedAlert,
                          links: JSON.parse(e.target.value),
                        });
                      } catch (_) {}
                    }}
                    rows={3}
                  />
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowPreview(!showPreview);
              }}
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" className="btn btn-success">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsiteAlertRow({
  alert,
}: {
  alert: WebsiteAlert;
}): JSX.Element {
  return (
    <tr>
      <td>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            data-bs-toggle="modal"
            data-bs-target={`#editAlert${alert.id}`}
          >
            Edit
          </button>
          <button type="button" className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </td>
      <th scope="row">
        <code>{alert.id}</code>
      </th>
      <td>
        <input
          type="checkbox"
          className="form-check-input"
          defaultChecked={alert.enable}
          disabled={true}
        />
      </td>
      <td>
        <input
          type="datetime-local"
          className="form-control"
          defaultValue={alert.start.toISOString().split(".")[0]}
          disabled={true}
        />
      </td>
      <td>
        <input
          type="datetime-local"
          className="form-control"
          defaultValue={alert.end.toISOString().split(".")[0]}
          disabled={true}
        />
      </td>
      <td>
        <select
          className="form-select"
          defaultValue={alert.type}
          disabled={true}
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
          defaultChecked={alert.canHide}
          disabled={true}
        />
      </td>
      <td>
        <textarea
          className="form-control"
          rows={1}
          defaultValue={alert.content}
          disabled={true}
        />
      </td>
      <td>
        <textarea
          className="form-control"
          rows={1}
          defaultValue={JSON.stringify(alert.links, null, 2)}
          disabled={true}
        />
      </td>
    </tr>
  );
}
