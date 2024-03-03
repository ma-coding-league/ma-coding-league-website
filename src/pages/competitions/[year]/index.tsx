import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getCompetitionYearsAsServer } from "@/database/competitions";
import { getXataClient } from "@/xata";
import CompetitionsYear from "@/components/Competitions/UserFacing/Components/CompetitionsYear";
import { createBreadCrumbSegment } from "@/components/Layout/layout";

type CompetitionYearProps = {
  year: string;
  appProps: AppProps;
};

type CompetitionYearParams = {
  year: string;
};

export default function CompetitionYear({
  year,
  appProps,
}: CompetitionYearProps): React.ReactNode {
  const pageName = `${year} competitions`;

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description={`This is a list of all Massachusetts Coding League ${year} competitions!`}
      keywords={`MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions, ${year} competitions, ${year}`}
      breadCrumbs={[
        { Competitions: "/competitions" },
        createBreadCrumbSegment(year, `/competitions/${year}`),
      ]}
    >
      <h1>{pageName}</h1>
      <CompetitionsYear year={year} />
    </Layout>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<CompetitionYearParams>): Promise<
  GetStaticPropsResult<CompetitionYearProps>
> {
  const year = params!.year;

  return {
    props: {
      year,
      appProps: await getAppProps(),
    },
    revalidate: 30,
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<CompetitionYearParams>
> {
  const xata = getXataClient();
  const years = await getCompetitionYearsAsServer(xata);

  return {
    paths: years.map((year) => {
      return { params: { year } };
    }),
    fallback: "blocking",
  };
}
