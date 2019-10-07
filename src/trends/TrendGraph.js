import React, { Component } from "react";
import C3Chart from "react-c3js";
import moment from "moment";
import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import { Card, CardHeader, CardBody } from "@patternfly/react-core";

export default class TrendGraph extends Component {
  render() {
    const { trend, topic } = this.props;
    if (isEmpty(trend))
      return (
        <EmptyState
          title="No stat"
          info={`There is no stats for topic ${topic.name}.`}
        />
      );
    const rows = trend.reduce(
      (acc, trend) => {
        acc.push([trend[0] * 1000, trend[1], trend[2]]);
        return acc;
      },
      [["x", "success", "failures"]]
    );
    const xDaysAgoUnix =
      moment()
        .subtract(90, "days")
        .unix() * 1000;
    const nowUnix = moment().unix() * 1000;
    return (
      <Card>
        <CardHeader>
          {topic.name} job in success or failure for each day
        </CardHeader>
        <CardBody>
          <C3Chart
            data={{
              x: "x",
              xFormat: null,
              rows: rows,
              types: {
                success: "area-spline",
                failures: "area-spline"
              },
              groups: [["success", "failures"]],
              colors: {
                success: "#307628",
                failures: "#a30000"
              }
            }}
            interpolation={{
              type: "monotone"
            }}
            point={{
              show: false
            }}
            zoom={{
              enabled: true,
              rescale: true
            }}
            axis={{
              y: { show: true, label: topic.name },
              x: {
                type: "timeseries",
                tick: {
                  format: "%b %d %Y",
                  outer: false,
                  fit: true
                },
                extent: [xDaysAgoUnix, nowUnix]
              }
            }}
            subchart={{
              show: true
            }}
          />
        </CardBody>
      </Card>
    );
  }
}
