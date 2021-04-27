import { IAlertsState } from "types";
import * as types from "./alertsActionsTypes";

const initialState: IAlertsState = {};

export default function reduce(
  state = initialState,
  action: types.IAlertsActionTypes
) {
  switch (action.type) {
    case types.SHOW_ALERT:
      return {
        ...state,
        [action.alert.id]: action.alert,
      };
    case types.HIDE_ALERT:
      delete state[action.alert.id];
      return {
        ...state,
      };
    default:
      return state;
  }
}
