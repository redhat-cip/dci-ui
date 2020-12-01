import { ICurrentUser } from "types";

export const SET_IDENTITY = "SET_IDENTITY";
export const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER";
export const DELETE_CURRENT_USER = "DELETE_CURRENT_USER";

interface ISetIdentity {
  type: typeof SET_IDENTITY;
  identity: ICurrentUser;
}

interface IDeleteCurrentUser {
  type: typeof DELETE_CURRENT_USER;
}

interface IUpdateCurrentUser {
  type: typeof UPDATE_CURRENT_USER;
  currentUser: ICurrentUser;
}

export type ICurrentUserActionTypes =
  | ISetIdentity
  | IDeleteCurrentUser
  | IUpdateCurrentUser;
