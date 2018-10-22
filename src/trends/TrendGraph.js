import React, { Component } from "react";
import styled from "styled-components";
import C3Chart from "react-c3js";
import moment from "moment";
import { isEmpty } from "lodash";
import { EmptyState } from "../ui";
import { TimesIcon } from "@patternfly/react-icons";

const GraphContainer = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
  margin-bottom: 1em;

  .c3-axis .tick line,
  .c3-axis-x .tick line {
    display: none;
  }
`;

const GraphTitle = styled.div`
  text-align: center;
  padding: 1em;
`;

export default class TrendGraph extends Component {
  render() {
    const { trend, topic } = this.props;
    if (isEmpty(trend)) return <EmptyState
    title="No stat"
    info={`There is no stats for topic ${topic.name}.`}
    icon={<i className="fa fa-line-chart fa-3x fa-fw" />}
  />;
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
      <GraphContainer>
        <GraphTitle>
          <h3>{topic.name} job in success or failure for each day</h3>
        </GraphTitle>
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
      </GraphContainer>
    );
  }
}
