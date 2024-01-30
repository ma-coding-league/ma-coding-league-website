import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import getCompetitionYears from "@/scripts/MCLCompetition/getCompetitionYears";
import getCompetitions from "@/scripts/MCLCompetition/getCompetitions";
import getCompetitionWithResult, {
  MCLCompetitionWithResult,
} from "@/scripts/MCLCompetition/getCompetitionWithResult";
import { createBreadCrumbSegment } from "@/components/Layout/layout";
import { formatDateLong, formatTime } from "@/scripts/Utils/DateAndTime/Format";
import { dp, isBeforeNow } from "@/scripts/Utils/DateAndTime/Helpers";
import MCLCompetitionResultRenderer from "@/components/MCLCompetition/MCLCompetitionResultRenderer";
import { GetStaticPathsResult, GetStaticPropsResult } from "next";

type CompetitionParams = {
  year: string;
  competition: string;
};

type CompetitionProps = {
  appProps: AppProps;
  year: string;
  competition: MCLCompetitionWithResult;
};

export default function Competition({
  appProps,
  year,
  competition,
}: CompetitionProps): JSX.Element {
  const pageName = competition.name;
  const breadCrumbs: { [title: string]: string }[] = [
    { Competitions: "/competitions" },
  ];

  breadCrumbs.push(createBreadCrumbSegment(year, `/competitions/${year}`));
  breadCrumbs.push(
    createBreadCrumbSegment(
      competition.name,
      `/competitions/${year}/${competition.name}`,
    ),
  );

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description={`This is the Massachusetts Coding League's ${
        competition.name
      } ${competition.showResultOnWebsite ? "result" : "details"}`}
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions"
      breadCrumbs={breadCrumbs}
    >
      <h1>{pageName}</h1>
      <p>
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
        {isBeforeNow(dp(competition.startingTime))
          ? "Started"
          : "Starting"}: {formatTime(dp(competition.startingTime))}
        <br />
        {isBeforeNow(dp(competition.endingTime)) ? "Ended" : "Ending"}:{" "}
        {formatTime(dp(competition.endingTime))}
        <br />
        Theme: {competition.theme}
      </p>
      <h2>Submission</h2>
      <p>
        {competition.showSubmissionURLOnWebsite ? (
          <a
            href={competition.submissionURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter submission
          </a>
        ) : (
          <em>Submissions are not open.</em>
        )}
      </p>
      <h2>Results</h2>
      <p>
        {competition.showResultOnWebsite ? (
          <MCLCompetitionResultRenderer result={competition.result} />
        ) : (
          <em>Results not made available yet.</em>
        )}
      </p>
    </Layout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: CompetitionParams;
}): Promise<GetStaticPropsResult<CompetitionProps>> {
  const year = params.year;
  const competition = params.competition;

  const compYears = await getCompetitionYears(
    process.env.NEXT_PUBLIC_GSHEET_MCL_COMPETITION_YEARS!,
  );

  const gSheetID = compYears.find((compYear) => {
    return compYear.yearFull === year;
  })!.competitionGSheetID;

  return {
    props: {
      appProps: await getAppProps(),
      year: year,
      competition: await getCompetitionWithResult(gSheetID, competition),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<CompetitionParams>
> {
  const paths: { params: CompetitionParams }[] = [];

  const compYears = (
    await getCompetitionYears(
      process.env.NEXT_PUBLIC_GSHEET_MCL_COMPETITION_YEARS!,
    )
  ).filter((year) => {
    return !year.hide;
  });

  for (const year of compYears) {
    for (const comp of await getCompetitions(year.competitionGSheetID)) {
      paths.push({
        params: {
          year: year.yearFull,
          competition: comp.name,
        },
      });
    }
  }

  // console.log(JSON.stringify(paths, null));

  return {
    paths,
    fallback: "blocking",
  };
}
