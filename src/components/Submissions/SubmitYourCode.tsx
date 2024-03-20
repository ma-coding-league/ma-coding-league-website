import React from "react";
import TeamSelector from "@/components/Teams/TeamSelector";
import { isAfterNow } from "@/scripts/Utils/DateAndTime/Helpers";
import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";
import { TextCountdown } from "../TextCountFromDate";

export default function SubmitYourCode({
  id,
  competition,
}: {
  id: string;
  competition: UserSideCompetition;
}): React.ReactNode {
  // TODO: Handle submissions actually, on server and client, display messages, etc.
  //  and also show the currently submitted code as a certain time, and refresh button.

  const [teamSelectorState, setTeamSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [teamSelected, setTeamSelected] = React.useState<string | null>(null);
  const [canSubmit, setCanSubmit] = React.useState<boolean>(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCanSubmit(isAfterNow(competition.end!));
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [competition.end]);

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
              Submit your code
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
                  disabled={!canSubmit}
                />
              </div>
              <p>
                {canSubmit ? (
                  <>
                    You have <TextCountdown date={competition.end!} /> to submit
                    your code!
                  </>
                ) : (
                  <em>The competition has ended!</em>
                )}
              </p>
              <p>
                You can submit more than once, the last URL to be submitted
                before the competition ends will be the one that is graded.
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
              disabled={
                teamSelected === null ||
                teamSelectorState !== "loaded" ||
                !canSubmit
              }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
