import { useState } from "react";
import { JobsTableListColumn } from "types";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";
import tableViewColumns from "./tableViewColumns";

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
          Object.keys(tableViewColumns) as JobsTableListColumn[]
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
      {(Object.keys(tableViewColumns) as JobsTableListColumn[]).map(
        (column, i) => (
          <SelectOption key={i} value={column}>
            {tableViewColumns[column]}
          </SelectOption>
        )
      )}
    </Select>
  );
}
