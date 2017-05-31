// Copyright 2015 Red Hat, Inc.
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

"use strict";
var d3 = require("d3");

require("app").component("dciOkr", {
  templateUrl: "/partials/okr.html",
  controller: dciOkrCtrl,
  bindings: {
    topics: "="
  }
});

function dciOkrCtrl() {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.metrics = {};
    for (var topic in $ctrl.topics) {
      $ctrl.metrics[topic] = {
        topic: topic,
        percentageTested: percentageTested($ctrl.topics[topic]),
        percentageBefore2days: percentageBefore2days($ctrl.topics[topic])
      };
    }
    draw($ctrl.topics[Object.keys($ctrl.topics)[0]]);
  };

  function percentageBefore2days(components) {
    var count = 0;
    var numberBefore2Day = 0;
    components
      .filter(function(component) {
        return component.values.length > 0;
      })
      .forEach(function(component) {
        count += 1;
        var twoDays = 2 * 24 * 60 * 60;
        var firstRunDuration = component.values[0];
        if (firstRunDuration < twoDays) {
          numberBefore2Day += 1;
        }
      });
    return Math.round(numberBefore2Day * 100 / count);
  }

  function percentageTested(components) {
    var count = 0;
    var tested = 0;
    components.forEach(function(component) {
      count += 1;
      if (component.values.length > 0) {
        tested += 1;
      }
    });
    return Math.round(tested * 100 / count);
  }

  $ctrl.drawTopic = function(topic) {
    d3.select("#componentsSvg").remove();
    draw($ctrl.topics[topic]);
  };

  function draw(data) {
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(function(d) {
        return x(d.x);
      })
      .y(function(d) {
        return y(d.y);
      });

    var svg = d3
      .select("#topicsOkr")
      .append("svg")
      .attr("id", "componentsSvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.x = d3.isoParse(d.date);
      var oneDay = 24 * 60 * 60;
      d.y = (d.values[0] || 0) / oneDay;
    });

    x.domain(
      d3.extent(data, function(d) {
        return d.x;
      })
    );

    y.domain([
      0,
      d3.max(data, function(d) {
        return d.y;
      })
    ]);

    svg.append("path").data([data]).attr("class", "line").attr("d", valueline);

    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", function(d) {
        return x(d.x);
      })
      .attr("cy", function(d) {
        return y(d.y);
      });

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", "-3em")
      .attr("fill", "#000")
      .text("number of days before first run");
  }
}
