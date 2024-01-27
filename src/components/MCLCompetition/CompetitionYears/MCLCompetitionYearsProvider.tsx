import React from "react";
import getCompetitionYears, {
  MCLCompetitionsYear,
} from "@/components/MCLCompetition/CompetitionYears/getCompetitionYears";

export type MCLCompetitionYearsContextType = {
  state: "loading" | "loaded" | "error";
  years: MCLCompetitionsYear[];
};

export const MCLCompetitionYearsContext =
  React.createContext<MCLCompetitionYearsContextType>({
    state: "loading",
    years: [],
  });

export default function MCLCompetitionYearsProvider({
  compYearsGSheetID,
  children,
}: {
  compYearsGSheetID: string;
  children: JSX.Element;
}): JSX.Element {
  const [context, setContext] = React.useState<MCLCompetitionYearsContextType>({
    state: "loading",
    years: [],
  });

  React.useEffect(() => {
    setContext({ state: "loading", years: [] });
    getCompetitionYears(compYearsGSheetID)
      .then((years) => {
        setContext({ state: "loaded", years: years });
      })
      .catch((err) => {
        console.error(err);
        setContext({ state: "error", years: [] });
      });
  }, [compYearsGSheetID]);

  return (
    <MCLCompetitionYearsContext.Provider value={context}>
      {children}
    </MCLCompetitionYearsContext.Provider>
  );
}
