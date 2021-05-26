import http from "services/http";
import { ICurrentUser, IIdentity, ITeam } from "types";
import { values } from "lodash";
import { setIdentity } from "currentUser/currentUserActions";
import { AppThunk } from "store";

function buildShortcut(team: ITeam | null) {
  if (team === null) {
    return {
      isSuperAdmin: false,
      hasEPMRole: false,
      hasReadOnlyRole: false,
      isReadOnly: false,
    };
  }
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

function buildIdentity(identity: IIdentity): ICurrentUser {
  const teams = values(identity.teams).filter((team) => team.id !== null);
  const firstTeam = teams.length === 0 ? null : teams[0];
  return {
    ...identity,
    teams,
    team: firstTeam,
    ...buildShortcut(firstTeam),
  };
}

export function getCurrentUser(): AppThunk<Promise<ICurrentUser>> {
  return (dispatch) => {
    return http.get(`/api/v1/identity`).then((response) => {
      const identity = buildIdentity(response.data.identity);
      dispatch(setIdentity(identity));
      return identity;
    });
  };
}

export function changeCurrentTeam(
  team: ITeam,
  currentUser: ICurrentUser
): AppThunk<Promise<ICurrentUser>> {
  return (dispatch) => {
    const identity = {
      ...currentUser,
      team,
      ...buildShortcut(team),
    };
    dispatch(setIdentity(identity));
    return Promise.resolve(identity);
  };
}
