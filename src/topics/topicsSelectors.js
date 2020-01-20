import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getTimezone } from "currentUser/currentUserSelectors";
import { getProductsById } from "products/productSelectors";
import { fromNow } from "services/date";

export const getTopicsById = state => state.topics.byId;
export const getTopicsAllIds = state => state.topics.allIds;
export const getTopicById = id => {
  return createSelector(
    getTimezone,
    getProductsById,
    getTopicsById,
    (timezone, products, topics) => {
      const topic = topics[id];
      if (!topic) return null;
      return {
        ...topic,
        product: topic.product_id ? products[topic.product_id] : null,
        next_topic: topic.next_topic_id ? topics[topic.next_topic_id] : null,
        from_now: fromNow(topic.created_at, timezone)
      };
    }
  );
};
export const getTopics = createSelector(
  getTimezone,
  getProductsById,
  getTopicsById,
  getTopicsAllIds,
  (timezone, products, topics, topicsAllIds) =>
    sortByName(
      topicsAllIds.map(id => {
        const topic = topics[id];
        return {
          ...topic,
          product: topic.product_id ? products[topic.product_id] : null,
          next_topic: topic.next_topic_id ? topics[topic.next_topic_id] : null,
          from_now: fromNow(topic.created_at, timezone)
        };
      })
    )
);
