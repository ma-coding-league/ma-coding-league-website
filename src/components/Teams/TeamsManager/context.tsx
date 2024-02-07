import {
  getDefaultTeamsManagerStates,
  TeamsManagerFunctions,
  TeamsManagerStatesType,
} from "@/components/Teams/TeamsManager/state";
import React from "react";

export const TeamsManagerStatesStoreContext =
  React.createContext<TeamsManagerStatesType>(getDefaultTeamsManagerStates());

export const TeamsManagerStateFunctionsContext =
  React.createContext<TeamsManagerFunctions | null>(null);

export default function TeamsManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [managerState, setManagerState] =
    React.useState<TeamsManagerStatesType>(getDefaultTeamsManagerStates());
  const [managerFunctions, setManagerFunctions] =
    React.useState<TeamsManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultTeamsManagerStates());
    setManagerFunctions(
      new TeamsManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TeamsManagerStatesStoreContext.Provider value={managerState}>
      <TeamsManagerStateFunctionsContext.Provider value={managerFunctions}>
        {children}
      </TeamsManagerStateFunctionsContext.Provider>
    </TeamsManagerStatesStoreContext.Provider>
  );
}
