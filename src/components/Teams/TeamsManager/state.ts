import getTeamsFromAPI, { Team } from "@/scripts/API/Teams";

export type TeamsManagerStatesType = {
  status: "loading" | "loaded" | "error";
  teams: Team[];
};

export function getDefaultTeamsManagerStates(): TeamsManagerStatesType {
  return {
    status: "loading",
    teams: [],
  };
}

export class TeamsManagerFunctions {
  static REFRESH_THROTTLE = 200;

  public stateStore: TeamsManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<TeamsManagerStatesType>
  >;

  public constructor(
    stateStore: TeamsManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<TeamsManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public refreshTeams(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("Refreshing teams");
      this.setStateStoreCallback({
        status: "loading",
        teams: [],
      });
      setTimeout(() => {
        getTeamsFromAPI()
          .then((teams) => {
            console.log("Got teams");
            this.setStateStoreCallback({
              status: "loaded",
              teams: teams,
            });
            resolve();
          })
          .catch((err) => {
            console.error("Failed to get teams");
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              teams: [],
            });
            reject();
          });
      }, TeamsManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public createNewTeam(): Promise<void> {
    console.log("Creating new team");
    this.setStateStoreCallback({
      status: "loading",
      teams: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/teams", { method: "POST" })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error("Failed to create new team");
          }
          console.log("Team created");
          return this.refreshTeams();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to create new team");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            teams: [],
          });
          reject();
        });
    });
  }

  public editTeam(team: Team): Promise<void> {
    console.log("Editing team");
    this.setStateStoreCallback({
      status: "loading",
      teams: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/teams", { method: "PUT", body: JSON.stringify(team) })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to edit team");
          }
          console.log("Team edited");
          return this.refreshTeams();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to edit team");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            teams: [],
          });
          reject();
        });
    });
  }

  public deleteTeam(id: string): Promise<void> {
    console.log("Deleting team");
    this.setStateStoreCallback({
      status: "loading",
      teams: [],
    });
    return new Promise((resolve, reject) => {
      fetch("/api/teams", { method: "DELETE", body: id })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to delete team");
          }
          console.log("Team deleted");
          return this.refreshTeams();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to delete team");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            teams: [],
          });
          reject();
        });
    });
  }
}
