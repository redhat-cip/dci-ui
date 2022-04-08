export function buildWhereFromSearch(
  search: string,
  defaultSearchKey = "name"
) {
  if (!search) {
    return "state:active";
  }

  let where = [];

  if (search.indexOf("state:") === -1) {
    where.push("state:active");
  }
  if (
    search.includes("type:") ||
    search.includes("tags:") ||
    search.includes("name:")
  ) {
    where = where.concat(search.split(","));
  } else {
    const wildcardSearch = search.endsWith("*") ? search : `${search}*`;
    where.push(`${defaultSearchKey}:${wildcardSearch}`);
  }

  return where
    .map((e) => (e.toLowerCase().includes("type:") ? e.toLowerCase() : e))
    .join(",");
}
