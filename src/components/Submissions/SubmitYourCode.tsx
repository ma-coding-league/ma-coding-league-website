import React from "react";
import TeamSelector from "@/components/Teams/TeamSelector";

export default function SubmitYourCode(): React.ReactNode {
  // TODO: Handle submissions actually, on server and client, display messages, etc.

  const [teamSelectorState, setTeamSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [teamSelected, setTeamSelected] = React.useState<string | null>(null);

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
        className="btn btn-primary"
        disabled={teamSelected === null || teamSelectorState !== "loaded"}
      >
        Submit
      </button>
    </form>
  );
}
