import { sortBy } from "lodash";

interface IItemWithName {
  name: string;
}

export function sortByName<T extends IItemWithName>(items: T[]): T[] {
  return sortBy(items, [(e) => e.name.toLowerCase()]);
}
