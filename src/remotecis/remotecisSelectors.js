import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTeamsById } from "teams/teamsSelectors";
import { getTimezone } from "currentUser/currentUserSelectors";
import { fromNow } from "services/date";

export const getRemotecisById = state => state.remotecis.byId;
export const getRemotecisAllIds = state => state.remotecis.allIds;
export const getRemotecis = createSelector(
  getTimezone,
  getTeamsById,
  getRemotecisById,
  getRemotecisAllIds,
  (timezone, teams, remotecis, remotecisAllIds) =>
    sortBy(
      remotecisAllIds.map(id => {
        const remoteci = remotecis[id];
        return {
          ...remoteci,
          team: teams[remoteci.team_id],
          from_now: fromNow(remoteci.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
