import { sortBy } from "lodash";
import { IItemWithName } from "types";

export function sortByName<T extends IItemWithName>(items: T[]): T[] {
  return sortBy(items, [(e) => e.name.toLowerCase()]);
}
