import { sortBy } from "lodash";
import { DateTime } from "luxon";

export interface IItemWithName {
  name: string;
}

export function sortByName<T extends IItemWithName>(items: T[]): T[] {
  return sortBy(items, [(e) => e.name.toLowerCase()]);
}

export interface IItemWithCreatedAt {
  created_at: string;
}

export function sortByNewestFirst<T extends IItemWithCreatedAt>(
  items: T[]
): T[] {
  return items.sort((i1, i2) => {
    const i1CreatedAt = DateTime.fromISO(i1.created_at);
    const i2CreatedAt = DateTime.fromISO(i2.created_at);
    if (i1CreatedAt > i2CreatedAt) {
      return -1;
    }
    if (i1CreatedAt < i2CreatedAt) {
      return 1;
    }
    return 0;
  });
}

export function sortByOldestFirst<T extends IItemWithCreatedAt>(
  items: T[]
): T[] {
  return items.sort((i1, i2) => {
    const i1CreatedAt = DateTime.fromISO(i1.created_at);
    const i2CreatedAt = DateTime.fromISO(i2.created_at);
    if (i1CreatedAt > i2CreatedAt) {
      return 1;
    }
    if (i1CreatedAt < i2CreatedAt) {
      return -1;
    }
    return 0;
  });
}
