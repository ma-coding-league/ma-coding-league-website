import { splitRoles } from "@/database/users/roles";

type RoleBadge = {
  text: string;
  color: string;
};

export const rolesToBadges: { [role: string]: RoleBadge } = {
  "tech lead": { text: "Tech lead", color: "bg-info" },
  admin: { text: "Admin", color: "bg-danger" },
  user: { text: "User", color: "bg-primary" },
};

export function RoleBadge({ role }: { role: string }) {
  const badge = rolesToBadges[role];
  return badge != null ? (
    <span className={`badge ${badge.color} me-2`}>{badge.text}</span>
  ) : (
    <></>
  );
}

export function RoleRequirements({
  toView,
  toCreate,
  toEdit,
  toDelete,
}: {
  toView?: string | null;
  toCreate?: string | null;
  toEdit?: string | null;
  toDelete?: string | null;
}) {
  // const { data: session, status } = useSession();

  return (
    <>
      <p>
        {toView != null ? (
          <span>
            View: <RoleBadges roles={toView} />
          </span>
        ) : null}
        {toCreate != null ? (
          <span>
            Create: <RoleBadges roles={toCreate} />
          </span>
        ) : null}
        {toEdit != null ? (
          <span>
            Edit: <RoleBadges roles={toEdit} />
          </span>
        ) : null}
        {toDelete != null ? (
          <span>
            Delete: <RoleBadges roles={toDelete} />
          </span>
        ) : null}
      </p>
    </>
  );
}

export default function RoleBadges({ roles }: { roles: string }) {
  return (
    <>
      {splitRoles(roles).map((role) => {
        return <RoleBadge role={role} key={role} />;
      })}
    </>
  );
}
