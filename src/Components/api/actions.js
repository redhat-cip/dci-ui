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

export function createActions(resource) {
  return {
    all: (params = {}) => {
      let endpoint = `${resource}s`;
      if (params && params.endpoint) {
        endpoint = params.endpoint;
        delete params.endpoint;
      }
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).FETCH_ALL_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "get",
            url: `${apiURL}/api/v1/${endpoint}`,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(resource).FETCH_ALL_SUCCESS,
              ...normalize(
                response.data[`${resource}s`],
                schema[`${resource}s`]
              )
            });
            return response;
          })
          .catch(error => {
            dispatch({
              type: createActionsTypes(resource).FETCH_ALL_FAILURE,
              message:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                "Something went wrong"
            });
            return error;
          });
      };
    },
    one: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).FETCH_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "get",
            url: `${apiURL}/api/v1/${resource}s/${data.id}`,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(resource).FETCH_SUCCESS,
              ...normalize(response.data[resource], schema[resource])
            });
            return response;
          })
          .catch(error => {
            dispatch({
              type: createActionsTypes(resource).FETCH_FAILURE,
              message:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                "Something went wrong"
            });
            return error;
          });
      };
    },
    create: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).CREATE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "post",
            url: `${apiURL}/api/v1/${resource}s`,
            data,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(resource).CREATE_SUCCESS,
              ...normalize(response.data[resource], schema[resource])
            });
            return response;
          })
          .catch(error => {
            dispatch({
              type: createActionsTypes(resource).CREATE_FAILURE,
              message:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                "Something went wrong"
            });
            return error;
          });
      };
    },
    update: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).UPDATE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "put",
            url: `${apiURL}/api/v1/${resource}s/${data.id}`,
            headers: { "If-Match": data.etag },
            data,
            params
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(resource).UPDATE_SUCCESS,
              ...normalize(
                { ...data, etag: response.headers.etag },
                schema[resource]
              )
            });
            return response;
          })
          .catch(error => {
            dispatch({
              type: createActionsTypes(resource).UPDATE_FAILURE,
              message:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                "Something went wrong"
            });
            return error;
          });
      };
    },
    delete: data => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).DELETE_REQUEST
        });
        const { apiURL } = getState().config;
        return axios
          .request({
            method: "delete",
            url: `${apiURL}/api/v1/${resource}s/${data.id}`,
            headers: { "If-Match": data.etag }
          })
          .then(response => {
            dispatch({
              type: createActionsTypes(resource).DELETE_SUCCESS,
              id: data.id
            });
            return response;
          })
          .catch(error => {
            dispatch({
              type: createActionsTypes(resource).DELETE_FAILURE,
              message:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                "Something went wrong"
            });
            return error;
          });
      };
    }
  };
}
