import * as types from "./authActionsTypes";

const initialState = null;

export default function(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_SETTED:
      return action.auth;
    default:
      return state;
  }
}
