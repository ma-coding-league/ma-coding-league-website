import React from "react";
import {
  getDefaultUsersManagerStates,
  UsersManagerFunctions,
  UsersManagerStatesType,
} from "@/components/Users/UsersManager/state";

export const UsersManagerStatesStoreContext =
  React.createContext<UsersManagerStatesType>(getDefaultUsersManagerStates());

export const UsersManagerStateFunctionsContext =
  React.createContext<UsersManagerFunctions | null>(null);

export default function UsersManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [managerState, setManagerState] =
    React.useState<UsersManagerStatesType>(getDefaultUsersManagerStates());
  const [managerFunctions, setManagerFunctions] =
    React.useState<UsersManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultUsersManagerStates());
    setManagerFunctions(
      new UsersManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UsersManagerStatesStoreContext.Provider value={managerState}>
      <UsersManagerStateFunctionsContext.Provider value={managerFunctions}>
        {children}
      </UsersManagerStateFunctionsContext.Provider>
    </UsersManagerStatesStoreContext.Provider>
  );
}
