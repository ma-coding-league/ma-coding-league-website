import React from "react";
import {
  getDefaultOfficersManagerStates,
  OfficersManagerFunctions,
  OfficersManagerStatesType,
} from "@/components/Officers/OfficersManager/state";

export const OfficersManagerStatesStoreContext =
  React.createContext<OfficersManagerStatesType>(
    getDefaultOfficersManagerStates(),
  );

export const OfficersManagerStateFunctionsContext =
  React.createContext<OfficersManagerFunctions | null>(null);

export default function OfficersManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [managerState, setManagerState] =
    React.useState<OfficersManagerStatesType>(
      getDefaultOfficersManagerStates(),
    );
  const [managerFunctions, setManagerFunctions] =
    React.useState<OfficersManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultOfficersManagerStates());
    setManagerFunctions(
      new OfficersManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OfficersManagerStatesStoreContext.Provider value={managerState}>
      <OfficersManagerStateFunctionsContext.Provider value={managerFunctions}>
        {children}
      </OfficersManagerStateFunctionsContext.Provider>
    </OfficersManagerStatesStoreContext.Provider>
  );
}
