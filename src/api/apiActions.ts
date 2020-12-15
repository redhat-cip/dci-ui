import { normalize } from "normalizr";
import http from "services/http";
import { createActionsTypes } from "./apiActionsTypes";
import { getSchema } from "./schema";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { AppThunk } from "store";
import { IResourceName, IResourcesName, Resource } from "types";
import { AxiosPromise } from "axios";

export function createActions(resource: IResourceName) {
  const actionsTypes = createActionsTypes(resource);

  return {
    all: (params = {}): AppThunk<AxiosPromise<any>> => {
      let endpoint = `${resource}s` as IResourcesName;
      return (dispatch, getState) => {
        dispatch({
          type: actionsTypes.FETCH_ALL_REQUEST,
        });

        return http({
          method: "get",
          url: `/api/v1/${endpoint}`,
          params,
        })
          .then((response) => {
            dispatch({
              type: actionsTypes.FETCH_ALL_SUCCESS,
              ...normalize(response.data[endpoint], getSchema(endpoint)),
            });
            dispatch({
              type: actionsTypes.SET_COUNT,
              count: response.data._meta.count,
            });
            return response;
          })
          .catch((error) => {
            dispatch({ type: actionsTypes.FETCH_ALL_FAILURE });
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    one: (id: string, params = {}): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: actionsTypes.FETCH_REQUEST,
        });
        return http({
          method: "get",
          url: `/api/v1/${resource}s/${id}`,
          params,
        })
          .then((response) => {
            dispatch({
              type: actionsTypes.FETCH_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            return response;
          })
          .catch((error) => {
            dispatch({ type: actionsTypes.FETCH_FAILURE });
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
          type: actionsTypes.CREATE_REQUEST,
        });
        return http({
          method: "post",
          url: `/api/v1/${resource}s`,
          data,
          params,
        })
          .then((response) => {
            dispatch({
              type: actionsTypes.CREATE_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            dispatch(
              showSuccess(
                "Success",
                `${resource} ${data.name} created successfully!`
              )
            );
            return response;
          })
          .catch((error) => {
            dispatch({ type: actionsTypes.CREATE_FAILURE });
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    update: (data: Resource, params = {}): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: actionsTypes.UPDATE_REQUEST,
        });
        return http({
          method: "put",
          url: `/api/v1/${resource}s/${data.id}`,
          headers: { "If-Match": data.etag },
          data,
          params,
        })
          .then((response) => {
            dispatch({
              type: actionsTypes.UPDATE_SUCCESS,
              ...normalize(response.data[resource], getSchema(resource)),
            });
            dispatch(
              showSuccess(`${resource} ${data.name} updated successfully!`)
            );
            return response;
          })
          .catch((error) => {
            dispatch({ type: actionsTypes.UPDATE_FAILURE });
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
    clear: () => {
      return {
        type: actionsTypes.CLEAR_CACHE,
      };
    },
    delete: (data: Resource): AppThunk<AxiosPromise<any>> => {
      return (dispatch, getState) => {
        dispatch({
          type: actionsTypes.DELETE_REQUEST,
        });
        return http({
          method: "delete",
          url: `/api/v1/${resource}s/${data.id}`,
          headers: { "If-Match": data.etag },
        })
          .then((response) => {
            const name = data.name ? data.name : data.id;
            dispatch(showSuccess(`${resource} ${name} deleted successfully!`));
            dispatch({
              type: actionsTypes.DELETE_SUCCESS,
              id: data.id,
            });
            return response;
          })
          .catch((error) => {
            dispatch({ type: actionsTypes.DELETE_FAILURE });
            dispatch(showAPIError(error));
            return error;
          });
      };
    },
  };
}
