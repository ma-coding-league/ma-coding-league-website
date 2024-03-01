import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";
import React from "react";
import TeamSelector from "@/components/Teams/TeamSelector";

export default function ViewYourCode({
  id,
  competition,
}: {
  id: string;
  competition: UserSideCompetition;
}): React.ReactNode {
  // TODO: Handle viewing your submission, on server and client, display messages, etc.

  const [teamSelectorState, setTeamSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [teamSelected, setTeamSelected] = React.useState<string | null>(null);

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${id}Label`}>
              View your code
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form className="container mx-0 px-0 mb-3" id={`${id}Form`}>
              <div className="mb-2">
                <label className="form-label">Team</label>
                <TeamSelector
                  setSelectedCallback={setTeamSelected}
                  setStateCallback={setTeamSelectorState}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Passcode</label>
                <input type="number" min={0} className="form-control" />
                <div className="form-text">
                  This passcode, for verification purposes, should have been
                  provided to your at the start of the competition.
                </div>
              </div>
              <p>
                If you do not have a passcode for <b>your team</b>, you must
                wait until the results have been released. Check back later to
                see when they get released!
              </p>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              form={`${id}Form`}
              disabled={teamSelected === null || teamSelectorState !== "loaded"}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
