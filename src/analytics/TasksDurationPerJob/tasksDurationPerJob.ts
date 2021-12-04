import { IDataFromES, IGraphData, IRefArea } from "types";

export function transform(dataFromES: IDataFromES) {
  return dataFromES.hits.reduce((acc, hit) => {
    acc.push({
      id: hit._source.job_id,
      name: hit._source.job_name,
      status: hit._source.job_status,
      data: hit._source.data.reduce((dataAcc, d, i) => {
        dataAcc.push({
          name: d.name,
          x: i + 1,
          y: d.duration,
        });
        return dataAcc;
      }, [] as IGraphData["data"]),
    });
    return acc;
  }, [] as IGraphData[]);
}

export function getDomain(graphData: IGraphData[] | null, area: IRefArea) {
  const initialDomain = {
    minXDomain: area.left === null ? 0 : area.left,
    maxXDomain: area.right === null ? 0 : area.right,
    minYDomain: 0,
    maxYDomain: 0,
  };
  if (graphData === null) {
    return initialDomain;
  }
  return graphData.reduce(
    (acc, d, i) => {
      const minIndex = area.left === null ? 0 : area.left - 1;
      const nbOfTasks = d.data.length;
      if (minIndex >= nbOfTasks) {
        return acc;
      }
      const maxIndex =
        area.right === null
          ? nbOfTasks - 1
          : Math.min(nbOfTasks, area.right) - 1;
      const firstTask = d.data[minIndex];
      const lastTask = d.data[maxIndex];
      if (i === 0) {
        acc.minXDomain = firstTask.x;
        acc.maxXDomain = lastTask.x;
        acc.minYDomain = firstTask.y;
        acc.maxYDomain = lastTask.y;
      }
      if (firstTask.x < acc.minXDomain) {
        acc.minXDomain = firstTask.x;
      }
      if (firstTask.x > acc.maxXDomain) {
        acc.maxXDomain = firstTask.x;
      }
      if (firstTask.y < acc.minYDomain) {
        acc.minYDomain = firstTask.y;
      }
      if (lastTask.y > acc.maxYDomain) {
        acc.maxYDomain = lastTask.y;
      }
      return acc;
    },
    { ...initialDomain }
  );
}
