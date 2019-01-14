import * as types from "./authActionsTypes";

export function login() {
  return {
    type: types.LOGIN
  };
}

export function logout() {
  return {
    type: types.LOGOUT
  };
}
