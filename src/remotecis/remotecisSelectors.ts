import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTeamsById } from "teams/teamsSelectors";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IEnhancedRemoteci, IRemotecisById } from "types";

export const getRemotecisById = (state: RootState): IRemotecisById =>
  state.remotecis.byId;
export const getRemotecisAllIds = (state: RootState): string[] =>
  state.remotecis.allIds;
export const isFetchingRemotecis = (state: RootState): boolean =>
  state.remotecis.isFetching;
export const getRemotecis = createSelector(
  getTeamsById,
  getRemotecisById,
  getRemotecisAllIds,
  (teams, remotecis, remotecisAllIds) =>
    sortByName<IEnhancedRemoteci>(
      remotecisAllIds.map((id) => {
        const remoteci = remotecis[id];
        return {
          ...remoteci,
          team: teams[remoteci.team_id],
          from_now: fromNow(remoteci.created_at),
        };
      })
    )
);
export const getRemoteciById = (id: string | null) =>
  createSelector(getRemotecisById, (remotecis) => {
    if (id && id in remotecis) return remotecis[id];
    return null;
  });
