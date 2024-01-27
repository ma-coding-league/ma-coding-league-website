import getCompetitions, {
  MCLCompetition,
} from "@/components/MCLCompetition/Competitions/getCompetitions";
import React from "react";

export type MCLCompetitionsContextType = {
  state: "loading" | "loaded" | "error";
  competitions: MCLCompetition[];
};

export const MCLCompetitionsContext =
  React.createContext<MCLCompetitionsContextType>({
    state: "loading",
    competitions: [],
  });

export default function MCLCompetitionsProvider({
  compsGSheetID,
  children,
}: {
  compsGSheetID: string;
  children: JSX.Element;
}): JSX.Element {
  const [context, setContext] = React.useState<MCLCompetitionsContextType>({
    state: "loading",
    competitions: [],
  });

  React.useEffect(() => {
    setContext({ state: "loading", competitions: [] });
    getCompetitions(compsGSheetID)
      .then((comps) => {
        setContext({ state: "loaded", competitions: comps });
      })
      .catch((err) => {
        console.error(err);
        setContext({ state: "error", competitions: [] });
      });
  }, [compsGSheetID]);

  return (
    <MCLCompetitionsContext.Provider value={context}>
      {children}
    </MCLCompetitionsContext.Provider>
  );
}
