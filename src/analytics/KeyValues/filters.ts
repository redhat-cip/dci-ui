import { IKeyValueGraph, IKeyValueGraphV1 } from "./keyValuesTypes";

function convertGraphTov2Graph(
  graphs: (IKeyValueGraph | IKeyValueGraphV1)[],
): IKeyValueGraph[] {
  return graphs.map((g) => ({
    ...g,
    keys: g.keys.map((k) => ({ axis: "left", ...k })),
  }));
}

export function parseGraphsFromSearch(
  searchGraphs: string | null,
): IKeyValueGraph[] {
  if (searchGraphs === null) return [];
  try {
    const graphs: (IKeyValueGraph | IKeyValueGraphV1)[] = JSON.parse(
      decodeURIComponent(searchGraphs),
    );
    return convertGraphTov2Graph(graphs);
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
