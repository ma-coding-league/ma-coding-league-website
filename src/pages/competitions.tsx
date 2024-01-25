import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import MCLCompetitionYearsProvider from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearProvider";
import MCLCompetitionYearsRenderer from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearsRenderer";

const pageName = "Competitions";

type CompetitionsProps = { appProps: AppProps };

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
      <MCLCompetitionYearsProvider
        compYearsGSheetID={
          process.env.NEXT_PUBLIC_GSHEET_MCL_COMPETITION_YEARS!
        }
      >
        <CompetitionsContent />
      </MCLCompetitionYearsProvider>
    </Layout>
  );
}

function CompetitionsContent(): JSX.Element {
  return (
    <>
      <h1>Competitions</h1>
      <h2>Years</h2>
      <p>
        These are links to all of the competition years! Click on one to view
        all the competitions of that year!
      </p>
      <MCLCompetitionYearsRenderer />
    </>
  );
}

export async function getStaticProps(): Promise<{ props: CompetitionsProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
