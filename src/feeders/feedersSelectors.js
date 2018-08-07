
import { createSelector } from "reselect";
import {sortBy} from "lodash-es";
import { getTimezone } from "../currentUser/currentUserSelectors";
import { fromNow } from "../services/date";

export const getFeedersById = state => state.feeders.byId;
export const getFeedersAllIds = state => state.feeders.allIds;
export const getFeeders = createSelector(
  getTimezone,
  getFeedersById,
  getFeedersAllIds,
  (timezone, feeders, feedersAllIds) =>
    sortBy(
      feedersAllIds.map(id => {
        const feeder = feeders[id];
        return {
          ...feeder,
          from_now: fromNow(feeder.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
