import Link from "next/link";
import React from "react";
import Layout from "../../components/Layout";
import getAppProps, { AppProps } from "../../components/WithAppProps";

const pageName = "Help";

export function Help({ appProps }: { appProps: AppProps }): JSX.Element {
  const helpPages = {
    Legal: "/legal",
  };

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="The Massachusetts Coding League website's help page."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Help, Help page, Main help page"
    >
      <h1>{pageName}</h1>
      <ul>
        {Object.entries(helpPages).map(([name, page]) => {
          return (
            <li key={name}>
              <Link href={page.startsWith("/") ? page : `/help/${page}`}>
                {name}
              </Link>
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

export default Help;
