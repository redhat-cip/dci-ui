const TOKEN = "DCI";

export function getToken() {
  const token = localStorage.getItem(TOKEN);
  if (!token) return null;
  return JSON.parse(token);
}

export function setToken(token) {
  localStorage.setItem(TOKEN, JSON.stringify(token));
}

export function setJWT(value) {
  return setToken({ type: "Bearer", value });
}

export function setBasicToken(value) {
  return setToken({ type: "Basic", value });
}

export function removeToken() {
  localStorage.removeItem(TOKEN);
}
