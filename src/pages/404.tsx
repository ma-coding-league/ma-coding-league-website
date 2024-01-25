import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

const pageName = "Page not found";

type PageNotFoundProps = { appProps: AppProps };

export default function PageNotFound({
  appProps,
}: PageNotFoundProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Oops! We couldn't find this page!"
    >
      <h1>Page not found</h1>
      <p>Sorry, we were unable to find the page you were looking for. </p>
      <p>
        Go back to <Link href="/">home</Link>?
      </p>
      <p>
        You can report{" "}
        <a
          href="https://github.com/ma-coding-league/ma-coding-league-website/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          issues
        </a>{" "}
        in the GitHub repository if you believe there should be a page here.
      </p>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: PageNotFoundProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
