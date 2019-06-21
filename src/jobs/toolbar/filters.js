import { isEmpty, find, differenceWith } from "lodash";

export function createTeamsFilter(teams) {
  const teamsWithRemotecis = teams.filter(team => !isEmpty(team.remotecis));
  return teamsWithRemotecis.map(team => ({
    id: team.id,
    key: "team_id",
    name: team.name,
    value: team.id,
    filterValues: team.remotecis.map(remoteci => ({
      key: "remoteci_id",
      name: remoteci.name,
      value: remoteci.id
    }))
  }));
}

export function createTopicsFilter(topics) {
  return topics.map(topic => ({
    id: topic.id,
    key: "topic_id",
    name: topic.name,
    value: topic.id
  }));
}

export function createProductsFilter(products) {
  return products.map(product => ({
    id: product.id,
    key: "product_id",
    name: product.name,
    value: product.id
  }));
}

export function getCurrentFilters(activeFilters, filters) {
  return activeFilters.reduce((acc, filter) => {
    const keyFilter = find(filters, { key: filter.key, value: filter.value });
    acc[filter.key] = keyFilter ? keyFilter : null;
    return acc;
  }, {});
}

export function removeFilters(filters, keys) {
  return differenceWith(filters, keys, (filter, key) => filter.key === key);
}

export function removeFilter(filters, key) {
  return removeFilters(filters, [key]);
}
