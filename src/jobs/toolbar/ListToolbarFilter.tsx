import { useState } from "react";
import { ToolbarFilter, SearchInput } from "@patternfly/react-core";

type ListToolbarFilterProps = {
  showToolbarItem?: boolean;
  items: string[];
  categoryName: string;
  placeholderText: string;
  onSubmit: (items: string[]) => void;
};

export default function ListToolbarFilter({
  showToolbarItem = true,
  items,
  onSubmit,
  categoryName,
  placeholderText,
}: ListToolbarFilterProps) {
  const [value, setValue] = useState("");
  const uniqItems = [...new Set(items)];
  return (
    <ToolbarFilter
      chips={uniqItems}
      deleteChip={(key, value) => {
        if (key) {
          onSubmit(uniqItems?.filter((f) => f !== value));
        }
      }}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <SearchInput
        placeholder={placeholderText}
        aria-label="search item"
        onChange={(e, value) => setValue(value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (uniqItems?.indexOf(value) === -1) {
              onSubmit(uniqItems.concat(value));
              setValue("");
            }
          }
        }}
        value={value}
        onClear={() => setValue("")}
      />
    </ToolbarFilter>
  );
}
