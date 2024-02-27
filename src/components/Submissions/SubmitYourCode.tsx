import React from "react";
import TeamSelector from "@/components/Teams/TeamSelector";
import { isAfterNow } from "@/scripts/Utils/DateAndTime/Helpers";
import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";
import { TextCountdown } from "../TextCountFromDate";

export default function SubmitYourCode({
  competition,
}: {
  competition: UserSideCompetition;
}): React.ReactNode {
  // TODO: Handle submissions actually, on server and client, display messages, etc.

  const [teamSelectorState, setTeamSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [teamSelected, setTeamSelected] = React.useState<string | null>(null);
  const [canSubmit, setCanSubmit] = React.useState<boolean>(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCanSubmit(isAfterNow(competition.end!));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [competition.end]);

  return (
    <form className="container mx-0 px-0 mb-3">
      <div className="mb-2">
        <label className="form-label">Team</label>
        <TeamSelector
          setSelectedCallback={setTeamSelected}
          setStateCallback={setTeamSelectorState}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">URL</label>
        <input type="url" className="form-control" />
      </div>
      <div className="mb-2">
        <label className="form-label">Passcode</label>
        <input type="number" min={0} className="form-control" />
        <div className="form-text">
          This passcode, for verification purposes, should have been provided to
          your at the start of the competition.
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary mb-3"
        disabled={
          teamSelected === null || teamSelectorState !== "loaded" || !canSubmit
        }
      >
        Submit
      </button>
      <p>
        {canSubmit ? (
          <>
            You have <TextCountdown date={competition.end!} /> to submit your
            code!
          </>
        ) : (
          <em>The competition has ended!</em>
        )}
      </p>
      <p>
        You can submit more than once, the last URL to be submitted before the
        competition ends will be the one that is graded.
      </p>
    </form>
  );
}
