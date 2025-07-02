import { Card, CardTitle, CardBody } from "@patternfly/react-core";
import {
  chart_color_red_orange_300,
  chart_color_blue_300,
} from "@patternfly/react-tokens";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import type { JunitData } from "./junitComparisonApi";

export function JunitBarChart({
  data,
  rangeSelected,
}: {
  data: JunitData["bar_chart"];
  rangeSelected: (
    lowerBoundary: null | number,
    upperBoundary: null | number,
  ) => void;
}) {
  const interval = 10;
  return (
    <Card>
      <CardTitle>
        Nb of tests per percentage deviation range between reference topic and
        target topic.
        <br />
        We compared {data.len_jobs_topic_1} reference jobs with{" "}
        {data.len_jobs_topic_2} target jobs.
      </CardTitle>
      <CardBody>
        <div style={{ width: "100%", minHeight: "400px", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data.values.map((v, index) => ({
                y: v,
                x: data.intervals[index] + interval / 2,
                i: index,
                label: index === 0 ? "" : `${data.intervals[index]}%`,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 50,
              }}
              barCategoryGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={0}
                scale="band"
              >
                <Label
                  value="Intervals of deltas, lower is better"
                  offset={-25}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of tests"
                  angle={-90}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const range = data.intervals[payload[0].payload.i];
                    let message = `${payload[0].value} test${(payload[0].value as number) > 1 ? "s" : ""} with percentage deviation is `;
                    const lowerBoundary = data.intervals[0] + interval;
                    const upperBoundary =
                      data.intervals[data.intervals.length - 1];

                    if (range <= lowerBoundary) {
                      message += `under ${lowerBoundary}%`;
                    } else if (range >= upperBoundary) {
                      message += `over ${upperBoundary}%`;
                    } else {
                      message += `between ${range}% and ${range + interval}%`;
                    }
                    return (
                      <div
                        style={{
                          backgroundColor: "white",
                        }}
                        className="pf-v6-u-p-sm"
                      >
                        <p className="desc">{message}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="y"
                fill="#0066CC"
                name="# tests"
                onClick={(d, index) => {
                  const lowerBoundary = data.intervals[index];
                  const upperBoundary = data.intervals[index] + interval;
                  const isFirstElement = index === 0;
                  const isLastElement = index === data.values.length - 1;
                  if (isFirstElement) {
                    rangeSelected(null, upperBoundary);
                  } else if (isLastElement) {
                    rangeSelected(lowerBoundary, null);
                  } else {
                    rangeSelected(lowerBoundary, upperBoundary);
                  }
                }}
              >
                {data.values.map((value, index) => (
                  <Cell
                    cursor="pointer"
                    fill={
                      data.intervals[index] >= 0
                        ? chart_color_red_orange_300.var
                        : chart_color_blue_300.var
                    }
                    key={`cell-${index}`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
