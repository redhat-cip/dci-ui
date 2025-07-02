import { useState } from "react";
import type { JobsTableListColumn } from "types";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  type MenuToggleElement,
} from "@patternfly/react-core";

export const tableViewColumnLabels: { [k in JobsTableListColumn]: string } = {
  id: "Id",
  pipeline: "Pipeline",
  config: "Config",
  team: "Team",
  remoteci: "Remoteci",
  topic: "Topic",
  component: "Component",
  components: "Components",
  tests: "Tests",
  tags: "Tags",
  keysValues: "Keys Values",
  created_at: "Created at",
  duration: "Duration",
  started: "Started",
};

type TableViewColumnsSelectProps = {
  columns: JobsTableListColumn[];
  onSelect: (newColumns: JobsTableListColumn[]) => void;
};

export default function TableViewColumnsSelect({
  columns,
  onSelect,
}: TableViewColumnsSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Select
      role="menu"
      id="tableview-columns-select"
      isOpen={isOpen}
      selected={columns}
      onSelect={(e, newSelection) => {
        const newColumns = (
          Object.keys(tableViewColumnLabels) as JobsTableListColumn[]
        ).reduce((acc, column) => {
          const columnChecked = columns.indexOf(column) !== -1;
          if (
            (columnChecked && column !== newSelection) ||
            (!columnChecked && column === newSelection)
          ) {
            acc.push(column);
          }
          return acc;
        }, [] as JobsTableListColumn[]);
        onSelect(newColumns);
      }}
      onOpenChange={(nextOpen: boolean) => setIsOpen(nextOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
        >
          Filter columns
        </MenuToggle>
      )}
    >
      <SelectList>
        {(Object.keys(tableViewColumnLabels) as JobsTableListColumn[]).map(
          (column, i) => (
            <SelectOption
              key={i}
              hasCheckbox
              value={column}
              isSelected={columns.includes(column)}
            >
              {tableViewColumnLabels[column]}
            </SelectOption>
          ),
        )}
      </SelectList>
    </Select>
  );
}
