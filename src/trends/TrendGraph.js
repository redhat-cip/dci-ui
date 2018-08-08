import React, { Component } from "react";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import styled from "styled-components";
import { getAveragePercentageOfSuccess } from "./trendsGetters";

const GraphContainer = styled.div`
  width: 100%;
  height: 250px;
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
  color: white;
  z-index: 1;
`;
const AveragePercentage = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
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
        <ResponsiveContainer>
          <AreaChart data={trend} stackOffset="expand">
            <Area
              isAnimationActive={false}
              type="basis"
              dataKey={1}
              stroke="#3f9c35"
              fillOpacity={1}
              fill="#3f9c35"
              stackId="1"
            />
            <Area
              isAnimationActive={false}
              type="basis"
              dataKey={2}
              stroke="#cc0000"
              fillOpacity={1}
              fill="#cc0000"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraphContainer>
    );
  }
}
