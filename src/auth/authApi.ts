import { ICurrentUser, IIdentity, IIdentityTeam } from "types";
import { values } from "lodash";
import { readValue, saveValue } from "services/localStorage";
import { api } from "api";

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
  identity: IIdentity,
  defaultTeam: IIdentityTeam | null,
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

const DEFAULT_TEAM_LOCASTORAGE_VALUE = "defaultTeam";

export function changeCurrentTeam(team: IIdentityTeam) {
  saveValue(DEFAULT_TEAM_LOCASTORAGE_VALUE, team);
}

export const authApi = api
  .enhanceEndpoints({
    addTagTypes: ["Auth"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCurrentUser: builder.query<ICurrentUser, void>({
        query: () => "/identity",
        transformResponse: (response: { identity: IIdentity }, meta, arg) => {
          const defaultTeam = readValue<IIdentityTeam | null>(
            DEFAULT_TEAM_LOCASTORAGE_VALUE,
            null,
          );
          return buildCurrentUser(response.identity, defaultTeam);
        },
        transformErrorResponse: () => undefined,
      }),
      updateCurrentUser: builder.mutation<ICurrentUser, ICurrentUser>({
        query(currentUser) {
          return {
            url: `/identity`,
            method: "PUT",
            body: currentUser,
            headers: { "If-Match": currentUser.etag },
          };
        },
        transformResponse: (response: { user: ICurrentUser }, meta, arg) =>
          response.user,
      }),
    }),
  });

export const { useGetCurrentUserQuery, useUpdateCurrentUserMutation } = authApi;
