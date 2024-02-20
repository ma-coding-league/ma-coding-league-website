import getWebsiteAlertsFromAPI, {
  WebsiteAlert,
} from "@/scripts/API/WebsiteAlerts";

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

  public refreshAlerts(): Promise<void> {
    return new Promise((resolve, reject) => {
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
            resolve();
          })
          .catch((err) => {
            console.error("Failed to get alerts");
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              alerts: [],
            });
            reject();
          });
      }, WebsiteAlertManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public createNewAlert(): Promise<void> {
    console.log("Creating new alert");
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/alerts", { method: "POST" })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error("Failed to create new alert");
          }
          console.log("Alert created");
          return this.refreshAlerts();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to create new alert");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            alerts: [],
          });
          reject();
        });
    });
  }

  public editAlert(alert: WebsiteAlert): Promise<void> {
    console.log(`Editing alert ${alert.id}`);
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/alerts", {
        method: "PUT",
        body: JSON.stringify(alert),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to edit alert");
          }
          console.log("Alert edited");
          return this.refreshAlerts();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to edit alert");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            alerts: [],
          });
          reject();
        });
    });
  }

  public deleteAlert(alertID: string): Promise<void> {
    console.log(`Deleting alert ${alertID}`);
    this.setStateStoreCallback({
      status: "loading",
      alerts: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/alerts", {
        method: "DELETE",
        body: alertID,
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to delete alert");
          }
          console.log("Alert deleted");
          return this.refreshAlerts();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to delete alert");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            alerts: [],
          });
          reject();
        });
    });
  }
}
