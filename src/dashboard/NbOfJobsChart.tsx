import React from "react";
import {
  global_danger_color_100,
  global_success_color_100,
} from "@patternfly/react-tokens";
import { ChartDonut } from "@patternfly/react-charts";
import { Stat } from "types";

type NbOfJobsChartProps = {
  stat: Stat | null;
};

const NbOfJobsChart = ({ stat }: NbOfJobsChartProps) => {
  if (stat === null) return null;
  const title = stat.nbOfJobs.toString();
  const subTitle = `remoteci${stat.nbOfJobs > 1 ? "s" : ""}`;
  return (
    <ChartDonut
      ariaDesc={`Graph representing number of job for ${stat.topic.name}`}
      ariaTitle="Number jobs"
      constrainToVisibleArea={true}
      data={[
        { x: "Number of successful jobs", y: stat.percentageOfSuccess },
        { x: "Number of failed jobs", y: 100 - stat.percentageOfSuccess },
      ]}
      height={150}
      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
      subTitle={subTitle}
      title={title}
      width={150}
      colorScale={[
        global_success_color_100.value,
        global_danger_color_100.value,
      ]}
    />
  );
};

export default NbOfJobsChart;
