import {
  getServerSideCompetitionsFromAPI,
  ServerSideCompetition,
} from "@/scripts/API/Competitions/ServerSide";

export type CompetitionsManagerStatesType = {
  status: "loading" | "loaded" | "error";
  competitions: ServerSideCompetition[];
};

export function getDefaultCompetitionssManagerStates(): CompetitionsManagerStatesType {
  return {
    status: "loading",
    competitions: [],
  };
}

export class CompetitionsManagerFunctions {
  static REFRESH_THROTTLE = 200;

  public stateStore: CompetitionsManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<CompetitionsManagerStatesType>
  >;

  public constructor(
    stateStore: CompetitionsManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<CompetitionsManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public refreshCompetitions(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("Refreshing competitions");
      this.setStateStoreCallback({
        status: "loading",
        competitions: [],
      });
      setTimeout(() => {
        getServerSideCompetitionsFromAPI()
          .then((comps) => {
            console.log("Got competitions");
            this.setStateStoreCallback({
              status: "loaded",
              competitions: comps,
            });
            resolve();
          })
          .catch((err) => {
            console.error("Failed to get competitions");
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              competitions: [],
            });
            reject();
          });
      }, CompetitionsManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public createNewCompetition(): Promise<void> {
    console.log("Creating new competition");
    this.setStateStoreCallback({
      status: "loading",
      competitions: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/competitions", { method: "POST" })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error("Failed to create new competition");
          }
          console.log("CompetitionCard created");
          return this.refreshCompetitions();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to create new competition");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            competitions: [],
          });
          reject();
        });
    });
  }

  public editCompetition(comp: ServerSideCompetition): Promise<void> {
    console.log("Editing competition");
    this.setStateStoreCallback({
      status: "loading",
      competitions: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/competitions", { method: "PUT", body: JSON.stringify(comp) })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to edit competition");
          }
          console.log("CompetitionCard edited");
          return this.refreshCompetitions();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to edit competition");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            competitions: [],
          });
          reject();
        });
    });
  }

  public deleteCompetition(id: string): Promise<void> {
    console.log("Deleting competition");
    this.setStateStoreCallback({
      status: "loading",
      competitions: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/competitions", { method: "DELETE", body: id })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to delete competition");
          }
          console.log("CompetitionCard deleted");
          return this.refreshCompetitions();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to delete competition");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            competitions: [],
          });
          reject();
        });
    });
  }
}
