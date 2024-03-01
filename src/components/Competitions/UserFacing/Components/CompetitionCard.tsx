import { UserSideCompetition } from "@/scripts/API/Competitions/UserSide";
import React from "react";
import Link from "next/link";
import {
  formatDateAndTime,
  formatDuration,
} from "@/scripts/Utils/DateAndTime/Format";
import {
  isAfterNow,
  isBeforeNow,
  nowBetween,
} from "@/scripts/Utils/DateAndTime/Helpers";
import { TextCountdown, TextCountup } from "@/components/TextCountFromDate";

export default function CompetitionCard({
  competition,
}: {
  competition: UserSideCompetition;
}): React.ReactNode {
  const card = (
    <div className="card">
      {competition.start &&
      competition.end &&
      nowBetween(competition.start, competition.end) ? (
        <div className="card-header">Submissions open!</div>
      ) : null}
      <div className="card-body">
        <h5 className="card-title">{competition.name}</h5>
        <p className="card-text">
          Location:{" "}
          {["remote", "online"].includes(
            competition.location?.trim().toLowerCase() as string,
          ) ? (
            <em>{competition.location}</em>
          ) : (
            <a
              href={`https://www.google.com/maps/search/${competition.location}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {competition.location}
            </a>
          )}
          <br />
          Start:{" "}
          {competition!.start ? (
            <>
              {formatDateAndTime(competition!.start)}
              {competition!.end &&
              isBeforeNow(competition!.start) &&
              isAfterNow(competition!.end) ? (
                <>
                  {" "}
                  (started <TextCountup date={competition!.start} /> ago)
                </>
              ) : null}
              {isAfterNow(competition!.start) ? (
                <>
                  {" "}
                  (starts in <TextCountdown date={competition!.start} />
                  !)
                </>
              ) : null}
            </>
          ) : (
            <em>Not set.</em>
          )}
          <br />
          End:{" "}
          {competition!.end ? (
            <>
              {formatDateAndTime(competition!.end)}
              {competition!.start &&
              isBeforeNow(competition!.start) &&
              isAfterNow(competition!.end) ? (
                <>
                  {" "}
                  (ends in <TextCountdown date={competition!.end} />)
                </>
              ) : null}
            </>
          ) : (
            <em>Not set.</em>
          )}
          {competition.start && competition.end ? (
            <>
              <br />
              Duration:{" "}
              {formatDuration(
                (competition.end as unknown as number) -
                  (competition.start as unknown as number),
              )}
            </>
          ) : null}
          <br />
          Theme:{" "}
          {!competition.showTheme ? (
            <em>(hidden)</em>
          ) : competition.theme !== null ? (
            competition.theme
          ) : (
            <em>Not set.</em>
          )}
        </p>
        <Link
          href={`/competitions/${competition.yearRange}/${competition.name}`}
          className="card-link"
        >
          {(() => {
            if (
              competition!.start &&
              competition!.end &&
              isAfterNow(competition!.end) &&
              isBeforeNow(competition!.start)
            ) {
              return "Submit your code";
            } else if (competition.showResults) {
              return "View results";
            } else if (competition.showSubmissions) {
              return "View submissions";
            } else {
              return "View details";
            }
          })()}
        </Link>
      </div>
      {!competition.showThis ? (
        <div className="card-footer">Hidden from public!</div>
      ) : null}
    </div>
  );

  return (
    <div className="col">{competition.showThis ? card : <em>{card}</em>}</div>
  );
}
