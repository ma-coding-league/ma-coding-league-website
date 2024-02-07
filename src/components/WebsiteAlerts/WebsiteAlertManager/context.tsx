import React from "react";
import {
  getDefaultWebsiteAlertManagerStates,
  WebsiteAlertManagerFunctions,
  WebsiteAlertManagerStatesType,
} from "@/components/WebsiteAlerts/WebsiteAlertManager/state";

export const WebsiteAlertManagerStateStoreContext =
  React.createContext<WebsiteAlertManagerStatesType>(
    getDefaultWebsiteAlertManagerStates(),
  );

export const WebsiteAlertManagerStateFunctionsContext =
  React.createContext<WebsiteAlertManagerFunctions | null>(null);

export default function WebsiteAlertManagerStateProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [managerState, setManagerState] =
    React.useState<WebsiteAlertManagerStatesType>(
      getDefaultWebsiteAlertManagerStates(),
    );
  const [managerFunctions, setManagerFunctions] =
    React.useState<WebsiteAlertManagerFunctions | null>(null);

  React.useEffect(() => {
    setManagerState(getDefaultWebsiteAlertManagerStates());
    setManagerFunctions(
      new WebsiteAlertManagerFunctions(managerState, setManagerState),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebsiteAlertManagerStateStoreContext.Provider value={managerState}>
      <WebsiteAlertManagerStateFunctionsContext.Provider
        value={managerFunctions}
      >
        {children}
      </WebsiteAlertManagerStateFunctionsContext.Provider>
    </WebsiteAlertManagerStateStoreContext.Provider>
  );
}
