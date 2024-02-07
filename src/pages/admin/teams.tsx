import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import TeamsManagerStateProviders from "@/components/Teams/TeamsManager/context";
import TeamsTable from "@/components/Teams/TeamsManager/Table";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";

const pageName = "Teams manager | Admin dashboard";

type TeamsManagerProps = { appProps: AppProps };

export default function TeamsManager({
  appProps,
}: TeamsManagerProps): JSX.Element {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Teams manager": "/admin/teams" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Teams manager</h1>
          <RoleRequirements
            toView="admin"
            toCreate="tech lead"
            toEdit="tech lead"
            toDelete="tech lead"
          />
          <p>These are all the teams that have signed up for the MCL.</p>
          <TeamsManagerStateProviders>
            <TeamsTable />
          </TeamsManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: TeamsManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
