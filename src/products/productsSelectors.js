import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getTeamsById } from "teams/teamsSelectors";
import { fromNow } from "services/date";

export const getProductsById = state => state.products.byId;
export const getProductsAllIds = state => state.products.allIds;
export const getProducts = createSelector(
  getTimezone,
  getTeamsById,
  getProductsById,
  getProductsAllIds,
  (timezone, teams, products, productsAllIds) =>
    sortBy(
      productsAllIds.map(id => {
        const product = products[id];
        return {
          ...product,
          team: teams[product.team_id],
          from_now: fromNow(product.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
