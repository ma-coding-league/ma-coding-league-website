import MCLCompetitionCard from "../Competition/MCLCompetitionRenderer";
import { MCLCompetitionsContext } from "./MCLCompetitionsProvider";
import React from "react";

export default function MCLCompetitionsRenderer(): JSX.Element {
  const comps = React.useContext(MCLCompetitionsContext);

  switch (comps.state) {
    case "loading":
      return <p>Loading...</p>;
    case "loaded":
      return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {comps.competitions.map((comp) => {
            return !comp.hideThisOnWebsite ? (
              <MCLCompetitionCard
                competition={comp}
                key={`${comp.place}+${comp.startingTime}+${comp.theme}`}
              />
            ) : (
              <></>
            );
          })}
        </div>
      );
    case "error":
      return (
        <div className="alert alert-warning" role="alert">
          There was a problem loading all the competitions of this year, try
          refreshing the page!
        </div>
      );
  }
}
