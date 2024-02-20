import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";
import CompetitionsManagerStateProviders from "@/components/Competitions/CompetitionsManager/context";
import CompetitionsManagerTable from "@/components/Competitions/CompetitionsManager/Table";
import { getUserTimezoneOffsetInHrs } from "@/scripts/Utils/DateAndTime/Helpers";

const pageName = "Competitions manager | Admin dashboard";

type CompetitionsManagerProps = { appProps: AppProps };

export default function CompetitionsManager({
  appProps,
}: CompetitionsManagerProps): JSX.Element {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Competitions manager": "/admin/competitions" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Competitions manager</h1>
          <RoleRequirements
            toView="admin"
            toCreate="admin"
            toEdit="admin"
            toDelete="admin"
          />
          <p>These are all the competitions in the MCL.</p>
          <p>
            Times are shown and should be edited in your current time zone:{" "}
            <code>{Intl.DateTimeFormat().resolvedOptions().timeZone}</code>{" "}
            (which is {getUserTimezoneOffsetInHrs()} hours{" "}
            {getUserTimezoneOffsetInHrs() > 0 ? "behind" : "ahead"} of UTC)
          </p>
          <CompetitionsManagerStateProviders>
            <CompetitionsManagerTable />
          </CompetitionsManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: CompetitionsManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
