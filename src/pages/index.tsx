import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";

const pageName = "Home";

type HomeProps = { appProps: AppProps };

export default function Home({ appProps }: HomeProps): React.ReactNode {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is the home of the Massachusetts Coding League!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website"
    >
      <h1>Welcome to the Massachusetts Coding League!</h1>
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
