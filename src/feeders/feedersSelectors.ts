import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTeamsById } from "teams/teamsSelectors";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IFeedersById, IEnhancedFeeder } from "types";

export const getFeedersById = (state: RootState): IFeedersById =>
  state.feeders.byId;
export const getFeedersAllIds = (state: RootState): string[] =>
  state.feeders.allIds;
export const getFeeders = createSelector(
  getTeamsById,
  getFeedersById,
  getFeedersAllIds,
  (teams, feeders, feedersAllIds) =>
    sortByName<IEnhancedFeeder>(
      feedersAllIds.map((id) => {
        const feeder = feeders[id];
        return {
          ...feeder,
          team: teams[feeder.team_id],
          from_now: fromNow(feeder.created_at),
        };
      })
    )
);
