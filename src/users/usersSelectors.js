import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTimezone } from "currentUser/currentUserSelectors";
import { fromNow } from "services/date";

export const getUsersById = (state) => state.users.byId;
export const getUsersAllIds = (state) => state.users.allIds;
export const getUsers = createSelector(
  getTimezone,
  getUsersById,
  getUsersAllIds,
  (timezone, users, usersAllIds) =>
    sortByName(
      usersAllIds.map((id) => {
        const user = users[id];
        return {
          ...user,
          from_now: fromNow(user.created_at, timezone),
        };
      })
    )
);
