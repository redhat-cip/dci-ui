import * as types from "./currentUserActionsTypes";

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_IDENTITY:
      return {
        ...state,
        ...action.identity,
      };
    case types.UPDATE_CURRENT_USER:
      return {
        ...state,
        ...action.currentUser,
      };
    case types.DELETE_CURRENT_USER:
      return {
        ...initialState,
      };
    case types.SUBSCRIBED_TO_A_REMOTECI:
      return {
        ...state,
        remotecis: [action.remoteci, ...state.remotecis.slice(0)],
      };
    case types.UNSUBSCRIBED_FROM_A_REMOTECI:
      return {
        ...state,
        remotecis: state.remotecis.filter(
          (remoteci) => remoteci.id !== action.remoteci.id
        ),
      };
    default:
      return state;
  }
}
