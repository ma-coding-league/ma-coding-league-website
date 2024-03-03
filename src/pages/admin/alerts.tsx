import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import WebsiteAlertManagerTable from "../../components/WebsiteAlerts/WebsiteAlertManager";
import WebsiteAlertManagerStateProviders from "@/components/WebsiteAlerts/WebsiteAlertManager/context";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";
import { getUserTimezoneOffsetInHrs } from "@/scripts/Utils/DateAndTime/Helpers";

const pageName = "Website alerts manager | Admin dashboard";

type WebsiteAlertsManagerProps = { appProps: AppProps };

export default function WebsiteAlertsManager({
  appProps,
}: WebsiteAlertsManagerProps): React.ReactNode {
  const { data: session, status } = useSession();

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Alert manager": "/admin/alerts" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Alert manager</h1>
          <RoleRequirements
            toView="admin"
            toCreate="admin"
            toEdit="admin"
            toDelete="admin"
          />
          <p>
            These alerts are shown site wide before the heading at the top of
            the page.
          </p>
          <p>
            Times are shown and should be edited in your current time zone:{" "}
            <code>{Intl.DateTimeFormat().resolvedOptions().timeZone}</code>{" "}
            (which is {getUserTimezoneOffsetInHrs()} hours{" "}
            {getUserTimezoneOffsetInHrs() > 0 ? "behind" : "ahead"} of UTC)
          </p>
          <p>
            <em>Can hide attribute does not have any effect yet.</em>
          </p>
          <WebsiteAlertManagerStateProviders>
            <WebsiteAlertManagerTable />
          </WebsiteAlertManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: WebsiteAlertsManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
