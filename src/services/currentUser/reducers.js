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

import * as constants from "./constants";

const defaultState = {
  login: constants.LOGIN_TYPE.BASIC_AUTH
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case constants.SET_CURRENT_USER:
      const role = action.payload.role;
      const shortcuts = {
        isSuperAdmin: role.label === "SUPER_ADMIN",
        isProductOwner:
          role.label === "SUPER_ADMIN" || role.label === "PRODUCT_OWNER",
        isProductOwnerOrReadOnly:
          role.label === "SUPER_ADMIN" ||
          role.label === "PRODUCT_OWNER" ||
          role.label === "READ_ONLY_USER",
        isAdmin:
          role.label === "SUPER_ADMIN" ||
          role.label === "PRODUCT_OWNER" ||
          role.label === "ADMIN",
        isReadOnly:
          role.label === "SUPER_ADMIN" ||
          role.label === "PRODUCT_OWNER" ||
          role.label === "ADMIN" ||
          role.label === "READ_ONLY_USER"
      };
      return Object.assign({}, state, action.payload, shortcuts);
    case constants.SET_LOGIN_TYPE:
      const { type } = action.payload;
      return Object.assign({}, state, { login: type });
    default:
      return state;
  }
}
