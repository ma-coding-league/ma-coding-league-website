import { getUserSideCompetitionYearsFromAPI } from "@/scripts/API/Competitions/UserSide";
import React from "react";

export type CompetitionYearsContextType = {
  state: "loading" | "loaded" | "error";
  years: string[];
};

export const CompetitionYearsContext =
  React.createContext<CompetitionYearsContextType>({
    state: "loading",
    years: [],
  });

export default function CompetitionYearsContextProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [state, setState] = React.useState<CompetitionYearsContextType>({
    state: "loading",
    years: [],
  });

  React.useEffect(() => {
    setState({ state: "loading", years: [] });
    getUserSideCompetitionYearsFromAPI()
      .then((years) => {
        setState({ state: "loaded", years });
      })
      .catch(() => {
        setState({ state: "error", years: [] });
      });
  }, []);

  return (
    <CompetitionYearsContext.Provider value={state}>
      {children}
    </CompetitionYearsContext.Provider>
  );
}
