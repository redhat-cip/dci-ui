import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "../currentUser/currentUserSelectors";
import { fromNow } from "../services/date";

export const getUsersById = state => state.users.byId;
export const getUsersAllIds = state => state.users.allIds;
export const getUsers = createSelector(
  getTimezone,
  getUsersById,
  getUsersAllIds,
  (timezone, users, usersAllIds) =>
    sortBy(
      usersAllIds.map(id => {
        const user = users[id];
        return {
          ...user,
          from_now: fromNow(user.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
