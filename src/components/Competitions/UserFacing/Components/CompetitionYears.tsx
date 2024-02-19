import React from "react";
import Link from "next/link";
import { CompetitionYearsContext } from "@/components/Competitions/UserFacing/Context/CompetitionYearsContext";

export default function CompetitionYears(): React.ReactNode {
  const state = React.useContext(CompetitionYearsContext);

  switch (state.state) {
    case "loaded":
      return state.years.length > 0 ? (
        <ul>
          {state.years.map((year) => (
            <li key={year}>
              <Link href={`/competitions/${year}`}>{year}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-secondary" role="alert">
          No competition years found, try checking back later!
        </div>
      );
    case "loading":
      return (
        <ul className="placeholder-glow">
          <li>
            <span className="placeholder col-3" />
          </li>
          <li>
            <span className="placeholder col-3" />
          </li>
          <li>
            <span className="placeholder col-3" />
          </li>
        </ul>
      );
    default:
    case "error":
      return (
        <div className="alert alert-warning" role="alert">
          Error fetching competition years, try refreshing the page!
        </div>
      );
  }
}
