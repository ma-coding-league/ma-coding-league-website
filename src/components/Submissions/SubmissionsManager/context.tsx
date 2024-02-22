import React from "react";
import {
  getDefaultSubmissionsManagerStates,
  SubmissionsManagerFunctions,
  SubmissionsManagerStatesType,
} from "@/components/Submissions/SubmissionsManager/state";

export const SubmissionsManagerStatesStoreContext =
  React.createContext<SubmissionsManagerStatesType>(
    getDefaultSubmissionsManagerStates(),
  );

export const SubmissionsManagerStateFunctionsContext =
  React.createContext<SubmissionsManagerFunctions | null>(null);

export default function SubmissionsManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [managerState, setManagerState] =
    React.useState<SubmissionsManagerStatesType>(
      getDefaultSubmissionsManagerStates(),
    );
  const [managerFunctions, setManagerFunctions] =
    React.useState<SubmissionsManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultSubmissionsManagerStates());
    setManagerFunctions(
      new SubmissionsManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SubmissionsManagerStatesStoreContext.Provider value={managerState}>
      <SubmissionsManagerStateFunctionsContext.Provider
        value={managerFunctions}
      >
        {children}
      </SubmissionsManagerStateFunctionsContext.Provider>
    </SubmissionsManagerStatesStoreContext.Provider>
  );
}
