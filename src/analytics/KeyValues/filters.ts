import { IKeyValueGraph } from "./KeyValuesAddGraphModal";

export function parseGraphsFromSearch(
  searchGraphs: string | null,
): IKeyValueGraph[] {
  if (searchGraphs === null) return [];
  try {
    return JSON.parse(decodeURIComponent(searchGraphs));
  } catch (error) {
    return [];
  }
}

export function createSearchFromGraphs(
  graphs: IKeyValueGraph[],
): string | null {
  if (graphs.length === 0) return null;
  return encodeURIComponent(JSON.stringify(graphs));
}
