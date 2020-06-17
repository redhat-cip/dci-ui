import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTeamsById } from "teams/teamsSelectors";
import { fromNow } from "services/date";

export const getFeedersById = (state) => state.feeders.byId;
export const getFeedersAllIds = (state) => state.feeders.allIds;
export const getFeeders = createSelector(
  getTeamsById,
  getFeedersById,
  getFeedersAllIds,
  (teams, feeders, feedersAllIds) =>
    sortByName(
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
