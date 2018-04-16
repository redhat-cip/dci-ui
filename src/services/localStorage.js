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

export const TOKEN = "dci";

export function get() {
  if (typeof localStorage === "undefined" || !localStorage.getItem(TOKEN)) {
    return { auth: { token: "", jwt: "" } };
  }
  return JSON.parse(localStorage.getItem(TOKEN));
}

export function setToken(token) {
  const newLocalStorage = get();
  newLocalStorage.auth.token = token;
  localStorage.setItem(TOKEN, JSON.stringify(newLocalStorage));
}

export function setJWT(token) {
  const newLocalStorage = get();
  newLocalStorage.auth.jwt = token;
  localStorage.setItem(TOKEN, JSON.stringify(newLocalStorage));
}

export function clearLocalStorage() {
  localStorage.removeItem(TOKEN);
}
