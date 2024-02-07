export type Team = {
  id: string;
  name: string;
};

export function serializeTeam(team: Team): string {
  return JSON.stringify({
    id: team.id,
    name: team.name,
  });
}

export function deserializeTeam(team: string): Team {
  const teamObject = JSON.parse(team);
  return <Team>{
    id: teamObject.id,
    name: teamObject.name,
  };
}

export default async function getTeamsFromAPI(): Promise<Team[]> {
  const response = await fetch("/api/teams");

  return (await response.json()).map((team: any) => {
    return <Team>{
      id: team.id,
      name: team.name,
    };
  });
}
