import getAppProps, { AppProps } from "@/components/WithAppProps";
import Layout from "@/components/Layout";
import { createBreadCrumbSegment } from "@/components/Layout/layout";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getXataClient } from "@/xata";
import {
  getCompetitionNamesAsServer,
  getCompetitionYearsAsServer,
} from "@/database/competitions";
import {
  getUserSideCompetitionByNameFromAPI,
  UserSideCompetition,
} from "@/scripts/API/Competitions/UserSide";
import React from "react";
import {
  formatDateAndTime,
  formatDuration,
} from "@/scripts/Utils/DateAndTime/Format";
import SubmissionsTable from "@/components/Submissions";
import { isAfterNow, isBeforeNow } from "@/scripts/Utils/DateAndTime/Helpers";
import SubmitYourCode from "@/components/Submissions/SubmitYourCode";
import { TextCountdown, TextCountup } from "@/components/TextCountFromDate";
import { BootstrapLibContext } from "@/pages/_app";
import ViewYourCode from "@/components/Submissions/ViewYourCode";

type CompetitionProps = {
  name: string;
  year: string;
  appProps: AppProps;
};

type CompetitionParams = {
  name: string;
  year: string;
};

export default function Competition({
  name,
  year,
  appProps,
}: CompetitionProps): React.ReactNode {
  const pageName = name;
  const bootstrapLib = React.useContext(BootstrapLibContext);

  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [competition, setCompetition] =
    React.useState<UserSideCompetition | null>(null);

  const refreshCompetition = () => {
    setCompetition(null);
    setState("loading");
    getUserSideCompetitionByNameFromAPI(name)
      .then((comp) => {
        setCompetition(comp);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setCompetition(null);
        setState("error");
      });
  };

  React.useEffect(() => {
    refreshCompetition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description={`This is the page for the ${name}!`}
      keywords={`MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions, ${name}`}
      breadCrumbs={[
        { Competitions: "/competitions" },
        createBreadCrumbSegment(year, `/competitions/${year}`),
        createBreadCrumbSegment(name, `/competitions/${year}/${name}`),
      ]}
    >
      <h1>{pageName}</h1>
      {(() => {
        switch (state) {
          case "loading":
            return (
              <p className="placeholder-glow">
                Location: <span className="placeholder col-6" />
                <br />
                Start: <span className="placeholder col-4" />
                <br />
                End: <span className="placeholder col-4" />
                <br />
                Theme: <span className="placeholder col-8" />
              </p>
            );
          case "loaded":
            return (
              <p className="placeholder-glow">
                Location:{" "}
                {["remote", "online"].includes(
                  competition!.location?.trim().toLowerCase() as string,
                ) ? (
                  <em>{competition!.location}</em>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/${
                      competition!.location
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {competition!.location}
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
                        (ends in{" "}
                        <TextCountdown
                          date={competition!.end}
                          onEnd={() => {
                            if (bootstrapLib !== null) {
                              const modal =
                                bootstrapLib.Modal.getOrCreateInstance(
                                  "#submitCodeModal",
                                );
                              modal.hide();
                            }
                            refreshCompetition();
                          }}
                        />
                        )
                      </>
                    ) : null}
                  </>
                ) : (
                  <em>Not set.</em>
                )}
                {competition!.start && competition!.end ? (
                  <>
                    <br />
                    Duration:{" "}
                    {formatDuration(
                      (competition!.end as unknown as number) -
                        (competition!.start as unknown as number),
                    )}
                  </>
                ) : null}
                <br />
                Theme:{" "}
                {!competition!.showTheme ? (
                  <em>(hidden)</em>
                ) : competition!.theme !== null ? (
                  competition!.theme
                ) : (
                  <em>Not set.</em>
                )}
              </p>
            );
          default:
          case "error":
            return (
              <div className="alert alert-warning" role="alert">
                Error fetching competition information, try refreshing the page!
              </div>
            );
        }
      })()}
      <h2>Submit your code</h2>
      {(() => {
        switch (state) {
          case "loading":
            return (
              <div className="alert alert-secondary" role="alert">
                Loading...
              </div>
            );
          case "loaded":
            if (!competition!.end || !competition!.start) {
              return (
                <p>
                  <em>No dates set.</em>
                </p>
              );
            } else if (isBeforeNow(competition!.end)) {
              return (
                <>
                  <p>
                    <em>Competition has ended!</em>
                  </p>
                  {competition!.showSubmissions ? (
                    <p>
                      Since results have been released, there is no need to
                      input a passcode anymore!
                    </p>
                  ) : (
                    <>
                      <p>
                        Since results have not been released yet, you need your
                        team{"'"}s passcode to view your own team{"'"}s code,
                        click the button below!
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary mb-3"
                        data-bs-toggle="modal"
                        data-bs-target="#viewCodeModal"
                      >
                        View your code
                      </button>
                      <ViewYourCode
                        id="viewCodeModal"
                        competition={competition!}
                      />
                    </>
                  )}
                </>
              );
            } else if (isAfterNow(competition!.start)) {
              return (
                <p>
                  <em>Competition has not begun yet!</em>
                </p>
              );
            } else {
              return (
                <div>
                  <p>Submissions are open!</p>
                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#submitCodeModal"
                  >
                    Open submission form
                  </button>
                  <SubmitYourCode
                    id="submitCodeModal"
                    competition={competition!}
                  />
                </div>
              );
            }
          default:
          case "error":
            return (
              <div className="alert alert-warning" role="alert">
                Error fetching competition information, try refreshing the page!
              </div>
            );
        }
      })()}
      <h2>Results</h2>
      {(() => {
        switch (state) {
          case "loading":
            return (
              <div className="alert alert-secondary" role="alert">
                Loading...
              </div>
            );
          case "loaded":
            if (!competition!.end || !competition!.start) {
              return (
                <p>
                  <em>No dates set.</em>
                </p>
              );
            } else if (isBeforeNow(competition!.end)) {
              return <SubmissionsTable name={name} />;
            } else if (isBeforeNow(competition!.start)) {
              return (
                <p>
                  <em>Competition has not ended yet!</em>
                </p>
              );
            } else {
              return (
                <p>
                  <em>Competition has not begun yet!</em>
                </p>
              );
            }
          default:
          case "error":
            return (
              <div className="alert alert-warning" role="alert">
                Error fetching competition results, try refreshing the page!
              </div>
            );
        }
      })()}
    </Layout>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<CompetitionParams>): Promise<
  GetStaticPropsResult<CompetitionProps>
> {
  const name = params!.name;
  const year = params!.year;

  return {
    props: {
      name,
      year,
      appProps: await getAppProps(),
    },
    revalidate: 30,
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<CompetitionParams>
> {
  const xata = getXataClient();
  const years = await getCompetitionYearsAsServer(xata);

  const paths = [];

  for (const year of years) {
    const names = await getCompetitionNamesAsServer(xata, year);
    for (const name of names) {
      paths.push({ params: { name, year } });
    }
  }

  return {
    paths,
    fallback: "blocking",
  };
}
