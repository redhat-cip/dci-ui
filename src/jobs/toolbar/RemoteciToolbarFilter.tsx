import { ToolbarFilter } from "@patternfly/react-core";
import RemoteciSelect from "./RemoteciSelect";
import { IRemoteci, SelectProps } from "types";

export default function RemoteciToolbarFilter({
  id,
  onSelect,
  showToolbarItem = true,
  onClear,
  placeholder = "Search by name",
}: SelectProps<IRemoteci>) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      categoryName="Remoteci id"
      deleteChip={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <RemoteciSelect
        id={id}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
