import { createSelector } from "reselect";

export const getRolesById = state => state.roles.byId;
export const getRolesAllIds = state => state.roles.allIds;
export const getRoles = createSelector(
  getRolesById,
  roles => Object.values(roles)
);
