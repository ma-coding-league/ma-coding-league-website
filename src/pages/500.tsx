import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

const pageName = "Internal server error";

type InternalServerErrorProps = { appProps: AppProps };

export default function InternalServerError({
  appProps,
}: InternalServerErrorProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Oops! We couldn't serve this request!"
    >
      <h1>Internal server error</h1>
      <p>
        Sorry, an internal server error occured and we could not service your
        request.
      </p>
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
        in the GitHub repository.
      </p>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: InternalServerErrorProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
