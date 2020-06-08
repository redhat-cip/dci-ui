import { sortBy } from "lodash";

export function sortByName(items) {
  return sortBy(items, [(e) => e.name.toLowerCase()]);
}
