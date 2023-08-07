import { ICurrentUser } from "types";
import * as types from "./currentUserActionsTypes";

const initialState: ICurrentUser | null = null;

export default function reduce(
  state = initialState,
  action: types.ICurrentUserActionTypes,
): ICurrentUser | null {
  switch (action.type) {
    case types.SET_IDENTITY:
      return {
        ...state,
        ...action.identity,
      };
    case types.UPDATE_CURRENT_USER:
      return {
        ...state,
        ...action.currentUser,
      };
    case types.DELETE_CURRENT_USER:
      return null;
    default:
      return state;
  }
}
