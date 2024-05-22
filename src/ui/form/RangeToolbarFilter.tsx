import { DatePicker, ToolbarFilter } from "@patternfly/react-core";
import Select from "ui/form/Select";
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

interface RangeToolbarFilterProps {
  range: RangeOptionValue;
  ranges?: RangeOptionValue[];
  after: string;
  before: string;
  categoryName?: string;
  showToolbarItem?: boolean;
  onChange: (range: RangeOptionValue, after: string, before: string) => void;
}

export default function RangeToolbarFilter({
  range,
  after,
  before,
  onChange,
  ranges = Object.keys(labels) as Array<keyof typeof labels>,
  categoryName = "Range",
  showToolbarItem = true,
}: RangeToolbarFilterProps) {
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
              onSelect={(item) => {
                if (item) {
                  const newRange = item.value as RangeOptionValue;
                  onChange(newRange, after, before);
                }
              }}
              item={{ value: range, label: labels[range] }}
              items={ranges.map((range) => ({
                value: range,
                label: labels[range],
              }))}
            />
          </div>
          {seeDatePicker && (
            <div>
              <DatePicker
                value={after}
                placeholder="Created after"
                onChange={(e, newAfterDate) =>
                  onChange(range, newAfterDate, before)
                }
              />
              <DatePicker
                value={before}
                placeholder="Before"
                onChange={(e, newBeforeDate) =>
                  onChange(range, after, newBeforeDate)
                }
              />
            </div>
          )}
        </div>
      </ToolbarFilter>
    </div>
  );
}
