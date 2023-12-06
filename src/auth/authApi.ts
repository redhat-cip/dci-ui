import http from "services/http";
import { ICurrentUser, IIdentity, IIdentityTeam } from "types";
import { values } from "lodash";
import { readValue, saveValue } from "services/localStorage";

function buildShortcut(team: IIdentityTeam | null) {
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

export function buildCurrentUser(
  currentUser: IIdentity,
  defaultTeam: IIdentityTeam | null,
): ICurrentUser {
  const teams = values(currentUser.teams).filter((team) => team.id !== null);
  const firstTeam = teams.length === 0 ? null : teams[0];
  const team =
    defaultTeam === null || !(defaultTeam.id in currentUser.teams)
      ? firstTeam
      : defaultTeam;
  return {
    ...currentUser,
    teams,
    team,
    ...buildShortcut(team),
  };
}

export function getCurrentUser(): Promise<ICurrentUser> {
  // gvincent todo: should be returned by the backend
  const defaultTeam = readValue<IIdentityTeam | null>("defaultTeam", null);
  return http.get(`/api/v1/identity`).then((response) => {
    return buildCurrentUser(response.data.identity, defaultTeam);
  });
}

export function updateCurrentUser(
  currentUser: ICurrentUser,
): Promise<ICurrentUser> {
  return http({
    method: "put",
    url: "/api/v1/identity",
    data: currentUser,
    headers: { "If-Match": currentUser.etag },
  }).then((response) => response.data.user);
}

export function changeCurrentTeam(
  currentUser: ICurrentUser,
  team: IIdentityTeam,
): ICurrentUser {
  saveValue("defaultTeam", team);
  return {
    ...currentUser,
    team,
    ...buildShortcut(team),
  };
}
