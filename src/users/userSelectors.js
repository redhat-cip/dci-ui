import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getTeamsById } from "teams/teamsSelectors";
import { getRolesById } from "roles/rolesSelectors";
import { fromNow } from "services/date";

export const getUsersById = state => state.users.byId;
export const getUsersAllIds = state => state.users.allIds;
export const getUsers = createSelector(
  getTimezone,
  getUsersById,
  getTeamsById,
  getRolesById,
  getUsersAllIds,
  (timezone, users, teams, roles, usersAllIds) =>
    sortBy(
      usersAllIds.map(id => {
        const user = users[id];
        return {
          ...user,
          team: teams[user.team_id],
          role: roles[user.role_id],
          from_now: fromNow(user.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
