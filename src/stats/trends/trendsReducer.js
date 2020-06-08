import * as types from "./trendsActionsTypes";

export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_TRENDS:
      return { ...state, ...action.trends };
    default:
      return state;
  }
}
