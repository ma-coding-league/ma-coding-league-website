import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import CompetitionYears from "@/components/Competitions/UserFacing/Components/CompetitionYears";
import CompetitionYearsContextProvider from "@/components/Competitions/UserFacing/Context/CompetitionYearsContext";
import LatestCompetitionsYear from "@/components/Competitions/UserFacing/Components/LatestCompetitionsYear";
import { getUserTimezoneOffsetInHrs } from "@/scripts/Utils/DateAndTime/Helpers";

const pageName = "Competitions";

type CompetitionsProps = {
  appProps: AppProps;
};

export default function Competitions({
  appProps,
}: CompetitionsProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is a list of all Massachusetts Coding League competitions!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions"
    >
      <CompetitionYearsContextProvider>
        <h1>Competitions</h1>
        <p>
          Here is where you can find all the competitions for any school year.
        </p>
        <p>
          Times are shown in your current time zone:{" "}
          <code>{Intl.DateTimeFormat().resolvedOptions().timeZone}</code> (-
          {getUserTimezoneOffsetInHrs()} hours)
        </p>
        <LatestCompetitionsYear />
        <h2>All years</h2>
        <p>
          These are links to all of the competition years. Click on one to view
          all the competitions of that year!
        </p>
        <CompetitionYears />
      </CompetitionYearsContextProvider>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: CompetitionsProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
