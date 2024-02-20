import React from "react";
import {
  CompetitionsManagerFunctions,
  CompetitionsManagerStatesType,
  getDefaultCompetitionssManagerStates,
} from "@/components/Competitions/CompetitionsManager/state";

export const CompetitionsManagerStatesStoreContext =
  React.createContext<CompetitionsManagerStatesType>(
    getDefaultCompetitionssManagerStates(),
  );

export const CompetitionsManagerStateFunctionsContext =
  React.createContext<CompetitionsManagerFunctions | null>(null);

export default function CompetitionsManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [managerState, setManagerState] =
    React.useState<CompetitionsManagerStatesType>(
      getDefaultCompetitionssManagerStates(),
    );
  const [managerFunctions, setManagerFunctions] =
    React.useState<CompetitionsManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultCompetitionssManagerStates());
    setManagerFunctions(
      new CompetitionsManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CompetitionsManagerStatesStoreContext.Provider value={managerState}>
      <CompetitionsManagerStateFunctionsContext.Provider
        value={managerFunctions}
      >
        {children}
      </CompetitionsManagerStateFunctionsContext.Provider>
    </CompetitionsManagerStatesStoreContext.Provider>
  );
}
