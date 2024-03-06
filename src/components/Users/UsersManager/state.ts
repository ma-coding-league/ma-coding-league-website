import getUsersPageFromAPI, {
  getUsersPageCountFromAPI,
  User,
} from "@/scripts/API/Users";
import React from "react";

export type UsersManagerStatesType = {
  status: "loading" | "loaded" | "error";
  users: User[];
  page: number;
  pageCount: number;
};

export function getDefaultUsersManagerStates(): UsersManagerStatesType {
  return {
    status: "loading",
    users: [],
    page: 0,
    pageCount: 0,
  };
}

export class UsersManagerFunctions {
  static REFRESH_THROTTLE = 200;

  public stateStore: UsersManagerStatesType;
  public setStateStoreCallback: React.Dispatch<
    React.SetStateAction<UsersManagerStatesType>
  >;

  private _page: number = 0;
  private _pageCount: number = 0;

  public constructor(
    stateStore: UsersManagerStatesType,
    setStateStoreCallback: React.Dispatch<
      React.SetStateAction<UsersManagerStatesType>
    >,
  ) {
    this.stateStore = stateStore;
    this.setStateStoreCallback = setStateStoreCallback;
  }

  public getPage(): number {
    return this._page;
  }

  public getPageCount(): number {
    return this._pageCount;
  }

  public async setPage(page: number): Promise<void> {
    this._page = page;
    return this.refreshUsers();
  }

  public refreshUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("Refreshing users");
      this.setStateStoreCallback({
        ...getDefaultUsersManagerStates(),
        page: this._page,
        pageCount: this._pageCount,
      });
      setTimeout(() => {
        getUsersPageCountFromAPI()
          .then((pageCount) => {
            this._pageCount = pageCount;
          })
          .then(() => {
            return getUsersPageFromAPI(this.getPage());
          })
          .then((users) => {
            console.log("Got users");
            this.setStateStoreCallback({
              status: "loaded",
              users: users,
              page: this._page,
              pageCount: this._pageCount,
            });
            resolve();
          })
          .catch((err) => {
            console.error("Failed to get users");
            console.error(err);
            this.setStateStoreCallback({
              status: "error",
              users: [],
              page: this._page,
              pageCount: this._pageCount,
            });
            reject();
          });
      }, UsersManagerFunctions.REFRESH_THROTTLE);
    });
  }

  public editUser(user: User): Promise<void> {
    console.log("Editing user");
    this.setStateStoreCallback({
      ...getDefaultUsersManagerStates(),
      page: this._page,
      pageCount: this._pageCount,
    });
    return new Promise((resolve, reject) => {
      fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify(user),
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to edit user");
          }
          console.log("Team edited");
          return this.refreshUsers();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to edit user");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            users: [],
            page: this._page,
            pageCount: this._pageCount,
          });
          reject();
        });
    });
  }

  public deleteUser(id: string): Promise<void> {
    console.log("Deleting user");
    this.setStateStoreCallback({
      ...getDefaultUsersManagerStates(),
      page: this._page,
      pageCount: this._pageCount,
    });
    return new Promise((resolve, reject) => {
      fetch("/api/users", { method: "DELETE", body: id })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to delete user");
          }
          console.log("User deleted");
          return this.refreshUsers();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.error("Failed to delete user");
          console.error(err);
          this.setStateStoreCallback({
            status: "error",
            users: [],
            page: this._page,
            pageCount: this._pageCount,
          });
          reject();
        });
    });
  }
}
