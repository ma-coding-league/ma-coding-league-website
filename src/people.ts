export type Person = {
  name: string;
  school: string | null;
};

export type Developer = { person: Person; link: string };
export const DEVELOPERS: Developer[] = [
  {
    person: {
      name: "Cyrus Yiu",
      school: "Woburn Memorial High School",
    },
    link: "https://github.com/UnsignedArduino",
  },
];
