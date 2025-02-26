import {
  DatePicker,
  Flex,
  FlexItem,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";
import { TimeRange } from "types";
import { getRangeDates } from "services/date";

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
  range,
  ranges = Object.keys(rangeLabels) as Array<keyof typeof rangeLabels>,
  after,
  before,
  onChange,
}: {
  now?: string;
  range: TimeRange;
  ranges?: TimeRange[];
  after: string;
  before: string;
  onChange: (range: TimeRange, after: string, before: string) => void;
}) {
  const showDatePicker = range === "custom";

  return (
    <Flex columnGap={{ default: "columnGapXs" }}>
      <FlexItem>
        <FormSelect
          id="select-range-option"
          value={range}
          onChange={(event, newRange) => {
            const r = newRange as TimeRange;
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
              placeholder="After"
              aria-label="After input date picker"
              buttonAriaLabel="Toggle after date picker"
              appendTo={() => document.body}
              onChange={(e, newAfterDate) => {
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
              onChange={(e, newBeforeDate) => {
                onChange(range, after, newBeforeDate);
              }}
            />
          </FlexItem>
        </>
      )}
    </Flex>
  );
}
