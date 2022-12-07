import { isEmpty } from "lodash";
import queryString from "query-string";

export interface IComponentsFilters {
  canonical_project_name: string | null;
  tags: string[];
  type: string | null;
  state: "active" | "inactive";
}

export function buildWhereFromSearch(filters: IComponentsFilters) {
  let search = `?where=`;
  let { canonical_project_name, tags, type, state } = filters;
  let where = [`state:${state}`];

  if (canonical_project_name) {
    const wildcardCanonicalProjectName = canonical_project_name.endsWith("*")
      ? canonical_project_name
      : `${canonical_project_name}*`;
    where.push(`canonical_project_name:${wildcardCanonicalProjectName}`);
  }

  if (type) {
    where.push(`type:${type.toLowerCase()}`);
  }

  if (tags.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      where.push(`tags:${tag}`);
    }
  }

  search += where.join(",");

  return search;
}

export const defaultComponentsFilters: IComponentsFilters = {
  canonical_project_name: null,
  tags: [],
  type: null,
  state: "active",
};

export function parseWhereFromSearch(search: string): IComponentsFilters {
  const { where } = queryString.parse(search);
  const copyDefaultFilters: IComponentsFilters = JSON.parse(
    JSON.stringify(defaultComponentsFilters)
  );
  if (typeof where !== "string" || isEmpty(where)) {
    return {
      ...copyDefaultFilters,
    };
  }
  return where.split(",").reduce(
    (acc: IComponentsFilters, filter: string) => {
      const [key, ...rest] = filter.split(":");
      const value = rest.join(":");
      switch (key) {
        case "type":
        case "canonical_project_name":
          acc[key] = value;
          break;
        case "tags":
          acc.tags?.push(value);
          break;
        case "state":
          acc.state = value === "inactive" ? value : "active";
          break;
        default:
        // pass
      }
      return acc;
    },
    {
      ...copyDefaultFilters,
    }
  );
}
