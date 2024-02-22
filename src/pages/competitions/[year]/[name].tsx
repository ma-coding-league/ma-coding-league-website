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

  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [competition, setCompetition] =
    React.useState<UserSideCompetition | null>(null);

  React.useEffect(() => {
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
                <a
                  href={`https://www.google.com/maps/search/${
                    competition!.location
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {competition!.location}
                </a>
                <br />
                Start:{" "}
                {competition!.start ? (
                  formatDateAndTime(competition!.start)
                ) : (
                  <em>Not set.</em>
                )}
                <br />
                End:{" "}
                {competition!.end ? (
                  formatDateAndTime(competition!.end)
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
      <h2>Results</h2>
      <SubmissionsTable name={name} />
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
