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

import http from "../http";
import pick from "lodash/pick";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import Constants from "./constants";
import schemas from "./schemas";
import * as alertsActions from "../alerts/actions";

export default function(resource) {
  const resources = `${resource}s`;
  const constant = Constants(resource);
  const constants = Constants(resources);

  function all(params) {
    let endpoint = resources;
    if (params && params.endpoint) {
      endpoint = params.endpoint;
      delete params.endpoint;
    }
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "get",
        url: `${state.config.apiURL}/api/v1/${endpoint}`,
        params
      };
      return http(request)
        .then(response => {
          dispatch(action(constants.SET, response.data[resources]));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function get(data, params = {}) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "get",
        url: `${state.config.apiURL}/api/v1/${resources}/${data.id}`,
        params
      };
      return http(request)
        .then(response => {
          dispatch(action(constant.UPDATE, response.data[resource]));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function clean(resource, resourceString, options = { omitNil: true }) {
    const newResource = options.omitNil ? omitBy(resource, isNil) : resource;
    return pick(newResource, schemas[resourceString]);
  }

  function post(data) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "post",
        url: `${state.config.apiURL}/api/v1/${resources}`,
        data: clean(data, resources)
      };
      return http(request)
        .then(response => {
          dispatch(action(constant.CREATE, response.data[`${resource}`]));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function update(data, options = { omitNil: false }) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "put",
        url: `${state.config.apiURL}/api/v1/${resources}/${data.id}`,
        data: clean(data, resource, options),
        headers: { "If-Match": data.etag }
      };
      return http(request)
        .then(response => {
          const etag = response.headers.etag;
          dispatch(action(constant.UPDATE, Object.assign({}, data, { etag })));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function remove(data) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "delete",
        url: `${state.config.apiURL}/api/v1/${resources}/${data.id}`,
        headers: { "If-Match": data.etag }
      };
      return http(request)
        .then(response => {
          dispatch(action(constant.REMOVE, data));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function save(data) {
    return dispatch => {
      return dispatch(action(constants.SET, data));
    };
  }

  function action(type, payload) {
    if (payload) {
      return {
        type,
        payload
      };
    }
    return {
      type
    };
  }

  return {
    all: all,
    save: save,
    get: get,
    post: post,
    put: update,
    delete: remove
  };
}
