import React from "react";
import Layout from "@/components/Layout";
import getAppProps, { AppProps } from "@/components/WithAppProps";
import Link from "next/link";

const pageName = "Team application help";

export function TeamApplicationHelp({
  appProps,
}: {
  appProps: AppProps;
}): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Application help to apply your team for the Massachusetts Coding League."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Help, Application help, Team application help, Team application help page"
      breadCrumbs={[
        { Help: "/help" },
        { "Application help": "/help/application" },
        { "Team application help": "/help/application/teams" },
      ]}
    >
      <h1>{pageName}</h1>
      <p>
        You can view a list of all the high school teams in the MCL{" "}
        <Link href="/teams">here</Link>.
      </p>
      <h2>Requirements</h2>
      <ul>
        <li>Must be a high school club in Massachusetts.</li>
      </ul>
      <h2>Apply</h2>
      <p>
        In order to apply, have your teacher email the MA Coding League email
        address:{" "}
        <a
          href="mailto:macodingleague@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>macodingleague@gmail.com</code>
        </a>
      </p>
      <p>
        If you have any problems, you can email us at{" "}
        <a
          href="mailto:macodingleague@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>macodingleague@gmail.com</code>
        </a>{" "}
        or create an issue on the{" "}
        <a
          href="https://github.com/ma-coding-league/ma-coding-league-website/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>
        .
      </p>
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

export default TeamApplicationHelp;
