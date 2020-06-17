import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { fromNow } from "services/date";

export const getTeamsById = (state) => state.teams.byId;
export const getTeamsAllIds = (state) => state.teams.allIds;
export const getTeams = createSelector(
  getTeamsById,
  getTeamsAllIds,
  (teams, teamsAllIds) => {
    return sortByName(
      teamsAllIds.map((id) => {
        const team = teams[id];
        return {
          ...team,
          parent_team: teams[team.parent_id],
          from_now: fromNow(team.created_at),
        };
      })
    );
  }
);
