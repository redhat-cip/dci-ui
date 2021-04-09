import { createSelector } from "reselect";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IUsersById, IEnhancedUser } from "types";

export const getUsersById = (state: RootState): IUsersById => state.users.byId;
export const getUsersAllIds = (state: RootState): string[] =>
  state.users.allIds;
export const getNbOfUsers = (state: RootState): number => state.users.count;
export const isFetchingUsers = (state: RootState): boolean =>
  state.users.isFetching;
export const getUsers = createSelector(
  getUsersById,
  getUsersAllIds,
  (users, usersAllIds) =>
    usersAllIds.map((id) => {
      const user = users[id];
      return {
        ...user,
        from_now: fromNow(user.created_at),
      } as IEnhancedUser;
    })
);
