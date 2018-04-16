// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import axios from "axios";
import { removeToken, setJWT, getToken } from "./localStorage";

function refreshJWT() {
  return new Promise((resolve, reject) => {
    const nightySecond = 90;
    window._sso
      .updateToken(nightySecond)
      .then(resolve(window._sso.token))
      .catch(error => reject(error));
  });
}

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token.type} ${token.value}`;
    if (token.type === "Bearer") {
      return refreshJWT()
        .then(token => {
          setJWT(token);
          return Promise.resolve(config);
        })
        .catch(error => removeToken());
    }
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const statusCode = error.response && error.response.status;
    if (statusCode === 401) removeToken();
    return Promise.reject(error);
  }
);

export default axios;
