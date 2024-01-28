import { formatDateLong, formatTime } from "@/scripts/Utils/DateAndTime/Format";
import Link from "next/link";
import React from "react";
import { dp, isBeforeNow } from "@/scripts/Utils/DateAndTime/Helpers";
import { MCLCompetition } from "@/scripts/MCLCompetition/Competitions/getCompetitions";

export default function MCLCompetitionCard({
  currentYear,
  competition,
}: {
  currentYear: string;
  competition: MCLCompetition;
}): JSX.Element {
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
            Date: {formatDateLong(dp(competition.date))}
            <br />
            {isBeforeNow(dp(competition.startingTime)) ? "Started" : "Starting"}
            : {formatTime(dp(competition.startingTime))}
            <br />
            {isBeforeNow(dp(competition.endingTime)) ? "Ended" : "Ending"}:{" "}
            {formatTime(dp(competition.endingTime))}
            <br />
            Theme: {competition.theme}
          </p>
          <Link
            href={`/competitions/${currentYear}/${competition.name}`}
            className="card-link"
          >
            {competition.showResultOnWebsite ? "View results" : "View details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
