import { Card, CardTitle, CardBody } from "@patternfly/react-core";
import { chart_color_blue_300 } from "@patternfly/react-tokens";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from "recharts";
import type { JunitData } from "./junitComparisonApi";

export function TrendChart({ data }: { data: JunitData["trend_percentage"] }) {
  return (
    <Card>
      <CardTitle>
        Trend percentile
        <br />
        Percentage deviation of the 95 percentile test
      </CardTitle>
      <CardBody>
        <div style={{ width: "100%", minHeight: "400px", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data.job_ids.map((job_id, index) => ({
                y: data.values[index],
                x: job_id,
                i: index,
                label: `j${index + 1}`,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <XAxis dataKey="label" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line
                type="monotone"
                dataKey="y"
                stroke={chart_color_blue_300.var}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
