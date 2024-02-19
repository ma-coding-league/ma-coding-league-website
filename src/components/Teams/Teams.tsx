import React from "react";
import getTeamsFromAPI, { Team } from "@/scripts/API/Teams";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function TeamsTable(): React.ReactNode {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [teams, setTeams] = React.useState<Team[]>([]);

  React.useEffect(() => {
    setState("loading");
    setTeams([]);
    getTeamsFromAPI()
      .then((teams) => {
        setTeams(teams);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        {(() => {
          switch (state) {
            case "loading":
              return (
                <table className="table table-striped table-hover placeholder-glow">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const row = (
                        <tr>
                          <td>
                            <span className="placeholder col-3" />
                          </td>
                        </tr>
                      );
                      return (
                        <>
                          {row}
                          {row}
                          {row}
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              );
            case "loaded":
              return (
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => {
                      return (
                        <tr key={team.id}>
                          <td>{team.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            default:
            case "error":
              return (
                <div className="alert alert-warning" role="alert">
                  Error fetching teams, try refreshing the page!
                </div>
              );
          }
        })()}
      </div>
    </ErrorBoundary>
  );
}
