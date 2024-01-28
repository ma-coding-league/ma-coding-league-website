import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import MCLCompetitionYearsRenderer from "@/components/MCLCompetition/CompetitionYears/MCLCompetitionYearsRenderer";
import MCLCompetitionsRenderer from "@/components/MCLCompetition/Competitions/MCLCompetitionsRenderer";
import getCompetitionYears, {
  MCLCompetitionsYear,
} from "@/scripts/MCLCompetition/CompetitionYears/getCompetitionYears";
import getCompetitionWithResult, {
  MCLCompetitionWithResult,
} from "@/scripts/MCLCompetition/Competitions/getCompetitions";

const pageName = "Competitions";

type CompetitionsProps = {
  appProps: AppProps;
  years: MCLCompetitionsYear[];
  currentYear: {
    yearFull: string;
    competitions: MCLCompetitionWithResult[];
  };
};

export default function Competitions({
  appProps,
  years,
  currentYear,
}: CompetitionsProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is a list of all Massachusetts Coding League competitions!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions"
    >
      <h1>Competitions</h1>
      <p>
        Here is where you can find all the competitions for any school year.
      </p>
      <div className="mb-3">
        <h2>{currentYear.yearFull} year</h2>
        <MCLCompetitionsRenderer
          currentYear={currentYear.yearFull}
          competitions={currentYear.competitions}
        />
      </div>
      <div>
        <h2>All years</h2>
        <p>
          These are links to all of the competition years. Click on one to view
          all the competitions of that year.
        </p>
        <MCLCompetitionYearsRenderer years={years} />
      </div>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: CompetitionsProps }> {
  const compYears = await getCompetitionYears(
    process.env.NEXT_PUBLIC_GSHEET_MCL_COMPETITION_YEARS!,
  );

  return {
    props: {
      appProps: await getAppProps(),
      years: compYears,
      currentYear: {
        yearFull: compYears[0].yearFull,
        competitions: await getCompetitionWithResult(
          compYears[0].competitionGSheetID,
        ),
      },
    },
  };
}
