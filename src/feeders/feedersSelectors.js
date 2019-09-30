import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getTeamsById } from "teams/teamsSelectors";
import { fromNow } from "services/date";

export const getFeedersById = state => state.feeders.byId;
export const getFeedersAllIds = state => state.feeders.allIds;
export const getFeeders = createSelector(
  getTimezone,
  getTeamsById,
  getFeedersById,
  getFeedersAllIds,
  (timezone, teams, feeders, feedersAllIds) =>
    sortByName(
      feedersAllIds.map(id => {
        const feeder = feeders[id];
        return {
          ...feeder,
          team: teams[feeder.team_id],
          from_now: fromNow(feeder.created_at, timezone)
        };
      })
    )
);
