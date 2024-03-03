import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";
import OfficersManagerStateProviders from "@/components/Officers/OfficersManager/context";
import OfficersTable from "@/components/Officers/OfficersManager/Table";

const pageName = "Officers manager | Admin dashboard";

type OfficersManagerProps = { appProps: AppProps };

export default function OfficersManager({
  appProps,
}: OfficersManagerProps): React.ReactNode {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Officers manager": "/admin/officers" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Officers manager</h1>
          <RoleRequirements
            toView="admin"
            toCreate="tech lead"
            toEdit="tech lead"
            toDelete="tech lead"
          />
          <p>These are all the officers in the MCL.</p>
          <OfficersManagerStateProviders>
            <OfficersTable />
          </OfficersManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: OfficersManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
