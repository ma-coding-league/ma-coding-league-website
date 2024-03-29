import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import React from "react";
// @ts-ignore
import { BuiltInProviderType } from "next-auth/providers";
import RoleBadges from "@/components/Authentication/Roles/RoleBadges";
import { roleHasAdmin } from "@/database/users/roles";
import Link from "next/link";
import { BootstrapLibContext } from "@/pages/_app";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ProfileOffcanvas() {
  const bootstrapLib = React.useContext(BootstrapLibContext);

  const { data: session } = useSession();
  const [providers, setProviders] = React.useState<Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null>();

  React.useEffect(() => {
    getProviders().then((result) => {
      setProviders(result);
    });
  }, []);

  const hideOffcanvas = () => {
    if (bootstrapLib !== null) {
      bootstrapLib.Offcanvas.getOrCreateInstance("#profileOffcanvas").hide();
    }
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="profileOffcanvas"
        aria-labelledby="profileOffcanvasLabel"
      >
        <ErrorBoundary>
          {session && session.user ? (
            <>
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="profileOffcanvasLabel">
                  Signed in as {session.user.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <div>
                  <RoleBadges roles={session.user.roles} />
                  <br />
                  {session?.user.team !== null ? (
                    <span className="badge bg-primary me-2">
                      {session?.user.team}
                    </span>
                  ) : (
                    <span className="badge bg-danger me-2">
                      Not part of a team
                    </span>
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
                </div>
                <br />
                <p>
                  <Link href="/account" onClick={hideOffcanvas}>
                    Account dashboard
                  </Link>
                </p>
                {roleHasAdmin(session.user.roles) ? (
                  <p>
                    <Link href="/admin" onClick={hideOffcanvas}>
                      Admin dashboard
                    </Link>
                  </p>
                ) : (
                  <></>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="profileOffcanvasLabel">
                  Not signed in
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <p>
                  Sign into the Massachusetts Coding League website with a
                  provider below!
                </p>
                {providers ? (
                  Object.values(providers).map((provider) => {
                    const icon = {
                      GitHub: "bi-github",
                    }[provider.name];
                    return (
                      <div key={provider.name}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => signIn(provider.id)}
                        >
                          {icon != undefined ? (
                            <i className={`${icon} pe-1`} />
                          ) : undefined}{" "}
                          Sign in with {provider.name}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>
                    Sorry, but it looks like there aren{"'"}t any providers to
                    sign in with!
                  </p>
                )}
              </div>
            </>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
}
