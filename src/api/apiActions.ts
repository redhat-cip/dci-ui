import { normalize } from "normalizr";
import http from "services/http";
import { createActionsTypes } from "./apiActionsTypes";
import { getSchema } from "./schema";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { AppThunk } from "store";
import { IResourceName, IResourcesName, Resource } from "types";
import { AxiosPromise } from "axios";

export function createActions(resource: IResourceName) {
  return {
    all: (params = {}): AppThunk<AxiosPromise<any>> => {
      let endpoint = `${resource}s` as IResourcesName;
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).FETCH_ALL_REQUEST,
        });
        const { apiURL } = getState().config;

        return http({
          method: "get",
          url: `${apiURL}/api/v1/${endpoint}`,
          params,
        })
          .then((response) => {
            dispatch({
              type: createActionsTypes(resource).FETCH_ALL_SUCCESS,
              ...normalize(response.data[endpoint], getSchema(endpoint)),
            });
            dispatch({
              type: createActionsTypes(resource).SET_COUNT,
              count: response.data._meta.count,
            });
            return response;
          })
          .catch((error) => {
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    one: (id: string, params = {}): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).FETCH_REQUEST,
        });
        const { apiURL } = getState().config;
        return http({
          method: "get",
          url: `${apiURL}/api/v1/${resource}s/${id}`,
          params,
        })
          .then((response) => {
            dispatch({
              type: createActionsTypes(resource).FETCH_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            return response;
          })
          .catch((error) => {
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    create: (
      data: { name: string },
      params = {}
    ): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).CREATE_REQUEST,
        });
        const { apiURL } = getState().config;
        return http({
          method: "post",
          url: `${apiURL}/api/v1/${resource}s`,
          data,
          params,
        })
          .then((response) => {
            dispatch({
              type: createActionsTypes(resource).CREATE_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            dispatch(
              showSuccess(`${resource} ${data.name} created successfully!`)
            );
            return response;
          })
          .catch((error) => {
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    update: (data: Resource, params = {}): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).UPDATE_REQUEST,
        });
        const { apiURL } = getState().config;
        return http({
          method: "put",
          url: `${apiURL}/api/v1/${resource}s/${data.id}`,
          headers: { "If-Match": data.etag },
          data,
          params,
        })
          .then((response) => {
            dispatch({
              type: createActionsTypes(resource).UPDATE_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            dispatch(
              showSuccess(`${resource} ${data.name} updated successfully!`)
            );
            return response;
          })
          .catch((error) => {
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    clear: () => {
      return {
        type: createActionsTypes(resource).CLEAR_CACHE,
      };
    },
    delete: (data: Resource): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: createActionsTypes(resource).DELETE_REQUEST,
        });
        const { apiURL } = getState().config;
        return http({
          method: "delete",
          url: `${apiURL}/api/v1/${resource}s/${data.id}`,
          headers: { "If-Match": data.etag },
        })
          .then((response) => {
            const name = data.name ? data.name : data.id;
            dispatch(showSuccess(`${resource} ${name} deleted successfully!`));
            dispatch({
              type: createActionsTypes(resource).DELETE_SUCCESS,
              id: data.id,
            });
            return response;
          })
          .catch((error) => {
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
  };
}
