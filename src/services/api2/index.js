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
import * as actions from "./actions";
import Constants from "./constants";
import Reducer from "./reducers";
import schemas from "./schemas";
import * as alertsActions from "../alerts/actions";

export default function(resourceString) {
  const reducer = Reducer(resourceString);
  const constants = Constants(resourceString);

  function all(params) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "get",
        url: `${state.config.apiURL}/api/v1/${resourceString}s`,
        params
      };
      return http(request)
        .then(response => {
          const type = constants.SET_LIST;
          dispatch(actions.setList(type, response.data[`${resourceString}s`]));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function get(resource, params = {}) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "get",
        url: `${state.config.apiURL}/api/v1/${resourceString}s/${resource.id}`,
        params
      };
      return http(request)
        .then(response => {
          dispatch(
            actions.set(constants.SET, response.data[`${resourceString}`])
          );
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

  function post(resource) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "post",
        url: `${state.config.apiURL}/api/v1/${resourceString}s`,
        data: clean(resource, `${resourceString}s`)
      };
      return http(request)
        .then(response => {
          dispatch(
            actions.create(constants.CREATE, response.data[`${resourceString}`])
          );
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function update(resource) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "put",
        url: `${state.config.apiURL}/api/v1/${resourceString}s/${resource.id}`,
        data: clean(resource, resourceString, { omitNil: false }),
        headers: { "If-Match": resource.etag }
      };
      return http(request)
        .then(response => {
          const etag = response.headers.etag;
          dispatch(
            actions.update(
              constants.UPDATE,
              Object.assign({}, resource, { etag })
            )
          );
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  function remove(resource) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "delete",
        url: `${state.config.apiURL}/api/v1/${resourceString}s/${resource.id}`,
        headers: { "If-Match": resource.etag }
      };
      return http(request)
        .then(response => {
          dispatch(actions.remove(constants.DELETE, resource));
          return response;
        })
        .catch(error => {
          dispatch(alertsActions.errorApi(error.response));
          throw error;
        });
    };
  }

  return {
    all: all,
    get: get,
    post: post,
    put: update,
    delete: remove,
    reducer: reducer
  };
}
