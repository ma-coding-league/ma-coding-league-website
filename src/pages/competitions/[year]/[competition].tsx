import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import getCompetitionYears from "@/scripts/MCLCompetition/CompetitionYears/getCompetitionYears";
import getCompetitions from "@/scripts/MCLCompetition/Competitions/getCompetitions";
import getCompetitionWithResult, {
  MCLCompetitionWithResult,
} from "@/scripts/MCLCompetition/CompetitionWithResult/getCompetitionWithResult";
import { createBreadCrumbSegment } from "@/components/Layout/layout";

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
      description={`These are all the ${year} competitions in Massachusetts Coding League!`}
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions"
      breadCrumbs={breadCrumbs}
    >
      <h1>{pageName}</h1>
    </Layout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: CompetitionParams;
}): Promise<{ props: CompetitionProps }> {
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
  };
}

export async function getStaticPaths(): Promise<{
  paths: { params: CompetitionParams }[];
  fallback: boolean;
}> {
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
    fallback: false,
  };
}
