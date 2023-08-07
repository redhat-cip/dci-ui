import {
  global_danger_color_100,
  global_palette_green_500,
} from "@patternfly/react-tokens";
import { IComponentCoverage } from "types";
import { Bar, BarChart, XAxis, Tooltip } from "recharts";
import { DateTime } from "luxon";

interface CumulatedDataPerWeek {
  [weekNumber: number]: {
    success: number;
    failure: number;
    name: string;
    weekNumber: number;
  };
}

interface LastComponentsJobsBarChartProps {
  component: IComponentCoverage;
}

export default function LastComponentsJobsBarChart({
  component,
}: LastComponentsJobsBarChartProps) {
  const now = DateTime.now();
  const nbWeeksInThePast = 5;
  const initialCumulatedData = [...Array(nbWeeksInThePast).keys()].reduce(
    (acc, weekInThePast) => {
      const weekNumber = now.minus({
        weeks: weekInThePast,
      }).weekNumber;
      acc[weekNumber] = {
        success: 0,
        failure: 0,
        name: `w${weekNumber}`,
        weekNumber,
      };
      return acc;
    },
    {} as CumulatedDataPerWeek,
  );
  const cumulatedPerWeek = component.jobs.reduce(
    (acc, job) => {
      const jobDate = DateTime.fromISO(job.created_at);
      const weekNumber = jobDate.weekNumber;
      if (!(weekNumber in initialCumulatedData)) {
        return acc;
      }
      if (job.status === "success") {
        acc[weekNumber].success += 1;
      } else {
        acc[weekNumber].failure += 1;
      }
      return acc;
    },
    { ...initialCumulatedData } as CumulatedDataPerWeek,
  );
  const data = Object.values(cumulatedPerWeek).sort((stat1, stat2) => {
    if (stat1.weekNumber < stat2.weekNumber) {
      return -1;
    }
    if (stat1.weekNumber > stat2.weekNumber) {
      return 1;
    }
    return 0;
  });
  return (
    <BarChart
      data={data}
      width={150}
      height={52}
      margin={{
        top: 5,
        right: 5,
        bottom: 0,
        left: 5,
      }}
    >
      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
      <Tooltip
        wrapperStyle={{ zIndex: 1000 }}
        allowEscapeViewBox={{ x: true }}
        labelFormatter={(label, payloads) => {
          if (payloads && payloads.length > 1) {
            return `Week ${payloads[0].payload.weekNumber}`;
          }
        }}
      />
      <Bar dataKey="success" fill={global_palette_green_500.value} />
      <Bar dataKey="failure" fill={global_danger_color_100.value} />
    </BarChart>
  );
}
