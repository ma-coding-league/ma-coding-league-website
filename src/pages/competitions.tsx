import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";

const pageName = "Competitions";

type HomeProps = { appProps: AppProps };

export default function Competitions({ appProps }: HomeProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is a list of all Massachusetts Coding League competitions!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Competitions, MA Coding League Competitions, Massachusetts Coding League Competitions"
    >
      <h1>Competitions</h1>
      <p>Here is a list of all Massachusetts Coding League competitions!</p>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: HomeProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
