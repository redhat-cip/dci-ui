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

import Constants from "./constants";

export default function(resourceString) {
  const constants = Constants(resourceString);

  function fetchStart() {
    return {
      type: constants.FETCH_REQUEST
    };
  }

  function fetchOk(resources) {
    return {
      type: constants.FETCH_SUCCESS,
      payload: resources
    };
  }

  function fetchKo(error) {
    return {
      type: constants.FETCH_FAILURE,
      payload: {
        error
      },
      error: true
    };
  }

  function set(resource) {
    return {
      type: constants.SET,
      payload: resource
    };
  }

  function update(resource) {
    return {
      type: constants.UPDATED,
      payload: resource
    };
  }

  function remove(resource) {
    return {
      type: constants.DELETED,
      payload: resource
    };
  }

  return {
    fetchStart,
    fetchOk,
    fetchKo,
    set,
    update,
    remove
  };
}
