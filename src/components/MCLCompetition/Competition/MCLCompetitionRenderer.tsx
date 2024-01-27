import { formatDateLong, formatTime } from "@/scripts/Utils/DateAndTime/Format";
import Link from "next/link";
import React from "react";
import { MCLCompetitionYearsContext } from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearsProvider";
import { isBeforeNow } from "@/scripts/Utils/DateAndTime/Helpers";

export type MCLCompetition = {
  name: string;
  place: string;
  date: Date;
  startingTime: Date;
  endingTime: Date;
  hideThisOnWebsite: boolean;
  showResultOnWebsite: boolean;
  theme: string;
};

export default function MCLCompetitionCard({
  competition,
}: {
  competition: MCLCompetition;
}): JSX.Element {
  const years = React.useContext(MCLCompetitionYearsContext);

  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{competition.name}</h5>
          <p className="card-text">
            Place:{" "}
            <a
              href={`https://www.google.com/maps/search/${competition.place}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {competition.place}
            </a>
            <br />
            Date: {formatDateLong(competition.date)}
            <br />
            {isBeforeNow(competition.startingTime)
              ? "Started"
              : "Starting"}: {formatTime(competition.startingTime)}
            <br />
            {isBeforeNow(competition.endingTime) ? "Ended" : "Ending"}:{" "}
            {formatTime(competition.endingTime)}
            <br />
            Theme: {competition.theme}
          </p>
          {competition.showResultOnWebsite ? (
            <Link
              href={`/competitions/${years.years[0].yearFull}/${competition.name}`}
              className="card-link"
            >
              View results
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
