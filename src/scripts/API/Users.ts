export type UserDetails = {
  team: { id: string } | null;
  graduationYear: number | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  roles: string;
  image: string;
  teamVerified: boolean;
} & UserDetails;

export function serializeUser(user: User): string {
  return JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.roles,
    image: user.image,
    team: user.team,
    teamVerified: user.teamVerified,
    graduationYear: user.graduationYear,
  });
}

export function deserializeUser(user: string): User {
  const userObject = JSON.parse(user);
  return <User>{
    id: userObject.id,
    name: userObject.name,
    email: userObject.email,
    roles: userObject.roles,
    image: userObject.image,
    team: userObject.team,
    teamVerified: userObject.teamVerified,
    graduationYear: userObject.graduationY,
  };
}

export async function getUsersPageCountFromAPI(): Promise<number> {
  const response = await fetch("/api/users/page/count");
  return await response.json();
}

export default async function getUsersPageFromAPI(
  page: number,
): Promise<User[]> {
  const response = await fetch(`/api/users/page/${page}`);

  return (await response.json()).map((user: any) => {
    return <User>{
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      image: user.image,
      team: user.team,
      teamVerified: user.teamVerified,
      graduationYear: user.graduationYear,
    };
  });
}
