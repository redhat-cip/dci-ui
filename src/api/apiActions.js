import { normalize } from "normalizr";
import http from "services/http";
import { createActionsTypes } from "./apiActionsTypes";
import {showLoading, hideLoading} from "loading/loadingActions";
import * as schema from "./schema";
import { showAPIError, showSuccess } from "alerts/alertsActions";

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
        dispatch(showLoading());
        const { apiURL } = getState().config;
        return http
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
            dispatch({
              type: createActionsTypes(resource).SET_COUNT,
              count: response.data._meta.count
            });
            dispatch(hideLoading());
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            dispatch(hideLoading());
            return error;
          });
      };
    },
    one: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).FETCH_REQUEST
        });
        dispatch(showLoading());
        const { apiURL } = getState().config;
        return http
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
            dispatch(hideLoading());
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            dispatch(hideLoading());
            return error;
          });
      };
    },
    create: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).CREATE_REQUEST
        });
        dispatch(showLoading());
        const { apiURL } = getState().config;
        return http
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
            dispatch(hideLoading());
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            dispatch(hideLoading());
            return error;
          });
      };
    },
    update: (data, params = {}) => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).UPDATE_REQUEST
        });
        dispatch(showLoading());
        const { apiURL } = getState().config;
        return http
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
              ...normalize(response.data[resource], schema[resource])
            });
            dispatch(hideLoading());
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            dispatch(hideLoading());
            return error;
          });
      };
    },
    clear: () => {
      return {
        type: createActionsTypes(resource).CLEAR_CACHE
      };
    },
    delete: data => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).DELETE_REQUEST
        });
        dispatch(showLoading());
        const { apiURL } = getState().config;
        return http
          .request({
            method: "delete",
            url: `${apiURL}/api/v1/${resource}s/${data.id}`,
            headers: { "If-Match": data.etag }
          })
          .then(response => {
            const name = data.name ? data.name : data.id;
            dispatch(showSuccess(`${resource} ${name} deleted successfully!`));
            dispatch({
              type: createActionsTypes(resource).DELETE_SUCCESS,
              id: data.id
            });
            dispatch(hideLoading());
            return response;
          })
          .catch(error => {
            dispatch(showAPIError(error.response));
            dispatch(hideLoading());
            return error;
          });
      };
    }
  };
}
