import React from "react";
import getTeamsFromAPI, { Team } from "@/scripts/API/Teams";

export default function TeamSelector({
  setSelectedCallback,
  setStateCallback,
  disabled,
  hideRefreshButton,
}: {
  setSelectedCallback:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((team: string | null) => void);
  setStateCallback:
    | React.Dispatch<React.SetStateAction<"loading" | "loaded" | "error">>
    | ((state: "loading" | "loaded" | "error") => void);
  disabled?: boolean;
  hideRefreshButton?: boolean;
}): React.ReactNode {
  // TODO: Be able to specify competition to select teams from

  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [allTeams, setAllTeams] = React.useState<Team[]>([]);

  const refreshTeams = React.useCallback(() => {
    setAllTeams([]);
    setSelectedCallback(null);
    setStateCallback("loading");
    setState("loading");
    getTeamsFromAPI()
      .then((teams) => {
        setAllTeams(teams);
        setSelectedCallback(teams[0].name);
        setStateCallback("loaded");
        setState("loaded");
      })
      .catch((err) => {
        console.error("Failed to get teams");
        console.error(err);
        setAllTeams([]);
        setStateCallback("error");
        setState("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    refreshTeams();
  }, [refreshTeams]);

  return (
    <div className="row">
      <>
        {" "}
        <div className="col-auto">
          <select
            className="form-select"
            disabled={state !== "loaded" || disabled}
            defaultValue={state === "loaded" ? allTeams[0].name : "null"}
            onChange={(e) => {
              setSelectedCallback(e.target.value);
            }}
          >
            {(() => {
              switch (state) {
                case "loading":
                  return <option value="null">Loading...</option>;
                case "error":
                  return <option value="null">Error</option>;
                case "loaded":
                  return allTeams.map((team) => (
                    <option value={team.name} key={team.id}>
                      {team.name}
                    </option>
                  ));
              }
            })()}
          </select>
        </div>
        {hideRefreshButton ? (
          <></>
        ) : (
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={state === "loading" || disabled}
              onClick={() => {
                refreshTeams();
              }}
            >
              Refresh
            </button>
          </div>
        )}
      </>
    </div>
  );
}
