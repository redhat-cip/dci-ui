import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { getProductsById } from "products/productsSelectors";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IEnhancedTopic, ITopicsById } from "types";

export const getTopicsById = (state: RootState): ITopicsById =>
  state.topics.byId;

export const getTopicsAllIds = (state: RootState): string[] =>
  state.topics.allIds;

export const getTopicById = (id: string | null) => {
  return createSelector(getProductsById, getTopicsById, (products, topics) => {
    if (id === null) return null;
    const topic = topics[id];
    if (!topic) return null;
    return {
      ...topic,
      product: topic.product_id ? products[topic.product_id] : null,
      from_now: fromNow(topic.created_at),
    };
  });
};

export const isFetchingTopics = (state: RootState): boolean =>
  state.topics.isFetching || state.products.isFetching;

export const getTopics = createSelector(
  getProductsById,
  getTopicsById,
  getTopicsAllIds,
  (products, topics, topicsAllIds) =>
    sortByName<IEnhancedTopic>(
      topicsAllIds.map((id) => {
        const topic = topics[id];
        return {
          ...topic,
          product: topic.product_id ? products[topic.product_id] : null,
          from_now: fromNow(topic.created_at),
        };
      })
    )
);
