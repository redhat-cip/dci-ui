import { useState } from "react";
import { ToolbarFilter, type ToolbarLabel } from "@patternfly/react-core";
import TextInput from "./TextInput";

type ListToolbarFilterProps = {
  showToolbarItem?: boolean;
  items: string[];
  categoryName: string;
  placeholderText: string;
  onSubmit: (items: string[]) => void;
};

/**
 * Remove a specified chip (string or ToolbarLabel) from a list of items,
 * ensuring unique items first.
 */
export function deleteListItem(
  items: string[],
  chip: string | ToolbarLabel,
): string[] {
  const chipValue =
    typeof chip === "string" ? chip : (chip.key?.toString() ?? "");
  const uniqItems = [...new Set(items)];
  return uniqItems.filter((f) => f !== chipValue);
}

export default function ListToolbarFilter({
  showToolbarItem = true,
  items,
  onSubmit,
  categoryName,
}: ListToolbarFilterProps) {
  const [value, setValue] = useState("");
  const uniqItems = [...new Set(items)];
  return (
    <ToolbarFilter
      labels={uniqItems}
      deleteLabel={(_category, chip) => onSubmit(deleteListItem(items, chip))}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TextInput
        value={value}
        name={categoryName.toLowerCase()}
        onClick={(newValue) => {
          if (uniqItems?.indexOf(newValue) === -1) {
            onSubmit(uniqItems.concat(newValue));
            setValue("");
          }
        }}
      />
    </ToolbarFilter>
  );
}
