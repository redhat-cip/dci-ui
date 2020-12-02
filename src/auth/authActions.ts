import http from "services/http";
import { ICurrentUser, ITeam } from "types";
import { values } from "lodash";
import { setIdentity } from "currentUser/currentUserActions";
import { AppThunk } from "store";

function buildShortcut(team: ITeam) {
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

function buildIdentity(identity: ICurrentUser, team: ITeam): ICurrentUser {
  return {
    ...identity,
    ...buildShortcut(team),
    team: team,
  } as ICurrentUser;
}

export function getCurrentUser(): AppThunk<Promise<ICurrentUser>> {
  return (dispatch, getState) => {
    const state = getState();
    return http
      .get(`${state.config.apiURL}/api/v1/identity`)
      .then((response) => {
        const identity = response.data.identity;
        const firstTeam = values(identity.teams)[0];
        const enhancedIdentity = buildIdentity(identity, firstTeam);
        dispatch(setIdentity(enhancedIdentity));
        return enhancedIdentity;
      });
  };
}

export function changeCurrentTeam(team: ITeam): AppThunk<ICurrentUser> {
  return (dispatch, getState) => {
    const state = getState();
    const identity = buildIdentity(state.currentUser, team);
    dispatch(setIdentity(identity));
    return identity;
  };
}