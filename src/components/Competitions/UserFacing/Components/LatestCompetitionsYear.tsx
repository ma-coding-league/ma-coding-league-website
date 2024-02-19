import { CompetitionYearsContext } from "@/components/Competitions/UserFacing/Context/CompetitionYearsContext";
import React from "react";
import CompetitionsYear from "@/components/Competitions/UserFacing/Components/CompetitionsYear";

export default function LatestCompetitionsYear(): React.ReactNode {
  const years = React.useContext(CompetitionYearsContext);

  switch (years.state) {
    case "loading":
      return (
        <div className="mb-2">
          <h2 className="placeholder-glow">
            <span className="placeholder col-6" />
          </h2>
        </div>
      );
    case "loaded":
      return years.years.length > 0 ? (
        <div className="mb-2">
          <h2>{years.years[0]} competitions</h2>
          <CompetitionsYear year={years.years[0]} />
        </div>
      ) : (
        <div className="alert alert-secondary mb-2" role="alert">
          No competition years found, try checking back later!
        </div>
      );
    default:
    case "error":
      return (
        <div className="alert alert-warning mb-2" role="alert">
          Error fetching competition years, try refreshing the page!
        </div>
      );
  }
}
