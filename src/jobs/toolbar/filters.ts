import queryString from "query-string";
import { isEmpty } from "lodash";
import { Status, Filters, DCIListParams } from "types";

export const defaultFilters = {
  team_id: null,
  product_id: null,
  topic_id: null,
  remoteci_id: null,
  tags: [],
  status: null,
  page: 1,
  perPage: 20,
};

export function parseFiltersFromSearch(search: string): Filters {
  const { page = "1", perPage = "20", where } = queryString.parse(search);
  const copyDefaultFilters = JSON.parse(JSON.stringify(defaultFilters));
  if (typeof where !== "string" || isEmpty(where)) return copyDefaultFilters;
  return where.split(",").reduce(
    (acc: Filters, filter: string) => {
      const [key, value] = filter.split(":");
      switch (key) {
        case "team_id":
        case "product_id":
        case "remoteci_id":
        case "topic_id":
          acc[key] = value;
          break;
        case "tags":
          acc.tags.push(value);
          break;
        case "status":
          if (value) {
            acc.status = value as Status;
          }
          break;
        default:
        // pass
      }
      return acc;
    },
    {
      ...copyDefaultFilters,
      page: parseInt(page as string, 10),
      perPage: parseInt(perPage as string, 10),
    }
  );
}

function _getWhereFromFilters(filters: Filters) {
  let keyValues = [];
  if (filters.product_id) {
    keyValues.push(`product_id:${filters.product_id}`);
  }
  if (filters.team_id) {
    keyValues.push(`team_id:${filters.team_id}`);
  }
  if (filters.remoteci_id) {
    keyValues.push(`remoteci_id:${filters.remoteci_id}`);
  }
  if (filters.topic_id) {
    keyValues.push(`topic_id:${filters.topic_id}`);
  }
  if (filters.status) {
    keyValues.push(`status:${filters.status}`);
  }
  if (filters.tags && filters.tags.length > 0) {
    keyValues = keyValues.concat(filters.tags.map((t) => `tags:${t}`));
  }
  return keyValues.join(",");
}

export function getParamsFromFilters(filters: Filters) {
  let params: DCIListParams = {
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  };
  const where = _getWhereFromFilters(filters);
  if (where) {
    params["where"] = where;
  }
  return params;
}

export function createSearchFromFilters(filters: Filters) {
  let search = `?page=${filters.page}&perPage=${filters.perPage}`;
  const where = _getWhereFromFilters(filters);
  if (where) {
    search += `&where=${where}`;
  }
  return search;
}
