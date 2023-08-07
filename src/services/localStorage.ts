import { IToken } from "types";

const TOKEN = "DCI";

export function getToken(): IToken | null {
  const token = window.localStorage.getItem(TOKEN);
  if (!token) return null;
  return JSON.parse(token);
}

export function setToken(token: IToken) {
  window.localStorage.setItem(TOKEN, JSON.stringify(token));
}

export function setJWT(value: string) {
  return setToken({ type: "Bearer", value });
}

export function setBasicToken(value: string) {
  return setToken({ type: "Basic", value });
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN);
}

export function readValue<T>(
  key: string,
  initialValue: T,
  version: number = 1,
) {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const { value, version: localStorageVersion } = JSON.parse(item);
      return localStorageVersion === version ? value : initialValue;
    }
    return initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return initialValue;
  }
}

export function saveValue<T>(key: string, value: T, version: number = 1) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ version, value }));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
}
