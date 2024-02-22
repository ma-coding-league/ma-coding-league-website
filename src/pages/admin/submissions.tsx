import getAppProps, { AppProps } from "@/components/WithAppProps";
import React from "react";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import RequireAdminAuthorized from "@/components/Authorization/RequireAdminAuthorized";
import { RoleRequirements } from "@/components/Authentication/Roles/RoleBadges";
import SubmissionsManagerStateProviders from "@/components/Submissions/SubmissionsManager/context";
import SubmissionsManagerTable from "@/components/Submissions/SubmissionsManager/Table";
import CompetitionSelector from "@/components/CompetitionSelector";
import TeamsManagerStateProviders from "@/components/Teams/TeamsManager/context";

const pageName = "Submissions manager | Admin dashboard";

type SubmissionsManagerProps = { appProps: AppProps };

export default function SubmissionsManager({
  appProps,
}: SubmissionsManagerProps): JSX.Element {
  const { data: session, status } = useSession();
  const [comp, setComp] = React.useState<string | null>(null);
  const [compSelectorState, setCompSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");

  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      breadCrumbs={[
        { "Admin dashboard": "/admin" },
        { "Submissions manager": "/admin/submissions" },
      ]}
    >
      <RequireAdminAuthorized session={session} status={status}>
        <>
          <h1>Submissions manager</h1>
          <RoleRequirements
            toView="admin"
            toCreate="admin"
            toEdit="admin"
            toDelete="admin"
          />
          <p>
            These are all the submissions for{" "}
            {comp !== null ? `the ${comp}` : " a MCL competition"}.
          </p>
          <p>Select a competition to view it{"'"}s submissions:</p>
          <CompetitionSelector
            setSelectedCallback={setComp}
            setStateCallback={setCompSelectorState}
          />
          <div className="mb-4" />
          <SubmissionsManagerStateProviders>
            <TeamsManagerStateProviders>
              {(() => {
                switch (compSelectorState) {
                  case "loading":
                    return (
                      <div className="alert alert-secondary" role="alert">
                        Loading...
                      </div>
                    );
                  case "loaded":
                    return comp !== null ? (
                      <SubmissionsManagerTable compName={comp} />
                    ) : (
                      <div className="alert alert-warning" role="alert">
                        Select a competition first!
                      </div>
                    );
                  case "error":
                    return (
                      <div className="alert alert-danger" role="alert">
                        Error loading competitions, try refreshing the page!
                      </div>
                    );
                }
              })()}
            </TeamsManagerStateProviders>
          </SubmissionsManagerStateProviders>
        </>
      </RequireAdminAuthorized>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: SubmissionsManagerProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
    },
  };
}
