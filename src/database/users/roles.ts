export type UserRoles = "admin" | "user";

export function splitRoles(roles: string) {
  return roles.split(",");
}

export function roleHasUser(roles: string) {
  return splitRoles(roles).includes("user");
}

export function roleHasAdmin(roles: string) {
  return splitRoles(roles).includes("admin");
}
