import axios from "axios";
import { getToken } from "./localStorage";

const baseURL =
  process.env.REACT_APP_BACKEND_HOST || "https://api2.distributed-ci.io";

axios.defaults.baseURL = baseURL;

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token.type} ${token.value}`;
  }
  return config;
});

export default axios;
