import { UserSideSubmission } from "@/scripts/API/Submissions/UserSide";
import ErrorBoundary from "@/components/ErrorBoundary";
import React from "react";
import {
  getUserSideCompetitionByNameFromAPI,
  UserSideCompetition,
} from "@/scripts/API/Competitions/UserSide";

export default function SubmissionsTable({
  name,
}: {
  name: string;
}): React.ReactNode {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [competition, setCompetition] =
    React.useState<UserSideCompetition | null>();
  const [submissions, setSubmissions] = React.useState<UserSideSubmission[]>(
    [],
  );

  React.useEffect(() => {
    setState("loading");
    setCompetition(null);
    setSubmissions([]);
    getUserSideCompetitionByNameFromAPI(name)
      .then((comp) => {
        if (comp === null) {
          throw new Error("Competition not found");
        }
        setCompetition(comp);
        setSubmissions(
          comp.submissions?.sort((a, b) => {
            const aScore = (a.scoreNumerator ?? -1) / (a.scoreDenominator ?? 1);
            const bScore = (b.scoreNumerator ?? -1) / (b.scoreDenominator ?? 1);
            if (aScore === bScore) {
              return a.team.localeCompare(b.team);
            }
            return bScore - aScore;
          }) ?? [],
        );
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className="table-responsive">
        {(() => {
          switch (state) {
            case "loading":
              return (
                <table className="table table-striped table-hover placeholder-glow">
                  <thead>
                    <tr>
                      <th scope="col">Team</th>
                      <th scope="col">Score</th>
                      <th scope="col">Submission URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const row = (
                        <tr>
                          <td>
                            <span className="placeholder col-5" />
                          </td>
                          <td>
                            <span className="placeholder col-3" />
                          </td>
                          <td>
                            <span className="placeholder col-8" />
                          </td>
                        </tr>
                      );
                      return (
                        <>
                          {row}
                          {row}
                          {row}
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              );
            case "loaded":
              return (
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Team</th>
                      <th scope="col">Score</th>
                      <th scope="col">Submission URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competition?.showSubmissions ? (
                      submissions.map((sub) => {
                        return (
                          <tr key={sub.team}>
                            <td>{sub.team}</td>
                            <td>
                              {competition.showResults ? (
                                <>
                                  {sub.scoreNumerator !== null ? (
                                    sub.scoreNumerator
                                  ) : (
                                    <em>No score</em>
                                  )}{" "}
                                  /{" "}
                                  {sub.scoreDenominator !== null ? (
                                    sub.scoreDenominator
                                  ) : (
                                    <em>No score denominator</em>
                                  )}
                                </>
                              ) : (
                                <em>Scores hidden.</em>
                              )}
                            </td>
                            <td>
                              {competition.showSubmissions ? (
                                sub.submissionURL !== null ? (
                                  <a
                                    href={sub.submissionURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {sub.submissionURL}
                                  </a>
                                ) : (
                                  <em>No submission.</em>
                                )
                              ) : (
                                <em>Submissions hidden.</em>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3}>
                          <div
                            className="alert alert-secondary m-0"
                            role="alert"
                          >
                            Submissions hidden!
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              );
            default:
            case "error":
              return (
                <div className="alert alert-warning" role="alert">
                  Error fetching submissions, try refreshing the page!
                </div>
              );
          }
        })()}
      </div>
    </ErrorBoundary>
  );
}
