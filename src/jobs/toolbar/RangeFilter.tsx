import {
  DatePicker,
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export type RangeOptionValue =
  | "previousWeek"
  | "previousMonth"
  | "previousQuarter"
  | "lastMonth"
  | "lastYear"
  | "yesterday"
  | "today"
  | "currentWeek"
  | "currentMonth"
  | "currentQuarter"
  | "currentYear"
  | "last7Days"
  | "last30Days"
  | "last90Days"
  | "last365Days"
  | "custom";

const labels: { [k in RangeOptionValue]: string } = {
  previousWeek: "Last week",
  previousMonth: "Last month",
  currentWeek: "Current week",
  previousQuarter: "Last quarter",
  lastMonth: "Last month",
  lastYear: "Last year",
  yesterday: "Yesterday",
  today: "Today",
  currentMonth: "Current month",
  currentQuarter: "Current quarter",
  currentYear: "Year to date",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  last90Days: "Last 90 days",
  last365Days: "Last 365 days",
  custom: "Custom period",
};

type RangeOption = {
  value: RangeOptionValue;
  label: string;
};

interface IRangeFilterProps {
  range: RangeOptionValue;
  ranges?: RangeOptionValue[];
  setRange: (option: RangeOptionValue) => void;
  after: string;
  setAfter: (d: string) => void;
  before: string;
  setBefore: (d: string) => void;
  categoryName?: string;
  showToolbarItem?: boolean;
}

export default function RangeFilter({
  range,
  setRange,
  ranges = Object.keys(labels) as Array<keyof typeof labels>,
  after = "",
  setAfter,
  before = "",
  setBefore,
  categoryName = "Range",
  showToolbarItem = true,
}: IRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const label = labels[range];
  const seeDatePicker = range === "custom";

  useEffect(() => {
    const today = DateTime.now();
    const yesterday = today.minus({
      day: 1,
    });
    if (range === "today") {
      setAfter(today.startOf("day").toISODate());
      setBefore(today.endOf("day").toISODate());
    }
    if (range === "currentWeek") {
      setAfter(today.startOf("week").toISODate());
      setBefore(today.endOf("week").toISODate());
    }
    if (range === "currentMonth") {
      setAfter(today.startOf("month").toISODate());
      setBefore(today.endOf("month").toISODate());
    }
    if (range === "currentQuarter") {
      setAfter(today.startOf("quarter").toISODate());
      setBefore(today.endOf("quarter").toISODate());
    }
    if (range === "currentYear") {
      setAfter(today.startOf("year").toISODate());
      setBefore(today.endOf("year").toISODate());
    }
    if (range === "yesterday") {
      setAfter(yesterday.startOf("day").toISODate());
      setBefore(yesterday.endOf("day").toISODate());
    }
    if (range === "previousWeek") {
      const lastWeek = today.minus({
        week: 1,
      });
      setAfter(lastWeek.startOf("week").toISODate());
      setBefore(lastWeek.endOf("week").toISODate());
    }
    if (range === "previousMonth") {
      const lastMonth = today.minus({
        month: 1,
      });
      setAfter(lastMonth.startOf("month").toISODate());
      setBefore(lastMonth.endOf("month").toISODate());
    }
    if (range === "previousQuarter") {
      const lastQuarter = today.minus({
        quarter: 1,
      });
      setAfter(lastQuarter.startOf("quarter").toISODate());
      setBefore(lastQuarter.endOf("quarter").toISODate());
    }
    if (range === "lastMonth") {
      const lastMonth = today.minus({
        month: 1,
      });
      setAfter(lastMonth.startOf("month").toISODate());
      setBefore(lastMonth.endOf("month").toISODate());
    }
    if (range === "lastYear") {
      const lastYear = today.minus({
        year: 1,
      });
      setAfter(lastYear.startOf("year").toISODate());
      setBefore(lastYear.endOf("year").toISODate());
    }
    if (range === "last7Days") {
      const last7Days = today.minus({
        days: 7,
      });
      setAfter(last7Days.startOf("day").toISODate());
      setBefore(today.endOf("day").toISODate());
    }
    if (range === "last30Days") {
      const last30Days = today.minus({
        days: 30,
      });
      setAfter(last30Days.startOf("day").toISODate());
      setBefore(today.endOf("day").toISODate());
    }
    if (range === "last90Days") {
      const last90Days = today.minus({
        days: 90,
      });
      setAfter(last90Days.startOf("day").toISODate());
      setBefore(today.endOf("day").toISODate());
    }
    if (range === "last365Days") {
      const last365Days = today.minus({
        days: 365,
      });
      setAfter(last365Days.startOf("day").toISODate());
      setBefore(today.endOf("day").toISODate());
    }
  }, [range, setAfter, setBefore]);

  return (
    <div>
      <ToolbarFilter
        chips={[after, before]}
        categoryName={categoryName}
        showToolbarItem={showToolbarItem}
      >
        <div>
          <div>
            <Select
              onToggle={setIsOpen}
              isOpen={isOpen}
              variant={SelectVariant.single}
              selections={label}
              onSelect={(event, selectedRange) => {
                setRange((selectedRange as RangeOption).value);
                setIsOpen(false);
              }}
            >
              {ranges
                .map((value) => ({
                  value,
                  label: labels[value],
                  toString: () => labels[value],
                }))
                .map((option) => (
                  <SelectOption key={option.value} value={option} />
                ))}
            </Select>
          </div>
          {seeDatePicker && (
            <div>
              <DatePicker
                value={after || ""}
                placeholder="Created after"
                onChange={(str) => setAfter(str)}
              />
              <DatePicker
                value={before || ""}
                placeholder="Before"
                onChange={(str) => setBefore(str)}
              />
            </div>
          )}
        </div>
      </ToolbarFilter>
    </div>
  );
}
