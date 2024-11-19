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
      labels={id ? [id] : []}
      categoryName="Team id"
      deleteLabel={() => onClear()}
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
