import axios from "axios";
import { setJWT, getToken } from "./localStorage";

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token.type} ${token.value}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const statusCode = error.response && error.response.status;
    if (statusCode === 401) {
      const sso = window._sso;
      const token = getToken();
      if (error.config && sso && token) {
        sso
          .updateToken()
          .then(() => {
            setJWT(sso.token);
            return axios.request(error.config);
          })
          .catch(error => console.log(error));
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
