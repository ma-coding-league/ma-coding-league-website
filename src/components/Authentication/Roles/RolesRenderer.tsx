import { splitRoles } from "@/database/users/roles";

type RoleBadge = {
  text: string;
  color: string;
};

const rolesToBadges: { [role: string]: RoleBadge } = {
  admin: { text: "Admin", color: "bg-danger" },
  user: { text: "User", color: "bg-primary" },
};

export default function RolesRenderer({ roles }: { roles: string }) {
  return (
    <>
      {splitRoles(roles).map((role) => {
        const badge = rolesToBadges[role];
        return badge != null ? (
          <span key={role} className={`badge ${badge.color} me-2`}>
            {badge.text}
          </span>
        ) : (
          <></>
        );
      })}
    </>
  );
}
