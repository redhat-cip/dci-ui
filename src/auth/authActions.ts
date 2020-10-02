import http from "services/http";
import { Identity, Team } from "types";
import { values } from "lodash";
import { setIdentity } from "currentUser/currentUserActions";
import { AppThunk } from "store";

function buildShortcut(team: Team) {
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

function buildIdentity(identity: Identity, team: Team): Identity {
  return {
    ...identity,
    ...buildShortcut(team),
    team: team,
  } as Identity;
}

export function getCurrentUser(): AppThunk<Promise<Identity>> {
  return (dispatch, getState) => {
    const state = getState();
    return http
      .get(`${state.config.apiURL}/api/v1/identity`)
      .then((response) => {
        const identity = response.data.identity;
        const firstTeam = values(identity.teams)[0];
        dispatch(setIdentity(buildIdentity(identity, firstTeam)));
        return identity;
      });
  };
}

export function changeCurrentTeam(team: Team): AppThunk<Identity> {
  return (dispatch, getState) => {
    const state = getState();
    const identity = buildIdentity(state.currentUser, team);
    dispatch(setIdentity(identity));
    return identity;
  };
}
