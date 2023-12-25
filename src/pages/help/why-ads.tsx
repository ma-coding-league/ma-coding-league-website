import React from "react";
import Layout from "../../components/Layout";
import getAppProps, { AppProps } from "../../components/WithAppProps";

const pageName = "Why ads?";

export function Help({ appProps }: { appProps: AppProps }): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="The Massachusetts Coding League websites's page on why we have ads."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Ads, Why ads"
      dontShowAdblockerWarning
    >
      <h1>{pageName}</h1>
      <p>
        Hey there! It looks like you are using an ad blocker, which we totally
        understand! I personally use ad blockers too! We know that ads can be
        annoying.
      </p>
      <p>
        The ads do support the development of our website - as a developer in
        high school, it would be a big help if you turned off your ad blocker.
        You can turn your ad blocker back on whenever you want to. We understand
        that it is your device though, and it is your right to run whatever
        programs you desire.
      </p>
      <p>
        If you do decide to keep your ad blocker on, another way you can support
        us is to spread the word about the Massachusettss Coding League!
      </p>
      <p>Thanks for helping us out!</p>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: { appProps: AppProps };
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}

export default Help;
