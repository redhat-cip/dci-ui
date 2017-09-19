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

export default {
  keyPrefix: "dci",
  get() {
    if (
      typeof localStorage === "undefined" ||
      !localStorage.getItem(this.keyPrefix)
    ) {
      return { auth: { token: "", jwt: "" } };
    }
    return JSON.parse(localStorage.getItem(this.keyPrefix));
  },
  setToken(token) {
    const newLocalStorage = this.get();
    newLocalStorage.auth.token = token;
    localStorage.setItem(this.keyPrefix, JSON.stringify(newLocalStorage));
  },
  setJWT(token) {
    const newLocalStorage = this.get();
    newLocalStorage.auth.jwt = token;
    localStorage.setItem(this.keyPrefix, JSON.stringify(newLocalStorage));
  },
  remove() {
    localStorage.removeItem(this.keyPrefix);
  }
};
