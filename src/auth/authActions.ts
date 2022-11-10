import http from "services/http";
import { ICurrentUser, IIdentity, ITeam } from "types";
import { values } from "lodash";
import { setIdentity } from "currentUser/currentUserActions";
import { AppThunk } from "store";
import { readValue, saveValue } from "services/localStorage";

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

export function buildIdentity(
  identity: IIdentity,
  defaultTeam: ITeam | null
): ICurrentUser {
  const teams = values(identity.teams).filter((team) => team.id !== null);
  const firstTeam = teams.length === 0 ? null : teams[0];
  const team =
    defaultTeam === null || !(defaultTeam.id in identity.teams)
      ? firstTeam
      : defaultTeam;
  return {
    ...identity,
    teams,
    team,
    ...buildShortcut(team),
  };
}

export function getCurrentUser(): AppThunk<Promise<ICurrentUser>> {
  // gvincent todo: should be returned by the backend
  const defaultTeam = readValue<ITeam | null>("defaultTeam", null);
  return (dispatch) => {
    return http.get(`/api/v1/identity`).then((response) => {
      const identity = buildIdentity(response.data.identity, defaultTeam);
      dispatch(setIdentity(identity));
      return identity;
    });
  };
}

export function changeCurrentTeam(
  team: ITeam,
  currentUser: ICurrentUser
): AppThunk<Promise<ICurrentUser>> {
  saveValue("defaultTeam", team);
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
