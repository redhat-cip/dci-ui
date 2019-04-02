import * as types from "./loadingActionsTypes";

const initialState = {
  isLoading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOADING_STARTED:
      return {
        ...state,
        isLoading: true
      };
    case types.LOADING_STOPPED:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}
