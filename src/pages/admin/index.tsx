import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";

const pageName = "Admin dashboard";

type AdminDashboardProps = { appProps: AppProps };

export default function AdminDashboard({
  appProps,
}: AdminDashboardProps): JSX.Element {
  const { data: session, status } = useSession();

  type AdminPage = {
    name: string;
    description: string;
    link: string;
    linkText: string;
  };

  const adminPages: AdminPage[] = [
    {
      name: "Competitions manager",
      description: "Manage the competitions in the MCL.",
      link: "/admin/competitions",
      linkText: "Manage competitions",
    },
    {
      name: "Team manager",
      description: "Manage the teams that have signed up for the MCL.",
      link: "/admin/teams",
      linkText: "Manage teams",
    },
    {
      name: "Alert manager",
      description:
        "Manage the alerts (the notifications before the header) that appear on the website.",
      link: "/admin/alerts",
      linkText: "Manage alerts",
    },
    {
      name: "Officers manager",
      description: "Manage the officers in the MCL.",
      link: "/admin/officers",
      linkText: "Manage officers",
    },
  ];

  return (
    <Layout title={pageName} currentPage={pageName} appProps={appProps}>
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>
            Welcome to the Massachusetts Coding League{"'"}s administrator
            dashboard{session ? `, ${session.user.name}` : ""}!
          </h1>
          <div style={{ overflowX: "hidden" }}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
              {adminPages.map((feature: AdminPage, index: number) => {
                return (
                  <div className="col mb-3 mt-1" key={`help-card-${index}`}>
                    <div className="card mb-2 h-100">
                      {/*<Image*/}
                      {/*  src={feature.image}*/}
                      {/*  alt={feature.altText}*/}
                      {/*  className="card-img-top"*/}
                      {/*  objectFit="cover"*/}
                      {/*/>*/}
                      <h5 className="card-title m-3 mb-0">{feature.name}</h5>
                      <div className="card-body">
                        <div className="card-text">
                          <p>{feature.description}</p>
                        </div>
                        <Link
                          href={
                            feature.link.startsWith("/")
                              ? feature.link
                              : `/help/${feature.link}`
                          }
                          passHref
                          legacyBehavior
                        >
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
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: AdminDashboardProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
