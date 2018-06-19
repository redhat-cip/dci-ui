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
import { normalize } from "normalizr";
import { createActionsTypes } from "./actionsTypes";
import * as schema from "./schema";
import { showAPIError, showSuccess } from "../Alerts/AlertsActions";

export function createActions(endpoint) {
  return {
    all: (params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(endpoint).FETCH_ALL_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "get",
            url: `${apiURL}/api/v1/${endpoint}s`,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(endpoint).FETCH_ALL_SUCCESS,
              ...normalize(
                response.data[`${endpoint}s`],
                schema[`${endpoint}s`]
              )
            });
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            return error;
          });
      };
    },
    one: (resource, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(endpoint).FETCH_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "get",
            url: `${apiURL}/api/v1/${endpoint}s/${resource.id}`,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(endpoint).FETCH_SUCCESS,
              ...normalize(response.data[endpoint], schema[endpoint])
            });
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            return error;
          });
      };
    },
    create: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(endpoint).CREATE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "post",
            url: `${apiURL}/api/v1/${endpoint}s`,
            data,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(endpoint).CREATE_SUCCESS,
              ...normalize(response.data[endpoint], schema[endpoint])
            });
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            return error;
          });
      };
    },
    update: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(endpoint).UPDATE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "put",
            url: `${apiURL}/api/v1/${endpoint}s/${data.id}`,
            headers: { "If-Match": data.etag },
            data,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(endpoint).UPDATE_SUCCESS,
              ...normalize(
                { ...data, etag: response.headers.etag },
                schema[endpoint]
              )
            });
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            return error;
          });
      };
    },
    delete: resource => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(endpoint).DELETE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "delete",
            url: `${apiURL}/api/v1/${endpoint}s/${resource.id}`,
            headers: { "If-Match": resource.etag }
          })
          .then(response => {
            dispatch(
              showSuccess(`${endpoint} ${resource.name} deleted successfully!`)
            );
            dispatch({
              type: createActionsTypes(endpoint).DELETE_SUCCESS,
              id: resource.id
            });
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            return error;
          });
      };
    }
  };
}
