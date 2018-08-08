import React, { Component } from "react";
import styled from "styled-components";
import { getAveragePercentageOfSuccess } from "./trendsGetters";
import { SingleAreaChart } from "patternfly-react";

const GraphContainer = styled.div`
  width: 100%;
  height: 230px;
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
  margin-bottom: 1em;
  position: relative;
`;

const GraphInfo = styled.div`
  position: absolute;
  font-size: 2em;
  top: 0;
  left: 10px;
  z-index: 1;
`;
const AveragePercentage = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

export default class TrendGraph extends Component {
  render() {
    const { trend, topic } = this.props;
    const percentageOfSuccess = getAveragePercentageOfSuccess(trend);
    return (
      <GraphContainer>
        <GraphInfo>{topic.name}</GraphInfo>
        <AveragePercentage
        >{`On average ${percentageOfSuccess}% of success`}</AveragePercentage>
        <SingleAreaChart
          id="area-chart-2"
          size={{ height: 230 }}
          axis={{
            x: {
              type: "timeseries",
            },
            y: { show: false }
          }}
          grid={{ x: { show: false }, y: { show: false } }}
          data={{
            rows: [
              ['date', 's', 'f'],
              [90, 120, 300],
              [40, 160, 240],
              [50, 200, 290],
              [120, 160, 230],
              [80, 130, 300],
              [90, 220, 320],
          ],
            type: "area-spline"
          }}
        />
      </GraphContainer>
    );
  }
}
