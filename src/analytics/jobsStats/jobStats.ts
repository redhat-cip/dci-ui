import {
  FinalJobStatuses,
  groupByKeys,
  groupByKeysWithLabel,
  IAnalyticsJob,
  IFinalJobStatus,
} from "types";
import {
  chart_color_blue_300,
  chart_color_teal_300,
  chart_color_green_300,
  chart_color_orange_300,
  chart_color_red_orange_300,
  chart_color_purple_300,
  chart_color_yellow_300,
} from "@patternfly/react-tokens";
import { getJobKey } from "analytics/analyticsJob";

export type IGroupByKey = (typeof groupByKeys)[number];

// Keys for slicing data inside each group (pie chart slices)
export type ISliceByKey = IGroupByKey;
export const sliceByKeys: ISliceByKey[] = [...groupByKeys];
export const sliceByKeysWithLabel: Record<ISliceByKey, string> = {
  ...groupByKeysWithLabel,
};

// Generic statistic entry for a slice
export interface IStat {
  color: string;
  total: number;
  label: string;
}

/**
 * Compute statistics for jobs, grouping them by groupByKey and slicing each group
 * by sliceByKey. By default, sliceByKey is 'status', preserving the original behavior.
 */
export function getJobStats(
  data: IAnalyticsJob[],
  groupByKey: IGroupByKey,
  sliceByKey: ISliceByKey = "status",
): Record<string, Record<string, IStat>> {
  const emptyStats: Record<string, Record<string, IStat>> = {};
  if (data.length === 0) {
    return emptyStats;
  }

  // Mapping for status colors and labels
  const statusColorsMap: Record<IFinalJobStatus, string> = {
    success: chart_color_green_300.var,
    failure: chart_color_red_orange_300.var,
    error: chart_color_red_orange_300.var,
    killed: chart_color_orange_300.var,
  };
  const statusLabelsMap: Record<IFinalJobStatus, string> = {
    success: "Successful jobs",
    failure: "Failed jobs",
    error: "Errored jobs",
    killed: "Killed jobs",
  };

  // Default color palette for non-status slices
  const chartColors = [
    chart_color_blue_300.var,
    chart_color_teal_300.var,
    chart_color_green_300.var,
    chart_color_orange_300.var,
    chart_color_red_orange_300.var,
    chart_color_purple_300.var,
    chart_color_yellow_300.var,
  ];
  const sliceColorMap: Record<string, string> = {};
  let nextColor = 0;

  const result: Record<string, Record<string, IStat>> = {};
  for (const job of data) {
    const groupKeyValue = getJobKey(job, groupByKey);
    if (!groupKeyValue) {
      continue;
    }

    if (sliceByKey === "tags") {
      const tagsArray = job.tags;
      if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
        continue;
      }
      if (!result[groupKeyValue]) {
        result[groupKeyValue] = {};
      }
      const groupStats = result[groupKeyValue];
      for (const tag of tagsArray) {
        if (!tag) {
          continue;
        }
        if (!sliceColorMap[tag]) {
          sliceColorMap[tag] = chartColors[nextColor++ % chartColors.length];
        }
        if (!groupStats[tag]) {
          groupStats[tag] = {
            color: sliceColorMap[tag],
            total: 0,
            label: tag,
          };
        }
        groupStats[tag].total += 1;
      }
      continue;
    }

    // Determine slice value and skip invalid entries
    let sliceValue: string | null = null;
    if (sliceByKey === "status") {
      const jobStatus = job.status;
      if (!(FinalJobStatuses as readonly string[]).includes(jobStatus)) {
        continue;
      }
      sliceValue = jobStatus as IFinalJobStatus;
    } else {
      sliceValue = getJobKey(job, sliceByKey);
    }
    if (!sliceValue) {
      continue;
    }

    // Initialize group bucket, pre-populating all statuses for sliceByKey === 'status'
    if (!result[groupKeyValue]) {
      if (sliceByKey === "status") {
        const initial: Record<string, IStat> = {};
        FinalJobStatuses.forEach((status) => {
          initial[status] = {
            color: statusColorsMap[status],
            total: 0,
            label: statusLabelsMap[status],
          };
        });
        result[groupKeyValue] = initial;
      } else {
        result[groupKeyValue] = {};
      }
    }
    const groupStats = result[groupKeyValue];

    // Assign a color to this slice if not already done
    if (!sliceColorMap[sliceValue]) {
      sliceColorMap[sliceValue] =
        sliceByKey === "status"
          ? statusColorsMap[sliceValue as IFinalJobStatus]
          : chartColors[nextColor++ % chartColors.length];
    }

    // Initialize slice entry if missing
    if (!groupStats[sliceValue]) {
      groupStats[sliceValue] = {
        color: sliceColorMap[sliceValue],
        total: 0,
        label:
          sliceByKey === "status"
            ? statusLabelsMap[sliceValue as IFinalJobStatus]
            : sliceValue,
      };
    }
    groupStats[sliceValue].total += 1;
  }

  return result;
}
