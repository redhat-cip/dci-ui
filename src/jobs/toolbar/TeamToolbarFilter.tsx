import { ToolbarFilter } from "@patternfly/react-core";
import TeamSelect from "./TeamSelect";
import { ITeam, SelectProps } from "types";

export default function TeamToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: SelectProps<ITeam>) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      categoryName="Team id"
      deleteChip={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <TeamSelect
        id={id}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
