import {
  DatePicker,
  Flex,
  FlexItem,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";
import type { TimeRange } from "types";
import { getRangeDates } from "services/date";
import { useState } from "react";

export const rangeLabels: { [k in TimeRange]: string } = {
  previousWeek: "Previous week",
  previousMonth: "Previous month",
  currentWeek: "Current week",
  previousQuarter: "Previous quarter",
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

export default function RangeSelect({
  now,
  defaultValues,
  ranges,
  onChange,
}: {
  now?: string;
  defaultValues: {
    range: TimeRange;
    after: string;
    before: string;
  };
  ranges: TimeRange[];
  onChange: (range: TimeRange, after: string, before: string) => void;
}) {
  const [range, setRange] = useState(defaultValues.range);
  const [after, setAfter] = useState(defaultValues.after);
  const [before, setBefore] = useState(defaultValues.before);
  const showDatePicker = range === "custom";

  return (
    <Flex columnGap={{ default: "columnGapXs" }}>
      <FlexItem>
        <FormSelect
          id="select-range-option"
          value={range}
          onChange={(_, newRange) => {
            const r = newRange as TimeRange;
            setRange(r);
            if (r === "custom") {
              onChange(r, after, before);
            } else {
              const dates = getRangeDates(r, now);
              onChange(r, dates.after, dates.before);
            }
          }}
          style={{ width: 150 }}
        >
          {ranges.map((range, index) => (
            <FormSelectOption
              key={index}
              value={range}
              label={rangeLabels[range]}
            />
          ))}
        </FormSelect>
      </FlexItem>
      {showDatePicker && (
        <>
          <FlexItem>
            <DatePicker
              value={after}
              aria-label="After input date picker"
              buttonAriaLabel="Toggle after date picker"
              placeholder="After"
              appendTo={() => document.body}
              onChange={(_, newAfterDate) => {
                setAfter(newAfterDate);
                onChange(range, newAfterDate, before);
              }}
            />
          </FlexItem>
          <FlexItem>
            <DatePicker
              value={before}
              aria-label="Before input date picker"
              buttonAriaLabel="Toggle before date picker"
              placeholder="Before"
              appendTo={() => document.body}
              onChange={(_, newBeforeDate) => {
                setBefore(newBeforeDate);
                onChange(range, after, newBeforeDate);
              }}
            />
          </FlexItem>
        </>
      )}
    </Flex>
  );
}
