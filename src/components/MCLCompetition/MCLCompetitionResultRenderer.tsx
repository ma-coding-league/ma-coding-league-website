import { MCLCompetitionResult } from "@/scripts/MCLCompetition/getCompetitionWithResult";
import React from "react";

export default function MCLCompetitionResultRenderer({
  result,
}: {
  result: MCLCompetitionResult;
}): JSX.Element {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Place</th>
            <th scope="col">Team</th>
            <th scope="col">Score</th>
            <th scope="col">Submission URL</th>
          </tr>
        </thead>
        <tbody>
          {result.map((team, index) => {
            return (
              <tr key={`${team.team}+${team.score}+${team.submissionURL}`}>
                <th scope="row">{index + 1}</th>
                <td>{team.team}</td>
                <td>{team.score}</td>
                <td>
                  <a
                    href={team.submissionURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {team.submissionURL}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
