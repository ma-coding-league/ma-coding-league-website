export type Officer = {
  id: string;
  role: string;
  description: string;
  personName: string | null;
  personSchool: string | null;
  openForApplication?: boolean | null;
};

export function serializeOfficer(officer: Officer): string {
  return JSON.stringify({
    id: officer.id,
    role: officer.role,
    description: officer.description,
    personName: officer.personName,
    personSchool: officer.personSchool,
    openForApplication: officer.openForApplication,
  });
}

export function deserializeOfficer(officer: string): Officer {
  const officerObject = JSON.parse(officer);
  return <Officer>{
    id: officerObject.id,
    role: officerObject.role,
    description: officerObject.description,
    personName: officerObject.personName,
    personSchool: officerObject.personSchool,
    openForApplication: officerObject.openForApplication,
  };
}

export default async function getOfficersFromAPI(): Promise<Officer[]> {
  const response = await fetch("/api/officers");

  return (await response.json()).map((officer: any) => {
    return <Officer>{
      id: officer.id,
      role: officer.role,
      description: officer.description,
      personName: officer.personName,
      personSchool: officer.personSchool,
      openForApplication: officer.openForApplication,
    };
  });
}
