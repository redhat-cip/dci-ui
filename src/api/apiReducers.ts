import { omitBy, merge, isEmpty, keys } from "lodash";
import { createActionsTypes } from "./apiActionsTypes";
import { IApiState } from "types";

const initialState: IApiState = {
  byId: {},
  allIds: [],
  isFetching: false,
  count: 0,
};

function mergeEntities(state: IApiState, resources: IApiState["byId"]) {
  const byId = omitBy(merge({}, state.byId, resources), isEmpty);
  return {
    ...state,
    byId,
    allIds: keys(byId),
  };
}

interface apiAction {
  [x: string]: any;
}

export function createReducer(resource: string) {
  const resources = `${resource}s`;
  return (state = initialState, action: apiAction) => {
    const actionType = createActionsTypes(resource);
    switch (action.type) {
      case actionType.FETCH_ALL_REQUEST:
        return {
          ...state,
          isFetching: true,
        };
      case actionType.FETCH_ALL_SUCCESS:
        return {
          ...mergeEntities(state, action.entities[resources]),
          isFetching: false,
        };
      case actionType.FETCH_ALL_FAILURE:
        return {
          ...state,
          isFetching: false,
        };
      case actionType.CLEAR_CACHE:
        return {
          ...initialState,
        };
      case actionType.DELETE_SUCCESS:
        const byId = { ...state.byId };
        delete byId[action.id];
        return {
          ...state,
          isFetching: false,
          byId,
          allIds: keys(byId),
        };
      case actionType.SET_COUNT:
        return {
          ...state,
          count: action.count,
        };
      default:
        if (action.entities && action.entities[resources]) {
          return mergeEntities(state, action.entities[resources]);
        }
        return state;
    }
  };
}
