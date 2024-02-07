import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import TeamsTable from "@/components/Teams/Teams";

const pageName = "Teams";

type TeamsProps = { appProps: AppProps };

export default function Teams({ appProps }: TeamsProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is a list of high schools that are in the Massachusetts Coding League!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Teams, Team list, High schools, Participants"
    >
      <h1>Teams</h1>
      <p>
        This is a list of all the high schools that are in the Massachusetts
        Coding League!
      </p>
      <TeamsTable />
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: TeamsProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
