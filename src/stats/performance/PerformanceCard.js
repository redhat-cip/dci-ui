import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Card, CardBody, CardHeader } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { round } from "lodash";
import { transposePerformance } from "./performanceActions";

function deltaToString(delta) {
  if (delta === 0) {
    return "0 %";
  }
  return `${delta > 0 ? "+" : ""}${round(delta, 2)} %`;
}

export default class PerformanceCard extends Component {
  render() {
    const { performance } = this.props;
    if (isEmpty(performance)) return null;
    const [testName, data] = Object.entries(performance)[0];
    const { headers, rows } = transposePerformance(data);
    return (
      <Card className="mt-md">
        <CardHeader>{testName}</CardHeader>
        <CardBody>
          <table className="pf-c-table pf-m-compact pf-m-grid-md">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>
                    {isEmpty(h) ? null : (
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
                    <td key={j}>
                      {j === 0 || j === 1 ? column : deltaToString(column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }
}
