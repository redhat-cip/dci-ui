import * as types from "./currentUserActionsTypes";

const initialState = {};

function buildShortcut(role) {
  return {
    isSuperAdmin: role === "SUPER_ADMIN",
    hasProductOwnerRole: role === "SUPER_ADMIN" || role === "PRODUCT_OWNER",
    hasReadOnlyRole:
      role === "SUPER_ADMIN" ||
      role === "PRODUCT_OWNER" ||
      role === "READ_ONLY_USER",
    isReadOnly: role === "READ_ONLY_USER"
  };
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_IDENTITY:
      const identity = action.identity;
      const firstTeam = Object.values(identity.teams)[0];
      return { ...state, ...identity, timezone: "UTC", ...buildShortcut(firstTeam.role), team: firstTeam };
    case types.SET_ACTIVE_TEAM:
      return {
        ...state,
        team: action.team,
        ...buildShortcut(action.team.role)
      };
    case types.UPDATE_CURRENT_USER:
      return {
        ...state,
        ...action.currentUser
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
