import qs from "qs";
import { state, Filters, WhereFilters } from "types";

function _extractWhereFilter(filters: Filters): WhereFilters {
  const { limit, offset, sort, query, ...whereFilters } = filters;
  return whereFilters;
}

function _parseWhere(
  where: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  _defaultFilters: Filters,
): WhereFilters {
  const defaultWhereFilters = _extractWhereFilter(_defaultFilters);
  if (typeof where !== "string" || where === undefined) {
    return { ...defaultWhereFilters };
  }
  return where.split(",").reduce(
    (acc: WhereFilters, filter: string) => {
      const [key, ...rest] = filter.split(":");
      const value = rest.join(":");
      switch (key) {
        case "name":
        case "display_name":
        case "team_id":
        case "email":
        case "sso_username":
        case "remoteci_id":
        case "product_id":
        case "topic_id":
        case "configuration":
        case "status":
        case "type":
          acc[key] = value;
          break;
        case "tags":
          acc.tags?.push(value);
          break;
        case "state":
          acc[key] = (value as state) || "active";
          break;
        default:
        // pass
      }
      return acc;
    },
    { ...defaultWhereFilters },
  );
}

export function offsetAndLimitToPage(offset: number, limit: number) {
  return limit > 0 ? Math.round(offset / limit) + 1 : 1;
}

export function pageAndLimitToOffset(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return offset > 0 ? offset : 0;
}

export function getDefaultFilters(): Filters {
  return {
    limit: 20,
    offset: 0,
    sort: "-created_at",
    query: null,
    name: null,
    display_name: null,
    sso_username: null,
    team_id: null,
    email: null,
    remoteci_id: null,
    product_id: null,
    topic_id: null,
    tags: [],
    configuration: null,
    status: null,
    type: null,
    state: "active" as state,
  };
}

export function parseFiltersFromSearch(
  search: string,
  initialFilters: Partial<Filters> = {},
): Filters {
  const defaultWithInitialFilters: Filters = {
    ...getDefaultFilters(),
    ...initialFilters,
  };
  const {
    limit: limitParam,
    offset: offsetParam,
    page: pageString,
    perPage: perPageString,
    sort: sortString,
    query: queryString,
    where: whereString,
  } = qs.parse(search.replace(/^\?/, ""));
  const limit =
    limitParam === undefined
      ? perPageString === undefined
        ? defaultWithInitialFilters.limit
        : parseInt(perPageString as string, 10)
      : parseInt(limitParam as string, 10);
  const offset =
    offsetParam === undefined
      ? pageString === undefined
        ? defaultWithInitialFilters.offset
        : pageAndLimitToOffset(parseInt(pageString as string, 10), limit)
      : parseInt(offsetParam as string, 10);
  const whereFilters = _parseWhere(whereString, defaultWithInitialFilters);
  const sort =
    sortString === undefined
      ? defaultWithInitialFilters.sort
      : (sortString as string);
  const query =
    queryString === undefined
      ? defaultWithInitialFilters.query
      : (queryString as string);
  return {
    limit,
    offset,
    sort,
    query,
    ...whereFilters,
  };
}

function _getWhereFromFilters(filters: Filters) {
  const whereFilters = _extractWhereFilter(filters);
  let keyValues: string[] = [];
  Object.entries(whereFilters).forEach(([key, value]) => {
    if (
      [
        "name",
        "display_name",
        "email",
        "sso_username",
        "team_id",
        "state",
        "remoteci_id",
        "product_id",
        "topic_id",
        "configuration",
        "status",
        "type",
      ].includes(key) &&
      value
    ) {
      keyValues.push(`${key}:${value}`);
    }
    if (key === "tags" && value) {
      const tags = value as string[];
      keyValues = keyValues.concat(
        [...new Set(tags)].map((t: string) => `tags:${t}`),
      );
    }
  });
  return keyValues.join(",");
}

export function createSearchFromFilters(
  partialFilters: Partial<Filters>,
): string {
  const filters = {
    ...getDefaultFilters(),
    ...partialFilters,
  };
  let search = `?limit=${filters.limit}&offset=${filters.offset}&sort=${filters.sort}`;
  const where = _getWhereFromFilters(filters);
  if ("query" in filters && filters.query) {
    search += `&query=${filters.query}`;
  } else {
    if (where) {
      search += `&where=${where}`;
    }
  }
  return search;
}
