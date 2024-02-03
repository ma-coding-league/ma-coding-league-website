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

  return (
    <Layout title={pageName} currentPage={pageName} appProps={appProps}>
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>
            Welcome to the Massachusetts Coding League website{"'"}s
            administrator dashboard{session ? `, ${session.user.name}` : ""}!
          </h1>
          <ul>
            <li>
              <Link href="/admin/alerts">Manage alerts</Link>
            </li>
          </ul>
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
