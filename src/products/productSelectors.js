import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTimezone } from "currentUser/currentUserSelectors";
import { fromNow } from "services/date";

export const getProductsById = (state) => state.products.byId;
export const getProductsAllIds = (state) => state.products.allIds;
export const getProducts = createSelector(
  getTimezone,
  getProductsById,
  getProductsAllIds,
  (timezone, products, productsAllIds) =>
    sortByName(
      productsAllIds.map((id) => {
        const product = products[id];
        return {
          ...product,
          from_now: fromNow(product.created_at, timezone),
        };
      })
    )
);
