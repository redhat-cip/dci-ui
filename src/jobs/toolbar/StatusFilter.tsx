import { useState } from "react";
import { IJobStatus, JobStatuses } from "types";
import { Select, SelectOption, ToolbarFilter } from "@patternfly/react-core";

type StatusFilterProps = {
  status: string | null;
  onSelect: (status: IJobStatus) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function StatusFilter({
  status,
  onSelect,
  onClear,
  showToolbarItem = true,
}: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolbarFilter
      chips={status === null ? [] : [status]}
      deleteChip={onClear}
      categoryName="Status"
      showToolbarItem={showToolbarItem}
    >
      <Select
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          onSelect(selection as IJobStatus);
        }}
        onClear={onClear}
        selections={status || ""}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by status"
      >
        {JobStatuses.map((s, index) => (
          <SelectOption key={index} value={s} />
        ))}
      </Select>
    </ToolbarFilter>
  );
}
