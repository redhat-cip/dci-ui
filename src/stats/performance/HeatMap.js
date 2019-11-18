import React, { Component } from "react";
import * as d3 from "d3";

export default class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.graph = React.createRef();
  }
  componentDidMount() {
    const { data, testCaseSelected } = this.props;
    this.drawGraph(this.graph, data, testCaseSelected);
  }
  drawGraph = (element, data, testCaseSelected) => {
    const graphWidth = element.current.offsetWidth;
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = graphWidth - margin.left - margin.right;
    const graphHeight = Math.round((width * 9) / 16);
    //const height = graphHeight - margin.top - margin.bottom;

    function chunk(arr, len) {
      const chunks = [];
      let i = 0;
      const n = arr.length;

      while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
      }
      return chunks;
    }

    // const squareWidth = Math.floor(Math.sqrt((width * height) / data.length));
    const squareWidth = 20;
    const squareHeight = squareWidth;
    const nbElementPerLine = Math.floor(width / squareWidth);
    const chunks = chunk(data, nbElementPerLine);

    const graph = d3.select(element.current);
    const svg = graph
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const scale = Math.max(
      Math.abs(d3.min(data, d => d.delta)),
      Math.abs(d3.max(data, d => d.delta))
    );
    const colorScale = d3
      .scaleLinear()
      .domain([scale, -scale])
      .range([0, 1]);

    const tooltip = graph
      .append("div")
      .style("opacity", 0)
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("position", "absolute")
      .style("display", "block")
      .style("padding", "1em");

    const mouseover = () => {
      tooltip.style("opacity", 1);
    };
    const mousemove = d => {
      tooltip
        .html(
          `<table>
<tr><td>Class:</td><td>${d.classname}</td></tr>
<tr><td>Name:</td><td>${d.name}</td></tr>
<tr><td>Delta:</td><td>${d.delta}</td></tr>
<tr><td>Time:</td><td>${d.time}</td></tr>
</table>`
        )
        .style("left", d3.event.layerX + "px")
        .style("top", d3.event.layerY + 30 + "px");
    };

    for (let i in chunks) {
      svg
        .append("g")
        .selectAll("rect")
        .data(chunks[i])
        .enter()
        .append("rect")
        .attr("x", (d, j) => j * squareWidth)
        .attr("y", i * squareHeight)
        .attr("width", squareWidth)
        .attr("height", squareHeight)
        .style("fill", d => d3.interpolateRdYlGn(colorScale(d.delta)))
        .on("click", testCaseSelected)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", () => {
          tooltip.style("opacity", 0);
        });
    }
  };
  render() {
    return (
      <div
        ref={this.graph}
        style={{ position: "relative", minWidth: "100%" }}
      ></div>
    );
  }
}
