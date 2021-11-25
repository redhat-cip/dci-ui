import axios from "axios";
import { getToken } from "./localStorage";

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

export default axios;
