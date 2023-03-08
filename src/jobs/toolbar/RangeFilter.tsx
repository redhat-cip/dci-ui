import {
  DatePicker,
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import {  useState } from "react";
import { RangeOptionValue } from "types";

const labels: { [k in RangeOptionValue]: string } = {
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

type RangeOption = {
  value: RangeOptionValue;
  label: string;
};

interface IRangeFilterProps {
  range: RangeOptionValue;
  ranges?: RangeOptionValue[];
  after: string;
  before: string;
  categoryName?: string;
  showToolbarItem?: boolean;
  onChange: (range: RangeOptionValue, after: string, before: string) => void;
}

export default function RangeFilter({
  range,
  after,
  before,
  onChange,
  ranges = Object.keys(labels) as Array<keyof typeof labels>,
  categoryName = "Range",
  showToolbarItem = true,
}: IRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const label = labels[range];
  const seeDatePicker = range === "custom";

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
                const newRange=(selectedRange as RangeOption).value
                onChange(newRange, after, before);
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
                value={after}
                placeholder="Created after"
                onChange={(newAfterDate) => onChange(range, newAfterDate, before)}
              />
              <DatePicker
                value={before}
                placeholder="Before"
                onChange={(newBeforeDate) => onChange(range, after, newBeforeDate)}
              />
            </div>
          )}
        </div>
      </ToolbarFilter>
    </div>
  );
}
