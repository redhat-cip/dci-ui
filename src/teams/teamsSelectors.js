import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "currentUser/currentUserSelectors";
import { fromNow } from "services/date";

export const getTeamsById = state => state.teams.byId;
export const getTeamsAllIds = state => state.teams.allIds;
export const getTeams = createSelector(
  getTimezone,
  getTeamsById,
  getTeamsAllIds,
  (timezone, teams, teamsAllIds) => {
    return sortBy(
      teamsAllIds.map(id => {
        const team = teams[id];
        return {
          ...team,
          parent_team: teams[team.parent_id],
          from_now: fromNow(team.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    );
  }
);
