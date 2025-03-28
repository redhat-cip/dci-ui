import { DateTime } from "luxon";

export function sort(s1: string, s2: string) {
  return s1.localeCompare(s2);
}

export function sortByName<
  T extends {
    name: string;
  },
>(element1: T, element2: T) {
  return sort(element1.name, element2.name);
}

interface IItemWithCreatedAtAndReleasedAtAndUpdatedAt {
  created_at: string;
  updated_at: string;
  released_at: string;
}

export function sortByNewestFirst<
  T extends Partial<IItemWithCreatedAtAndReleasedAtAndUpdatedAt>,
>(
  items: T[],
  key: "created_at" | "updated_at" | "released_at" = "created_at",
): T[] {
  return [...items].sort((i1, i2) => {
    const iso1 = i1[key];
    const iso2 = i2[key];
    if (iso1 === undefined || iso2 === undefined) {
      return 0;
    }
    const i1CreatedAt = DateTime.fromISO(iso1);
    const i2CreatedAt = DateTime.fromISO(iso2);
    if (i1CreatedAt > i2CreatedAt) {
      return -1;
    }
    if (i1CreatedAt < i2CreatedAt) {
      return 1;
    }
    return 0;
  });
}

export function sortByOldestFirst<
  T extends Partial<IItemWithCreatedAtAndReleasedAtAndUpdatedAt>,
>(
  items: T[],
  key: "created_at" | "updated_at" | "released_at" = "created_at",
): T[] {
  return sortByNewestFirst(items, key).reverse();
}

export function sortByMainComponentType<
  T extends {
    name: string;
    type: string;
  },
>(items: T[]): T[] {
  const componentTypesOrderReversed = ["ocp", "compose-noinstall", "compose"];
  return items.sort(sortByName).sort((item1, item2) => {
    return (
      componentTypesOrderReversed.indexOf(item2.type) -
      componentTypesOrderReversed.indexOf(item1.type)
    );
  });
}
