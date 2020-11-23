import * as types from "./alertsActionsTypes";

const initialState: types.AlertsState = {};

export default function (
  state = initialState,
  action: types.AlertsActionTypes
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
