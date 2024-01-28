import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import MCLCompetitionsRenderer from "@/components/MCLCompetition/Competitions/MCLCompetitionsRenderer";
import getCompetitionYears from "@/scripts/MCLCompetition/CompetitionYears/getCompetitionYears";
import getCompetitions, {
  MCLCompetition,
} from "@/scripts/MCLCompetition/Competitions/getCompetitions";

type CompetitionYearParams = {
  year: string;
};

type CompetitionYearProps = {
  appProps: AppProps;
  year: string;
  competitions: MCLCompetition[];
};

export default function CompetitionYear({
  appProps,
  year,
  competitions,
}: CompetitionYearProps): JSX.Element {
  const pageName = `${year} competitions`;
  const breadCrumbs: { [title: string]: string }[] = [
    { Competitions: "/competitions" },
  ];
  const endBreadCrumb: { [title: string]: string } = {};
  endBreadCrumb[year] = `/competitions/${year}`;
  breadCrumbs.push(endBreadCrumb);

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
      <MCLCompetitionsRenderer currentYear={year} competitions={competitions} />
    </Layout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: CompetitionYearParams;
}): Promise<{ props: CompetitionYearProps }> {
  const year = params.year;

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
      competitions: await getCompetitions(gSheetID),
    },
  };
}

export async function getStaticPaths(): Promise<{
  paths: { params: CompetitionYearParams }[];
  fallback: boolean;
}> {
  const paths: { params: CompetitionYearParams }[] = [];

  const compYears = (
    await getCompetitionYears(
      process.env.NEXT_PUBLIC_GSHEET_MCL_COMPETITION_YEARS!,
    )
  ).filter((year) => {
    return !year.hide;
  });

  paths.push(
    ...compYears.map((year) => {
      return {
        params: {
          year: year.yearFull,
        },
      };
    }),
  );

  // console.log(JSON.stringify(paths, null));

  return {
    paths,
    fallback: false,
  };
}
