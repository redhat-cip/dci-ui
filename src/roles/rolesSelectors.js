import { createSelector } from "reselect";
import {values} from "lodash";

export const getRolesById = state => state.roles.byId;
export const getRolesAllIds = state => state.roles.allIds;
export const getRoles = createSelector(
  getRolesById,
  roles => values(roles)
);
