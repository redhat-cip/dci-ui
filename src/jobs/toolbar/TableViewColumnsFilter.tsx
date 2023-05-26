import { useState } from "react";
import { JobsTableListColumn } from "types";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";

export const tableViewColumnLabels: { [k in JobsTableListColumn]: string } = {
  id: "Id",
  name: "Name",
  pipeline: "Pipeline",
  config: "Config",
  team: "Team",
  remoteci: "Remoteci",
  topic: "Topic",
  component: "Component",
  components: "Components",
  tests: "Tests",
  tags: "Tags",
  created_at: "Created at",
  duration: "Duration",
  started: "Started",
};

type TableViewColumnsFilterProps = {
  columns: JobsTableListColumn[];
  onSelect: (newColumns: JobsTableListColumn[]) => void;
};

export default function TableViewColumnsFilter({
  columns,
  onSelect,
}: TableViewColumnsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Select
      variant={SelectVariant.checkbox}
      onToggle={() => setIsOpen(!isOpen)}
      onSelect={(event, newSelection) => {
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
      selections={columns}
      isOpen={isOpen}
      placeholderText="Filter columns"
      menuAppendTo={() => document.body}
    >
      {(Object.keys(tableViewColumnLabels) as JobsTableListColumn[]).map(
        (column, i) => (
          <SelectOption key={i} value={column}>
            {tableViewColumnLabels[column]}
          </SelectOption>
        )
      )}
    </Select>
  );
}
