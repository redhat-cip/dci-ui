import type { IKeyValueGraph, IKeyValueGraphV1 } from "./keyValuesTypes";

function convertGraphTov2Graph(
  graphs: (IKeyValueGraph | IKeyValueGraphV1)[],
): IKeyValueGraph[] {
  return graphs.map((graph) => {
    return {
      name: `Graph ${graph.keys.map((key) => key.key).join(" ")}`,
      group_by: "",
      ...graph,
      keys: graph.keys.map((key) => ({ axis: "left", ...key })),
    };
  });
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
  } catch {
    return [];
  }
}

export function createSearchFromGraphs(
  graphs: IKeyValueGraph[],
): string | null {
  if (graphs.length === 0) return null;
  return encodeURIComponent(JSON.stringify(graphs));
}
