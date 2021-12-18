import { IToken } from "types";

const TOKEN = "DCI";

export function getToken(): IToken | null {
  const token = localStorage.getItem(TOKEN);
  if (!token) return null;
  return JSON.parse(token);
}

export function setToken(token: IToken) {
  localStorage.setItem(TOKEN, JSON.stringify(token));
}

export function setJWT(value: string) {
  return setToken({ type: "Bearer", value });
}

export function setBasicToken(value: string) {
  return setToken({ type: "Basic", value });
}

export function removeToken() {
  localStorage.removeItem(TOKEN);
}
