import React from "react";
import Layout from "@/components/Layout";
import getAppProps, { AppProps } from "@/components/WithAppProps";
import Link from "next/link";

const pageName = "Officer application help";

export function OfficerApplicationHelp({
  appProps,
}: {
  appProps: AppProps;
}): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Application help to become an officer for the Massachusetts Coding League."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Help, Application help, Officer application help, Officer application help page"
      breadCrumbs={[
        { Help: "/help" },
        { "Application help": "/help/application" },
        { "Officer application help": "/help/application/officer" },
      ]}
    >
      <h1>{pageName}</h1>
      <p>
        You can view a list of all the officers and positions{" "}
        <Link href="/officers">here</Link>.
      </p>
      <p>
        Usually positions open up during May, check the page to see if a role is
        open for application!
      </p>
      <h2>Requirements</h2>
      <ul>
        <li>Must be a student of a high school in Massachusetts.</li>
        <li>Must be in 9th, 10th, or 11th grade.</li>
        <li>
          Certain officer roles may have more requirements, view the application
          document for more details.
        </li>
      </ul>
      <h2>Apply</h2>
      <p>
        In order to apply, copy and edit{" "}
        <a
          href="https://docs.google.com/document/d/1HTabB5oTZNeZpjDRSChQIG0WdPjKHIlSdH5HP36Mz2E/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          this document
        </a>{" "}
        and then email a PDF of it to the MA Coding League email address:{" "}
        <a
          href="mailto:macodingleague@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>macodingleague@gmail.com</code>
        </a>
      </p>
      <p>
        Deadlines for application will be posted at the top of the website.
        (usually by June) Check back to see the exact deadline if applications
        are open!
      </p>
      <p>
        You should receive an email of whether or not you were accepted. These
        emails are usually sent out a week after the application deadline. Check
        back to see when application acceptance emails will be sent.{" "}
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

export default OfficerApplicationHelp;
