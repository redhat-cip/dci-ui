import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IEnhancedTeam, ITeamsById } from "types";

export const getTeamsById = (state: RootState): ITeamsById => state.teams.byId;
export const getTeamsAllIds = (state: RootState): string[] =>
  state.teams.allIds;
export const isFetchingTeams = (state: RootState): boolean =>
  state.teams.isFetching;
export const getTeams = createSelector(
  getTeamsById,
  getTeamsAllIds,
  (teams, teamsAllIds) => {
    return sortByName<IEnhancedTeam>(
      teamsAllIds.map((id) => {
        const team = teams[id];
        return {
          ...team,
          from_now: fromNow(team.created_at),
        };
      })
    );
  }
);
export const getTeamById = (id: string | null) =>
  createSelector(getTeamsById, (teams) => {
    if (id && id in teams) return teams[id];
    return null;
  });
