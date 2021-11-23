import axios from "axios";
import { getToken, setJWT, removeToken } from "./localStorage";

const baseURL =
  process.env.REACT_APP_BACKEND_HOST || "https://api.distributed-ci.io";

axios.defaults.baseURL = baseURL;

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (config && config.headers && token) {
    config.headers.Authorization = `${token.type} ${token.value}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getToken();
    if (
      token === null ||
      token.type !== "Bearer" ||
      error.response.status !== 401 ||
      typeof window.keycloak === undefined
    ) {
      return Promise.reject(error);
    }
    const thirtySecondsMinValidity = 30;
    return window.keycloak
      .updateToken(thirtySecondsMinValidity)
      .then(() => {
        const newToken = window.keycloak.token;
        if (newToken) {
          setJWT(newToken);
          error.response.config.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(error.response.config);
        }
      })
      .catch((error) => {
        removeToken();
        return Promise.reject(error);
      });
  }
);

export default axios;
