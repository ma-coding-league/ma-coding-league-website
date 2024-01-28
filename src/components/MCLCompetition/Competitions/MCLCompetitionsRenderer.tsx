import MCLCompetitionCard, {
  MCLCompetition,
} from "../Competition/MCLCompetitionRenderer";
import React from "react";

export default function MCLCompetitionsRenderer({
  currentYear,
  competitions,
}: {
  currentYear: string;
  competitions: MCLCompetition[];
}): JSX.Element {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {competitions.map((comp) => {
        return !comp.hideThisOnWebsite ? (
          <MCLCompetitionCard
            currentYear={currentYear}
            competition={comp}
            key={`${comp.place}+${comp.startingTime}+${comp.theme}`}
          />
        ) : (
          <></>
        );
      })}
    </div>
  );
}
