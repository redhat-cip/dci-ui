import type { IAnalyticsJob } from "types";

export type HeatMapMatrix = {
  labelsY: HeatMapComponent[];
  labelsX: HeatMapComponent[];
  matrix: number[][];
  maxValue: number;
};

export type HeatMapComponent = {
  id: string;
  display_name: string;
};

export function createHeatMap(
  jobs: IAnalyticsJob[],
  sourceType: string,
  targetType: string,
): HeatMapMatrix {
  const sourceMap = new Map<string, HeatMapComponent>();
  const targetMap = new Map<string, HeatMapComponent>();

  for (const job of jobs) {
    for (const component of job.components ?? []) {
      if (component.type === sourceType && !sourceMap.has(component.id)) {
        sourceMap.set(component.id, {
          id: component.id,
          display_name: component.display_name,
        });
      }
      if (component.type === targetType && !targetMap.has(component.id)) {
        targetMap.set(component.id, {
          id: component.id,
          display_name: component.display_name,
        });
      }
    }
  }

  const labelsY = Array.from(sourceMap.values());
  const labelsX = Array.from(targetMap.values());

  const indexMapY = new Map<string, number>();
  const indexMapX = new Map<string, number>();
  labelsY.forEach((comp, i) => indexMapY.set(comp.id, i));
  labelsX.forEach((comp, i) => indexMapX.set(comp.id, i));

  const matrix = Array.from({ length: labelsY.length }, () =>
    Array(labelsX.length).fill(0),
  );

  let maxValue = 0;

  for (const job of jobs) {
    const sourceIds =
      job.components?.filter((c) => c.type === sourceType).map((c) => c.id) ??
      [];
    const targetIds =
      job.components?.filter((c) => c.type === targetType).map((c) => c.id) ??
      [];

    for (const sourceId of sourceIds) {
      const row = indexMapY.get(sourceId);
      if (row === undefined) continue;

      for (const targetId of targetIds) {
        const col = indexMapX.get(targetId);
        if (col === undefined) continue;

        matrix[row][col] += 1;
        if (matrix[row][col] > maxValue) {
          maxValue = matrix[row][col];
        }
      }
    }
  }

  return {
    labelsY,
    labelsX,
    matrix,
    maxValue,
  };
}

export function viridisFixedColor(value: number, maxValue: number): string {
  if (value === 0) return "transparent";

  const VIRIDIS_REVERSED: string[] = [
    "rgb(68, 1, 84)",
    "rgb(72, 27, 109)",
    "rgb(70, 50, 126)",
    "rgb(63, 71, 136)",
    "rgb(54, 92, 141)",
    "rgb(46, 110, 142)",
    "rgb(39, 127, 142)",
    "rgb(33, 145, 140)",
    "rgb(31, 161, 135)",
    "rgb(45, 178, 125)",
    "rgb(74, 193, 109)",
    "rgb(115, 208, 86)",
    "rgb(160, 218, 57)",
    "rgb(208, 225, 28)",
  ];

  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  const index = Math.floor(ratio * (VIRIDIS_REVERSED.length - 1));
  return VIRIDIS_REVERSED[index];
}
