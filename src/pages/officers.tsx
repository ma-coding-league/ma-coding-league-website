import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import OfficersList from "@/components/Officers";
import Link from "next/link";

const pageName = "Officers";

type OfficersProps = { appProps: AppProps };

export default function Officers({ appProps }: OfficersProps): React.ReactNode {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="This is a list of officers in the Massachusetts Coding League!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Officers, Officer list"
    >
      <h1>Officers</h1>
      <p>
        This is a list of all the officers in the Massachusetts Coding League!
      </p>
      <p>
        Want to apply for an open position? Check out{" "}
        <Link href="/help/application/officer">
          the help page on applying to become an officer!
        </Link>
      </p>
      <OfficersList />
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: OfficersProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
