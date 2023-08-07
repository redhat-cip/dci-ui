import { isEmpty } from "lodash";
import queryString from "query-string";

export interface IComponentsFilters {
  display_name: string | null;
  tags: string[];
  type: string | null;
  state: "active" | "inactive";
}

export function buildWhereFromSearch(filters: IComponentsFilters) {
  let search = `?where=`;
  let { display_name, tags, type, state } = filters;
  let where = [`state:${state}`];

  if (display_name) {
    where.push(`display_name:${display_name}`);
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
  display_name: null,
  tags: [],
  type: null,
  state: "active",
};

export function parseWhereFromSearch(search: string): IComponentsFilters {
  const { where } = queryString.parse(search);
  const copyDefaultFilters: IComponentsFilters = JSON.parse(
    JSON.stringify(defaultComponentsFilters),
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
        case "display_name":
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
    },
  );
}
