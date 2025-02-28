import { getJobStats } from "./jobStats";
import {
  analyticsOneJob,
  analyticsEmptyData,
} from "analytics/analyticsTestData";

test("getJobStats with empty data", () => {
  expect(getJobStats(analyticsEmptyData, "topic")).toEqual({});
});

test("getJobStats with result", () => {
  expect(getJobStats(analyticsOneJob, "topic")).toEqual({
    "Topic 1": {
      success: {
        color: "var(--pf-t--global--color--status--success--default)",
        total: 1,
        label: "Successful jobs",
      },
      failure: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Failed jobs",
      },
      error: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Errored jobs",
      },
      killed: {
        color: "var(--pf-t--global--color--status--warning--default)",
        total: 0,
        label: "Killed jobs",
      },
    },
  });
  expect(getJobStats(analyticsOneJob, "pipeline")).toEqual({
    pipeline: {
      success: {
        color: "var(--pf-t--global--color--status--success--default)",
        total: 1,
        label: "Successful jobs",
      },
      failure: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Failed jobs",
      },
      error: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Errored jobs",
      },
      killed: {
        color: "var(--pf-t--global--color--status--warning--default)",
        total: 0,
        label: "Killed jobs",
      },
    },
  });
  expect(getJobStats(analyticsOneJob, "component")).toEqual({
    "OpenShift 4.14.48": {
      success: {
        color: "var(--pf-t--global--color--status--success--default)",
        total: 1,
        label: "Successful jobs",
      },
      failure: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Failed jobs",
      },
      error: {
        color: "var(--pf-t--global--color--status--danger--default)",
        total: 0,
        label: "Errored jobs",
      },
      killed: {
        color: "var(--pf-t--global--color--status--warning--default)",
        total: 0,
        label: "Killed jobs",
      },
    },
  });
});
