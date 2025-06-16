import { state, Filters, WhereFilters } from "types";

function _extractWhereFilter(filters: Filters): WhereFilters {
  const { limit, offset, sort, query, ...whereFilters } = filters;
  return whereFilters;
}

function _parseWhere(
  where: string | null,
  _defaultFilters: Filters,
): WhereFilters {
  const defaultWhereFilters = _extractWhereFilter(_defaultFilters);
  if (where === null) {
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
        case "pipeline_id":
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
        case "tags": {
          // tags filter may include multiple values separated by '|'
          const values = value.split("|");
          acc.tags?.push(...values);
          break;
        }
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
    pipeline_id: null,
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
  const params = new URLSearchParams(search);
  const defaultWithInitialFilters: Filters = {
    ...getDefaultFilters(),
    ...initialFilters,
    ...Object.fromEntries(
      [...params.entries()].filter(
        ([key]) => key !== "page" && key !== "perPage",
      ),
    ),
  };
  const limitParam = params.get("limit");
  const offsetParam = params.get("offset");
  const pageString = params.get("page");
  const perPageString = params.get("perPage");
  const sortString = params.get("sort");
  const queryString = params.get("query");
  const whereString = params.get("where");
  const limit =
    limitParam === null
      ? perPageString === null
        ? defaultWithInitialFilters.limit
        : parseInt(perPageString as string, 10)
      : parseInt(limitParam as string, 10);
  const offset =
    offsetParam === null
      ? pageString === null
        ? defaultWithInitialFilters.offset
        : pageAndLimitToOffset(parseInt(pageString as string, 10), limit)
      : parseInt(offsetParam as string, 10);
  const whereFilters = _parseWhere(whereString, defaultWithInitialFilters);
  const sort =
    sortString === null
      ? defaultWithInitialFilters.sort
      : (sortString as string);
  const query =
    queryString === null
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

type FlexibleFilters = Partial<Filters> & { [key: string]: any };

export function createSearchFromFilters(
  partialFilters: FlexibleFilters,
): string {
  const filters = {
    ...getDefaultFilters(),
    ...partialFilters,
  };
  const finalFilters: FlexibleFilters = {};
  const where: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (
      [
        "name",
        "display_name",
        "email",
        "sso_username",
        "team_id",
        "pipeline_id",
        "state",
        "remoteci_id",
        "product_id",
        "topic_id",
        "configuration",
        "status",
        "type",
      ].indexOf(key) !== -1 &&
      value
    ) {
      where.push(`${key}:${value}`);
    } else if (key === "tags" && value) {
      const tags = value as string[];
      const uniqTags = [...new Set(tags)];
      if (uniqTags.length > 0) {
        where.push(`tags:${uniqTags.join("|")}`);
      }
    } else {
      if (value !== null) {
        finalFilters[key] = value;
      }
    }
  }

  if (!("query" in finalFilters)) {
    finalFilters["where"] = where.join(",");
  }

  return `?${Object.entries(finalFilters)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;
}
