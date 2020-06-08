import axios from "axios";
import { getToken } from "./localStorage";

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token.type} ${token.value}`;
  }
  return config;
});

export default axios;
