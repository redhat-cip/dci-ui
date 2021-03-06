import queryString from "query-string";
import { isEmpty, sortedUniq } from "lodash";
import {
  IJobStateStatus,
  IJobFilters,
  DCIListParams,
  IUserFilters,
} from "types";

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

export function parseFiltersFromSearch(search: string): IJobFilters {
  const { page = "1", perPage = "20", where } = queryString.parse(search);
  const copyDefaultFilters = JSON.parse(JSON.stringify(defaultFilters));
  if (typeof where !== "string" || isEmpty(where)) return copyDefaultFilters;
  return where.split(",").reduce(
    (acc: IJobFilters, filter: string) => {
      const [key, ...rest] = filter.split(":");
      const value = rest.join(":");
      switch (key) {
        case "team_id":
        case "product_id":
        case "remoteci_id":
        case "topic_id":
          acc[key] = value;
          break;
        case "tags":
          acc.tags?.push(value);
          break;
        case "status":
          if (value) {
            acc.status = value as IJobStateStatus;
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

function _getWhereFromFilters(filters: IJobFilters | IUserFilters) {
  let keyValues: string[] = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (
      [
        "product_id",
        "team_id",
        "remoteci_id",
        "topic_id",
        "status",
        "email",
      ].includes(key) &&
      value
    ) {
      keyValues.push(`${key}:${value}`);
    }
    if (key === "tags" && value.length > 0) {
      const tags = value as string[];
      keyValues = keyValues.concat(
        sortedUniq(tags).map((t: string) => `tags:${t}`)
      );
    }
  });
  return keyValues.join(",");
}

export function getParamsFromFilters(filters: IJobFilters | IUserFilters) {
  let params: DCIListParams = {
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  };
  const where = _getWhereFromFilters(filters);
  if (where) {
    params.where = where;
  }
  if ("sort" in filters) {
    params.sort = filters.sort;
  }
  return params;
}

export function createSearchFromFilters(filters: IJobFilters | IUserFilters) {
  let search = `?page=${filters.page}&perPage=${filters.perPage}`;
  const where = _getWhereFromFilters(filters);
  if (where) {
    search += `&where=${where}`;
  }
  return search;
}
