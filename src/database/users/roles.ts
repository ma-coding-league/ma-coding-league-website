export type UserRoles = "tech lead" | "admin" | "user";

export function splitRoles(roles: string) {
  if (roles == null) {
    return [];
  }
  return roles.split(",");
}

export function roleHasRole(roles: string, role: string) {
  return splitRoles(roles).includes(role);
}

export function roleHasUser(roles: string) {
  return roleHasRole(roles, "user");
}

export function roleHasAdmin(roles: string) {
  return roleHasRole(roles, "admin");
}

export function roleHasTechLead(roles: string) {
  return roleHasRole(roles, "tech lead");
}
