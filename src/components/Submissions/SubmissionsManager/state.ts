import {
  getServerSideSubmissionsFromAPI,
  ServerSideSubmission,
} from "@/scripts/API/Submissions/ServerSide";

export type SubmissionsManagerStatesType = {
  status: "loading" | "loaded" | "error";
  compName: string;
  submissions: ServerSideSubmission[];
};

export function getDefaultSubmissionsManagerStates(): SubmissionsManagerStatesType {
  return {
    status: "loading",
    compName: "",
    submissions: [],
  };
}

export class SubmissionsManagerFunctions {
  static REFRESH_THROTTLE = 1000;

  public stateStore: SubmissionsManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<SubmissionsManagerStatesType>
  >;

  public constructor(
    stateStore: SubmissionsManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<SubmissionsManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public refreshSubmissions(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Refreshing submissions for ${name}`);
      this.setStateStoreCallback({
        status: "loading",
        compName: name,
        submissions: [],
      });
      setTimeout(() => {
        getServerSideSubmissionsFromAPI(name)
          .then((subs) => {
            console.log(`Got submissions for ${name}`);
            this.setStateStoreCallback({
              status: "loaded",
              compName: name,
              submissions: subs,
            });
            resolve();
          })
          .catch((err) => {
            console.error(`Failed to get submissions for ${name}`);
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              compName: name,
              submissions: [],
            });
            reject();
          });
      }, SubmissionsManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public createNewSubmission(name: string): Promise<void> {
    console.log(`Creating new submission for ${name}`);
    this.setStateStoreCallback({
      status: "loading",
      compName: name,
      submissions: [],
    });
    return new Promise((resolve, reject) => {
      fetch(`/api/submissions?name=${name}`, { method: "POST" })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error(`Failed to create new competition for ${name}`);
          }
          console.log("Submission created");
          return this.refreshSubmissions(name);
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(`Failed to create new submission for ${name}`);
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            compName: name,
            submissions: [],
          });
          reject();
        });
    });
  }

  public editSubmission(
    name: string,
    team: string,
    sub: ServerSideSubmission,
  ): Promise<void> {
    console.log(`Editing submission for ${name}`);
    this.setStateStoreCallback({
      status: "loading",
      compName: name,
      submissions: [],
    });
    return new Promise((resolve, reject) => {
      fetch(`/api/submissions?name=${name}&team=${team}`, {
        method: "PUT",
        body: JSON.stringify(sub),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`Failed to edit submission for ${name}`);
          }
          console.log(`Submission edited for ${name}`);
          return this.refreshSubmissions(name);
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(`Failed to edit competition for ${name}`);
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            compName: name,
            submissions: [],
          });
          reject();
        });
    });
  }

  public deleteSubmission(name: string, team: string): Promise<void> {
    console.log(`Deleting submission for ${name}`);
    this.setStateStoreCallback({
      status: "loading",
      compName: name,
      submissions: [],
    });
    return new Promise((resolve, reject) => {
      fetch(`/api/submissions?name=${name}&team=${team}`, { method: "DELETE" })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`Failed to delete submission for ${name}`);
          }
          console.log(`Submission deleted for ${name}`);
          return this.refreshSubmissions(name);
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error(`Failed to delete submission for ${name}`);
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            compName: name,
            submissions: [],
          });
          reject();
        });
    });
  }
}
