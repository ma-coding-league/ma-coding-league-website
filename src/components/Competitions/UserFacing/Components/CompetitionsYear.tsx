import React from "react";
import {
  getUserSideCompetitionsFromAPI,
  UserSideCompetition,
} from "@/scripts/API/Competitions/UserSide";
import Competition from "@/components/Competitions/UserFacing/Components/Competition";

export default function CompetitionsYear({
  year,
}: {
  year: string;
}): React.ReactNode {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [competitions, setCompetitions] = React.useState<UserSideCompetition[]>(
    [],
  );

  React.useEffect(() => {
    setState("loading");
    setCompetitions([]);
    getUserSideCompetitionsFromAPI(year)
      .then((competitions) => {
        setCompetitions(competitions);
        setState("loaded");
      })
      .catch(() => {
        setState("error");
        setCompetitions([]);
      });
  }, [year]);

  switch (state) {
    case "loading":
      return (
        <div className="alert alert-secondary" role="alert">
          Loading {year} competitions...
        </div>
      );
    case "loaded":
      return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4">
          {competitions.map((competition) => {
            return (
              <Competition key={competition.id} competition={competition} />
            );
          })}
        </div>
      );
    case "error":
      return (
        <div className="alert alert-warning" role="alert">
          Error fetching {year} competitions, try refreshing the page!
        </div>
      );
  }
}
