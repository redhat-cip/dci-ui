import React from "react";
import { IJobFilters, Status, Statuses } from "types";
import { Select, SelectOption, ToolbarFilter } from "@patternfly/react-core";

type StatusFilterProps = {
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
};

const StatusFilter = ({ filters, setFilters }: StatusFilterProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const clearStatus = () => setFilters({ ...filters, status: null });
  return (
    <ToolbarFilter
      chips={filters.status ? [filters.status] : []}
      deleteChip={clearStatus}
      categoryName="Status"
      showToolbarItem
    >
      <Select
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          setFilters({ ...filters, status: selection as Status });
        }}
        onClear={clearStatus}
        selections={filters.status || ""}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by status..."
      >
        {Statuses.map((s, index) => (
          <SelectOption key={index} value={s} />
        ))}
      </Select>
    </ToolbarFilter>
  );
};

export default StatusFilter;
