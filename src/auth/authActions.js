import * as types from "./authActionsTypes";
import { getToken, removeToken } from "../services/localStorage";

export function login() {
  return {
    type: types.LOGIN
  };
}

export function logout() {
  const token = getToken();
  if (token && token.type === "Bearer") {
    try {
      window._sso.logout();
    } catch (error) {
      console.error("Cannot Keycloak logout");
    }
  }
  removeToken();
  return {
    type: types.LOGOUT
  };
}
