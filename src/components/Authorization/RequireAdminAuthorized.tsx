import { roleHasAdmin } from "@/database/users/roles";
import React from "react";
import { Session } from "next-auth";

export default function RequireAdminAuthorized({
  session,
  status,
  children,
}: {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  children: React.ReactNode;
}): React.ReactNode {
  if (status === "loading") {
    return (
      <div className="placeholder-glow">
        <h1>
          <span className="placeholder col-6" />
        </h1>
        <p>
          <span className="placeholder col-7" />
          <span className="placeholder col-9" />
          <span className="placeholder col-6" />
        </p>
      </div>
    );
  } else if (session) {
    if (roleHasAdmin(session.user.roles)) {
      return children;
    } else {
      return (
        <>
          <h1>Unauthorized</h1>
          <p>You are not authorized to view this admin page.</p>
        </>
      );
    }
  } else {
    return (
      <>
        <h1>Unauthenticated</h1>
        <p>You must be signed in to view this admin page.</p>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-target="#profileOffcanvas"
          data-bs-toggle="offcanvas"
          aria-controls="profileOffcanvas"
        >
          Sign in
        </button>
      </>
    );
  }
}
