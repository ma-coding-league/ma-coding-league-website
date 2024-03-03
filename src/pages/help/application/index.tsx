import Link from "next/link";
import React from "react";
import Layout from "@/components/Layout";
import getAppProps, { AppProps } from "@/components/WithAppProps";

const pageName = "Application help";

export function ApplicationHelp({
  appProps,
}: {
  appProps: AppProps;
}): React.ReactNode {
  type HelpPage = {
    name: string;
    description: string;
    link: string;
    linkText: string;
  };

  const helpPages: HelpPage[] = [
    {
      name: "Apply for your high school team",
      description:
        "How to apply for your high school team to join the Massachusetts Coding League.",
      link: "/help/application/teams",
      linkText: "View help for applying your high school team",
    },
    {
      name: "Apply as an officer",
      description:
        "How to apply as an officer for the Massachusetts Coding League.",
      link: "/help/application/officer",
      linkText: "View help for applying as an officer",
    },
  ];

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Application help to join the Massachusetts Coding League."
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Help, Application help, Application help page"
      breadCrumbs={[
        { Help: "/help" },
        { "Application help": "/help/application" },
      ]}
    >
      <h1>{pageName}</h1>
      <div style={{ overflowX: "hidden" }}>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
          {helpPages.map((feature: HelpPage, index: number) => {
            return (
              <div className="col mb-3 mt-1" key={`help-card-${index}`}>
                <div className="card mb-2 h-100">
                  {/* <Image
                    src={feature.image}
                    alt={feature.altText}
                    className="card-img-top"
                    objectFit="cover"
                  /> */}
                  <h5 className="card-title m-3 mb-0">{feature.name}</h5>
                  <div className="card-body">
                    <div className="card-text">
                      <p>{feature.description}</p>
                    </div>
                    <Link href={feature.link} passHref legacyBehavior>
                      <a className="card-link stretched-link">
                        {feature.linkText}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

export default ApplicationHelp;
