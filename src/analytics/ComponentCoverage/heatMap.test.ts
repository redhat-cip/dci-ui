import { analyticsOneJob } from "analytics/analyticsTestData";
import { createHeatMap } from "./heatMap";

test("createHeatMap with one analytic job", () => {
  expect(createHeatMap(analyticsOneJob, "rpm", "ocp")).toEqual({
    labelsY: [{ id: "c1", display_name: "python3-kubernetes 11.0.0-6.el8" }],
    labelsX: [{ id: "c2", display_name: "OpenShift 4.14.48" }],
    matrix: [[1]],
    maxValue: 1,
  });
});
