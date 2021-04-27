import { isEmpty } from "lodash";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { round } from "lodash";
import { transposePerformance } from "./performanceActions";
import { TestPerformance } from "types";

function deltaToString(delta: string | number) {
  if (typeof delta === "string") return delta;
  if (delta === 0) {
    return "0 %";
  }
  return `${delta > 0 ? "+" : ""}${round(delta, 2)} %`;
}

interface PerformanceCardProps {
  performance: TestPerformance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  if (isEmpty(performance)) return null;
  const [testName, data] = Object.entries(performance)[0];
  const { headers, rows } = transposePerformance(data);
  return (
    <Card className="mt-md">
      <CardTitle>{testName}</CardTitle>
      <CardBody>
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>
                  {h === null ? null : (
                    <Link to={`/jobs/${h.job_id}`}>{h.title}</Link>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((column, j) => (
                  <td key={j}>{deltaToString(column)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
