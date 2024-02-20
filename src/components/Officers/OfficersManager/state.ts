import getOfficersFromAPI, { Officer } from "@/scripts/API/Officers";

export type OfficersManagerStatesType = {
  status: "loading" | "loaded" | "error";
  officers: Officer[];
};

export function getDefaultOfficersManagerStates(): OfficersManagerStatesType {
  return {
    status: "loading",
    officers: [],
  };
}

export class OfficersManagerFunctions {
  static REFRESH_THROTTLE = 200;

  public stateStore: OfficersManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<OfficersManagerStatesType>
  >;

  public constructor(
    stateStore: OfficersManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<OfficersManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public refreshOfficers(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("Refreshing officers");
      this.setStateStoreCallback({
        status: "loading",
        officers: [],
      });
      setTimeout(() => {
        getOfficersFromAPI()
          .then((officers) => {
            console.log("Got officers");
            this.setStateStoreCallback({
              status: "loaded",
              officers: officers,
            });
            resolve();
          })
          .catch((err) => {
            console.error("Failed to get officers");
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              officers: [],
            });
            reject();
          });
      }, OfficersManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public createNewOfficer(): Promise<void> {
    console.log("Creating new officer");
    this.setStateStoreCallback({
      status: "loading",
      officers: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/officers", { method: "POST" })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error("Failed to create new officer");
          }
          console.log("Officer created");
          return this.refreshOfficers();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to create new officer");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            officers: [],
          });
          reject();
        });
    });
  }

  public editOfficer(officer: Officer): Promise<void> {
    console.log("Editing officer");
    this.setStateStoreCallback({
      status: "loading",
      officers: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/officers", {
        method: "PUT",
        body: JSON.stringify(officer),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to edit officer");
          }
          console.log("Team edited");
          return this.refreshOfficers();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to edit officer");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            officers: [],
          });
          reject();
        });
    });
  }

  public deleteOfficer(id: string): Promise<void> {
    console.log("Deleting officer");
    this.setStateStoreCallback({
      status: "loading",
      officers: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/officers", { method: "DELETE", body: id })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to delete officer");
          }
          console.log("Officer deleted");
          return this.refreshOfficers();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to delete officer");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            officers: [],
          });
          reject();
        });
    });
  }
}
