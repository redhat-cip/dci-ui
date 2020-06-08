import React, { Component } from "react";
import * as d3 from "d3";

class TrendGraph extends Component {
  constructor(props) {
    super(props);
    this.graph = React.createRef();
  }
  componentDidMount() {
    const { data, xMin, xMax } = this.props;
    this.drawGraph(this.graph, data, xMin, xMax);
  }
  drawGraph = (element, data, xMin, xMax) => {
    const graphWidth = element.current.offsetWidth;
    const isWide = graphWidth > 780;
    const marginMultiplier = isWide ? 3 : 1;
    const margin = {
      top: 15 * marginMultiplier,
      right: 15 * marginMultiplier,
      bottom: 15 * marginMultiplier,
      left: 15 * marginMultiplier,
    };
    const width = graphWidth - margin.left - margin.right;
    const graphHeight = Math.round((width * 1) / 2);
    const height = graphHeight - margin.top - margin.bottom;

    const svg = d3
      .select(element.current)
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (!data) return;

    const dataOrdered = data.map((d) => [d3.timeParse("%s")(d[0]), d[1], d[2]]);

    const x = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
    if (isWide) {
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    }
    const yMin = 0;
    const dataY1 = dataOrdered.map((d) => d[1]);
    const y1Max = d3.max(dataY1);

    const y = d3.scaleLinear().domain([yMin, y1Max]).range([height, 0]);

    if (isWide) {
      const yAxisTicks = y.ticks().filter((tick) => Number.isInteger(tick));
      const yAxis = d3
        .axisLeft(y)
        .tickValues(yAxisTicks)
        .tickFormat(d3.format("d"));
      svg.append("g").call(yAxis);
    }

    const barWidth = isWide ? 5 : 2;
    const strokeWidth = isWide ? 1 : 0;
    svg
      .selectAll("rect")
      .data(dataOrdered)
      .enter()
      .append("rect")
      .attr("fill", "#92D400")
      .attr("stroke", "#486B00")
      .attr("stroke-width", strokeWidth)
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - y(d[1]))
      .attr("width", barWidth);
  };
  render() {
    return <div ref={this.graph}></div>;
  }
}

export default TrendGraph;
