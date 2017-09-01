// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import * as d3 from "d3";

class Ctrl {
  $onChanges() {
    const svg = d3.select("#componentsSvg");
    if (svg) {
      svg.remove();
    }
    this.graph = document.getElementById("topicMetrics");
    this.graphSize = { width: Math.round(500 * 1.618), height: 500 };
    this.draw(this.graph, this.topic.components, this.graphSize);
  }

  draw(element, data, options) {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = options.width - margin.left - margin.right,
      height = options.height - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3
      .select(element)
      .append("svg")
      .attr("id", "componentsSvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (data.length === 0) {
      return;
    }

    data.forEach(function(d) {
      d.x = d3.isoParse(d.date);
      const oneDay = 24 * 60 * 60;
      d.y = (d.values[0] || 0) / oneDay;
    });

    x.domain(
      d3.extent(data, function(d) {
        return d.x;
      })
    );

    const max = 5;

    y.domain([0, max]);

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", function(d) {
        const twoDay = 2;
        if (d.y < twoDay && d.y > 0) {
          return "bar bar--success";
        }

        return "bar";
      })
      .attr("x", function(d) {
        return x(d.x) - 10 / 2;
      })
      .attr("width", 10)
      .attr("y", function(d) {
        return y(Math.min(max, d.y));
      })
      .attr("height", function(d) {
        return height - y(Math.min(max, d.y));
      });

    svg
      .selectAll(".untested-component")
      .data(data)
      .enter()
      .append("circle")
      .filter(function(d) {
        return d.y === 0;
      })
      .style("fill", "red")
      .attr("r", 3)
      .attr("cy", y(0))
      .attr("cx", function(d) {
        return x(d.x);
      })
      .style("z-index", 20);

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", y(2))
      .attr("x2", x(d3.isoParse(data[data.length - 1].date)))
      .attr("y2", y(2))
      .style("z-index", 10)
      .style("stroke", "red");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(Math.max(width / 80, 2)));

    svg.append("g").call(d3.axisLeft(y).ticks(Math.round(max)));
  }
}

export default Ctrl;
