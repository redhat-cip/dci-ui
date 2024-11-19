import { ToolbarFilter } from "@patternfly/react-core";
import TopicSelect from "./TopicSelect";
import { ITopic, SelectProps } from "types";

export default function TopicToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: SelectProps<ITopic>) {
  return (
    <ToolbarFilter
      labels={id ? [id] : []}
      categoryName="Topic id"
      deleteLabel={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <TopicSelect
        id={id}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
