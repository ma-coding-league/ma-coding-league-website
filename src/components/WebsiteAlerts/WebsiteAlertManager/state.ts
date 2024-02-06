import getWebsiteAlertsFromAPI, {
  WebsiteAlert,
} from "@/components/WebsiteAlerts/websiteAlertsAPI";

export type WebsiteAlertManagerStatesType = {
  status: "loading" | "loaded" | "error";
  alerts: WebsiteAlert[];
};

export function getDefaultWebsiteAlertManagerStates(): WebsiteAlertManagerStatesType {
  return {
    status: "loading",
    alerts: [],
  };
}

export class WebsiteAlertManagerFunctions {
  static REFRESH_THROTTLE = 200;

  public stateStore: WebsiteAlertManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<WebsiteAlertManagerStatesType>
  >;

  public constructor(
    stateStore: WebsiteAlertManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<WebsiteAlertManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public refreshAlerts() {
    console.log("Refreshing alerts");
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    setTimeout(() => {
      getWebsiteAlertsFromAPI()
        .then((alerts) => {
          console.log("Got alerts");
          this.setStateStoreCallback({
            status: "loaded",
            alerts: alerts,
          });
        })
        .catch((err) => {
          console.error("Failed to get alerts");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            alerts: [],
          });
        });
    }, WebsiteAlertManagerFunctions.REFRESH_THROTTLE);
  }

  public createNewAlert() {
    console.log("Creating new alert");
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    fetch("/api/alerts", { method: "POST" })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error("Failed to create new alert");
        }
        console.log("Alert created");
      })
      .catch((err) => {
        console.error("Failed to create new alert");
        console.error(err);
        this.setStateStoreCallback({
          status: "error",
          alerts: [],
        });
      })
      .finally(() => {
        this.refreshAlerts();
      });
  }

  public deleteAlert(alertID: string) {
    console.log(`Deleting alert ${alertID}`);
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    fetch("/api/alerts", {
      method: "DELETE",
      body: alertID,
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to delete alert");
        }
        console.log("Alert deleted");
      })
      .catch((err) => {
        console.error("Failed to delete alert");
        console.error(err);
        this.setStateStoreCallback({
          status: "error",
          alerts: [],
        });
      })
      .finally(() => {
        this.refreshAlerts();
      });
  }
}
