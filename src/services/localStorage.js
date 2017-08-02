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

export const keyPrefix = "dci";

export default {
  get() {
    const localStorage = window.localStorage.getItem(keyPrefix);
    if (!localStorage) {
      return { auth: { token: "" } };
    }
    return JSON.parse(localStorage);
  },
  setToken(token) {
    const newLocalStorage = this.get();
    newLocalStorage.auth.token = token;
    window.localStorage.setItem(keyPrefix, JSON.stringify(newLocalStorage));
  },
  remove() {
    window.localStorage.removeItem(keyPrefix);
  }
};
