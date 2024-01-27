import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import MCLCompetitionYearsProvider, {
  MCLCompetitionYearsContext,
} from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearsProvider";
import MCLCompetitionYearsRenderer from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearsRenderer";
import MCLCompetitionsProvider from "@/components/MCLCompetition/Competitions/MCLCompetitionsProvider";
import MCLCompetitionsRenderer from "@/components/MCLCompetition/Competitions/MCLCompetitionsRenderer";

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
  const years = React.useContext(MCLCompetitionYearsContext);

  return (
    <>
      <h1>Competitions</h1>
      <p>
        Here is where you can find all the competitions for any school year.
      </p>
      <div className="mb-3">
        {(() => {
          switch (years.state) {
            case "error":
            case "loading":
              return <h2>Current year</h2>;
            case "loaded":
              return <h2>{years.years[0].yearFull} year</h2>;
          }
        })()}
        {(() => {
          switch (years.state) {
            case "error":
              return (
                <div className="alert alert-warning" role="alert">
                  There was a problem loading all the competitions of this year,
                  try refreshing the page!
                </div>
              );
            case "loading":
              return <p>Loading...</p>;
            case "loaded":
              return (
                <MCLCompetitionsProvider
                  compsGSheetID={years.years[0].competitionGSheetID}
                >
                  <MCLCompetitionsRenderer />
                </MCLCompetitionsProvider>
              );
          }
        })()}
      </div>
      <div>
        <h2>All years</h2>
        <p>
          These are links to all of the competition years. Click on one to view
          all the competitions of that year.
        </p>
        <MCLCompetitionYearsRenderer />
      </div>
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
