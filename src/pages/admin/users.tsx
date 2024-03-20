import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";
import UsersManagerStateProviders from "@/components/Users/UsersManager/context";
import UsersTable from "@/components/Users/UsersManager/Table";
import TeamsManagerStateProviders from "@/components/Teams/TeamsManager/context";

const pageName = "Users manager | Admin dashboard";

type UsersManagerProps = { appProps: AppProps };

export default function UsersManager({
  appProps,
}: UsersManagerProps): React.ReactNode {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Users manager": "/admin/users" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Users manager</h1>
          <RoleRequirements
            toView="admin"
            toEdit="tech lead"
            toDelete="tech lead"
          />
          <p>These are all the users in the MCL.</p>
          <UsersManagerStateProviders>
            <TeamsManagerStateProviders>
              <UsersTable />
            </TeamsManagerStateProviders>
          </UsersManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: UsersManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
