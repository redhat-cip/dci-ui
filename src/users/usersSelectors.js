import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { fromNow } from "services/date";

export const getUsersById = (state) => state.users.byId;
export const getUsersAllIds = (state) => state.users.allIds;
export const getNbOfUsers = (state) => state.users.count;
export const getUsers = createSelector(
  getUsersById,
  getUsersAllIds,
  (users, usersAllIds) =>
    sortByName(
      usersAllIds.map((id) => {
        const user = users[id];
        return {
          ...user,
          from_now: fromNow(user.created_at),
        };
      })
    )
);
