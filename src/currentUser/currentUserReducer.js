import { values } from "lodash";
import * as types from "./currentUserActionsTypes";

const initialState = null;

function buildShortcut(team) {
  const adminTeamName = "admin";
  const EPMTeamName = "EPM";
  const RedHatTeamName = "Red Hat";
  return {
    isSuperAdmin: team.name === adminTeamName,
    hasEPMRole: team.name === adminTeamName || team.name === EPMTeamName,
    hasReadOnlyRole:
      team.name === adminTeamName ||
      team.name === EPMTeamName ||
      team.name === RedHatTeamName,
    isReadOnly: team.name === RedHatTeamName,
  };
}

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
