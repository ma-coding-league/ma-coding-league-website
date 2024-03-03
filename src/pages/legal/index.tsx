import Link from "next/link";
import React from "react";
import Layout from "../../components/Layout";
import getAppProps, { AppProps } from "../../components/WithAppProps";

const pageName = "Legal";

export function Legal({ appProps }: { appProps: AppProps }): React.ReactNode {
  const legalPages = {
    "External services and data collection":
      "external-services-and-data-collection",
    "Copyright policy": "copyright-policy",
    "Privacy policy": "privacy-policy",
    "Terms of service": "terms-of-service",
  };

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="The Massachusetts Coding League website's legal stuff page."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Legal, Legal stuff, legal stuff pages"
    >
      <h1>{pageName}</h1>
      <p>
        The source code for the Massachusetts Coding League website is licensed
        under the{" "}
        <a
          href="https://github.com/ma-coding-league/ma-coding-league-website/blob/main/LICENSE.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          GNU General Public License v3.0
        </a>
        .
      </p>
      <ul>
        {Object.entries(legalPages).map(([name, page]) => {
          return (
            <li key={name}>
              <Link href={`/legal/${page}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
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

export default Legal;
