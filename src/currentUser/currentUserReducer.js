import * as types from "./currentUserActionsTypes";

const initialState = {};

export default function(state = initialState, action) {
  const currentUser = action.currentUser;
  switch (action.type) {
    case types.SET_CURRENT_USER:
      const role = currentUser.role || "USER";
      const shortcuts = {
        isSuperAdmin: role.label === "SUPER_ADMIN",
        hasProductOwnerRole:
          role.label === "SUPER_ADMIN" || role.label === "PRODUCT_OWNER",
        hasAdminRole:
          role.label === "SUPER_ADMIN" ||
          role.label === "PRODUCT_OWNER" ||
          role.label === "ADMIN",
        hasReadOnlyRole:
          role.label === "SUPER_ADMIN" ||
          role.label === "PRODUCT_OWNER" ||
          role.label === "READ_ONLY_USER",
        isReadOnly: role.label === "READ_ONLY_USER"
      };
      return { ...state, ...currentUser, ...shortcuts };
    case types.UPDATE_CURRENT_USER:
      return {
        ...state,
        ...currentUser
      };
    case types.DELETE_CURRENT_USER:
      return {
        ...initialState
      };
    case types.SUBSCRIBED_TO_A_REMOTECI:
      return {
        ...state,
        remotecis: [action.remoteci, ...state.remotecis.slice(0)]
      };
    case types.UNSUBSCRIBED_FROM_A_REMOTECI:
      return {
        ...state,
        remotecis: state.remotecis.filter(
          remoteci => remoteci.id !== action.remoteci.id
        )
      };
    default:
      return state;
  }
}
