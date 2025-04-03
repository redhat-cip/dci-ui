import { DateTime } from "luxon";

export function sort(s1: string, s2: string) {
  return s1.localeCompare(s2);
}

export function sortAlphabetically(items: string[]): string[] {
  return [...items].sort(sort);
}

export function sortByName<
  T extends {
    name: string;
  },
>(items: T[]): T[] {
  return [...items].sort((element1: T, element2: T) =>
    sort(element1.name, element2.name),
  );
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
  return sortByName(items).sort((item1, item2) => {
    return (
      componentTypesOrderReversed.indexOf(item2.type) -
      componentTypesOrderReversed.indexOf(item1.type)
    );
  });
}

export function sortWithSemver<
  T extends {
    name: string;
  },
>(item1: T, item2: T): number {
  const paddedName1 = item1.name.replace(/\d+/g, (n: string) =>
    n.padStart(6, "0"),
  );
  const paddedName2 = item2.name.replace(/\d+/g, (n: string) =>
    n.padStart(6, "0"),
  );

  if (paddedName1 > paddedName2) return -1;
  if (paddedName1 < paddedName2) return 1;
  return 0;
}
