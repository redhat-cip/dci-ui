import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ITrend } from "types";

interface TrendGraphProps {
  data: ITrend[];
  xMin: Date;
  xMax: Date;
}

export default function TrendGraph({ data, xMin, xMax }: TrendGraphProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (graphRef.current && divRef.current && data) {
      const graphWidth = divRef.current.offsetWidth;
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
        .select(graphRef.current)
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const dataOrdered = data.map((d) => [
        d3.timeParse("%s")(d[0].toString()),
        d[1],
        d[2],
      ]);

      const x = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
      if (isWide) {
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      }
      const yMin = 0;
      const dataY1 = dataOrdered.map((d) => d[1] as number);
      const y1Max = d3.max(dataY1) || 0;

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
        .attr("x", (d) => x(d[0] as Date))
        .attr("y", (d) => y(d[1] as number))
        .attr("height", (d) => height - y(d[1] as number))
        .attr("width", barWidth);

      svg.exit().remove();
    }
  }, [graphRef.current, divRef.current, data, xMin, xMax]);

  return (
    <div ref={divRef}>
      <svg ref={graphRef} />
    </div>
  );
}
