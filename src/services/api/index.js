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
import Reducer from "./reducers";
import Actions from "./actions";
import schemas from "./schemas";

export default function(resourceString) {
  const constants = Constants(resourceString);
  const reducer = Reducer(resourceString);
  const actions = Actions(resourceString);
  const schema = schemas[resourceString];

  // GET /resources
  function all(params) {
    return (dispatch, getState) => {
      dispatch(actions.fetchStart());
      const state = getState();
      return getList(state, params, dispatch)
        .catch(err => {
          dispatch(actions.fetchKo(err.response.data));
          throw err;
        });
    };
  }

  function sync(params) {
    return (dispatch, getState) => {
      const state = getState();
      if(itemsEmpty(state)){
        return all(params)(dispatch, getState);
      }
      return getList(state, params, dispatch);
    };
  }

  function itemsEmpty(state) {
    return state[`${resourceString}s`].items.length === 0;
  }

  function getList(state, params, dispatch) {
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/${resourceString}s`,
      params
    };
    return http(request)
      .then(response => {
        dispatch(actions.fetchOk(response.data[`${resourceString}s`]));
        return response;
      });
  }

  // GET /resources/:id:
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
          dispatch(actions.set(response.data[`${resourceString}`]));
          return response;
        });
    };
  }

  function shouldGet(state, resource) {
    const item = state[`${resourceString}s`].item;
    return !(item && item.id === resource.id);
  }

  function getIfNeeded(resource, params = {}) {
    return (dispatch, getState) => {
      if (shouldGet(getState(), resource)) {
        return dispatch(get(resource, params));
      }
    };
  }

  // POST /resources
  function create(resource, cleanNullValue = true) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "post",
        url: `${state.config.apiURL}/api/v1/${resourceString}s`,
        data: cleanWithSchema(resource, schema, cleanNullValue)
      };
      return http(request).then(response => {
        dispatch(actions.create(response.data[`${resourceString}`]));
        return response;
      });
    };
  }

  // PUT /resources/:id:
  function update(resource, cleanNullValue = true) {
    return (dispatch, getState) => {
      const state = getState();
      const request = {
        method: "put",
        url: `${state.config.apiURL}/api/v1/${resourceString}s/${resource.id}`,
        data: cleanWithSchema(resource, schema, cleanNullValue),
        headers: { "If-Match": resource.etag }
      };
      return http(request)
        .then(response => {
          const etag = response.headers.etag;
          dispatch(actions.update(Object.assign({}, resource, { etag })));
          return response;
        });
    };
  }

  function cleanWithSchema(resource, schema, cleanNullValue) {
    const newResource = cleanNullValue ? omitBy(resource, isNil) : resource;
    return pick(newResource, schema);
  }

  // DELETE /resources/:id:
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
          dispatch(actions.remove(resource));
          return response;
        });
    };
  }

  return {
    all: all,
    sync: sync,
    get: get,
    getIfNeeded: getIfNeeded,
    put: update,
    post: create,
    delete: remove,
    actions,
    reducer,
    constants
  };
}
