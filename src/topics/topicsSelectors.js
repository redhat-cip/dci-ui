import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getProductsById } from "products/productSelectors";
import { fromNow } from "services/date";

export const getTopicsById = state => state.topics.byId;
export const getTopicsAllIds = state => state.topics.allIds;
export const getTopics = createSelector(
  getTimezone,
  getProductsById,
  getTopicsById,
  getTopicsAllIds,
  (timezone, products, topics, topicsAllIds) =>
    sortBy(
      topicsAllIds.map(id => {
        const topic = topics[id];
        return {
          ...topic,
          product: topic.product_id ? products[topic.product_id] : null,
          next_topic: topic.next_topic_id ? topics[topic.next_topic_id] : null,
          from_now: fromNow(topic.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
