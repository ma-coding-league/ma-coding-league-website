import React from "react";
import Link from "next/link";
import { MCLCompetitionYearsContext } from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearProvider";

export default function MCLCompetitionYearsRenderer(): JSX.Element {
  const years = React.useContext(MCLCompetitionYearsContext);

  switch (years.state) {
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
    case "loaded":
      return (
        <ul>
          {years.years.map((year) => {
            return year.hide ? (
              <></>
            ) : (
              <li key={year.yearFull}>
                <Link href={`/competitions/${year.yearFull}`}>
                  {year.yearFull}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    case "error":
      return (
        <div className="alert alert-warning" role="alert">
          There was a problem loading all the competition years, try refreshing
          the page!
        </div>
      );
  }
}
