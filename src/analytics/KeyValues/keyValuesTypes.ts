import {
  chart_color_purple_200,
  chart_color_purple_400,
  chart_color_blue_200,
  chart_color_blue_400,
  chart_color_orange_200,
  chart_color_orange_400,
  chart_color_green_200,
  chart_color_green_400,
  chart_color_black_400,
  chart_color_black_500,
  chart_global_Fill_Color_white,
  chart_global_Fill_Color_900,
} from "@patternfly/react-tokens";

export const graphTypes = ["line", "bar", "scatter"] as const;
type IGraphType = (typeof graphTypes)[number];
export const graphTypeLabels: Record<IGraphType, string> = {
  scatter: "scatter chart",
  line: "line chart",
  bar: "bar chart",
};

const graphFrontColors = [
  chart_global_Fill_Color_white.value,
  chart_global_Fill_Color_900.value,
] as const;
type IGraphFrontColor = (typeof graphFrontColors)[number];
const graphBackColors = [
  chart_color_blue_200.value,
  chart_color_blue_400.value,
  chart_color_purple_200.value,
  chart_color_purple_400.value,
  chart_color_orange_200.value,
  chart_color_orange_400.value,
  chart_color_green_200.value,
  chart_color_green_400.value,
  chart_color_black_400.value,
  chart_color_black_500.value,
] as const;
type IGraphBackColor = (typeof graphBackColors)[number];
type IKeyValueGraphColor = {
  backgroundColor: IGraphBackColor;
  color: IGraphFrontColor;
};
export const graphColors: Record<IGraphBackColor, IKeyValueGraphColor> = {
  [chart_color_blue_200.value]: {
    backgroundColor: chart_color_blue_200.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_blue_400.value]: {
    backgroundColor: chart_color_blue_400.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_purple_200.value]: {
    backgroundColor: chart_color_purple_200.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_purple_400.value]: {
    backgroundColor: chart_color_purple_400.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_orange_200.value]: {
    backgroundColor: chart_color_orange_200.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_orange_400.value]: {
    backgroundColor: chart_color_orange_400.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_green_200.value]: {
    backgroundColor: chart_color_green_200.value,
    color: chart_global_Fill_Color_900.value,
  },
  [chart_color_green_400.value]: {
    backgroundColor: chart_color_green_400.value,
    color: chart_global_Fill_Color_white.value,
  },
  [chart_color_black_400.value]: {
    backgroundColor: chart_color_black_400.value,
    color: chart_global_Fill_Color_900.value,
  },
  [chart_color_black_500.value]: {
    backgroundColor: chart_color_black_500.value,
    color: chart_global_Fill_Color_white.value,
  },
} as const;

export function getRandomGraphColor() {
  return graphBackColors[
    Math.floor(Math.random() * graphBackColors.length)
  ] as IGraphBackColor;
}

interface IKeyValueGraphKeyV1 {
  color: IGraphBackColor;
  key: string;
}

export interface IKeyValueGraphV1 {
  keys: IKeyValueGraphKeyV1[];
  graphType: IGraphType;
}

export interface IKeyValueGraphKey {
  color: IGraphBackColor;
  key: string;
  axis: "left" | "right";
}

export interface IKeyValueGraph {
  name: string;
  group_by: string;
  keys: IKeyValueGraphKey[];
  graphType: IGraphType;
}
