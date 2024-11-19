import { IJobStatus, JobStatuses } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import Select from "ui/form/Select";

type StatusToolbarFilterProps = {
  status: string | null;
  onSelect: (status: IJobStatus) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function StatusToolbarFilter({
  status,
  onSelect,
  onClear,
}: StatusToolbarFilterProps) {
  return (
    <ToolbarFilter
      labels={status === null ? [] : [status]}
      deleteLabel={onClear}
      categoryName="Status"
      showToolbarItem
    >
      <Select
        placeholder="Filter by status"
        onClear={onClear}
        onSelect={(selection) => {
          if (selection) {
            onSelect(selection.value as IJobStatus);
          }
        }}
        item={status ? { value: status, label: status } : null}
        items={JobStatuses.map((s) => ({
          value: s,
          label: s,
        }))}
      />
    </ToolbarFilter>
  );
}
