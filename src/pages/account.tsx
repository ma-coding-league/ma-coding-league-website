import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireUserAuthorized from "@/components/Authorization/RequireUserAuthorized";
import RoleBadges from "@/components/Authentication/Roles/RoleBadges";
import AccountPageTeamSection from "@/components/Account/Page/TeamSection";

const pageName = "Account";

type AccountProps = { appProps: AppProps };

export default function Account({ appProps }: AccountProps): React.ReactNode {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="Your account page for the Massachusetts Coding League!"
      keywords="MA Coding League, Massachusetts Coding League, MA Coding League website, Massachusetts Coding League website, Account, User, Accoutn page, User page, Sign in"
    >
      <RequireUserAuthorized session={session} status={status}>
        <h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={session?.user!.image!}
            alt={`Profile picture of ${session?.user.name}`}
            style={{
              width: "0.9em",
              height: "0.9em",
              objectFit: "contain",
              borderRadius: "50%",
              verticalAlign: "middle",
              marginBottom: "0.15em",
            }}
          />{" "}
          Hello, {session?.user.name}!
        </h1>
        <p>
          <RoleBadges roles={session?.user.roles ?? ""} />
          <br />
          {session?.user.team !== null ? (
            <span className="badge bg-primary me-2">{session?.user.team}</span>
          ) : (
            <span className="badge bg-danger me-2">Not part of a team</span>
          )}
          {session?.user.graduationYear !== null ? (
            <span className="badge bg-primary me-2">
              {session?.user.graduationYear}
            </span>
          ) : (
            <span className="badge bg-danger me-2">
              Graduation year not set
            </span>
          )}
          {session?.user.teamVerified ? (
            <span className="badge bg-success me-2">Verified</span>
          ) : (
            <span className="badge bg-danger me-2">Unverified</span>
          )}
        </p>
        <p>
          ID: <code>{session?.user.id}</code>
          <br />
          Email:{" "}
          <code>
            <a
              href={`mailto:${session?.user.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {session?.user.email}
            </a>
          </code>
          <br />
        </p>
        <h2>Team</h2>
        <AccountPageTeamSection />
      </RequireUserAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{ props: AccountProps }> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
