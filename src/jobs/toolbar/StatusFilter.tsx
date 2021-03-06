import { useState } from "react";
import { IJobFilters, IJobStateStatus, JobStatus } from "types";
import { Select, SelectOption, ToolbarFilter } from "@patternfly/react-core";

type StatusFilterProps = {
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
};

export default function StatusFilter({
  filters,
  setFilters,
}: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
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
          setFilters({ ...filters, status: selection as IJobStateStatus });
        }}
        onClear={clearStatus}
        selections={filters.status || ""}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by status..."
      >
        {JobStatus.map((s, index) => (
          <SelectOption key={index} value={s} />
        ))}
      </Select>
    </ToolbarFilter>
  );
}
