import { useState } from "react";
import { ToolbarFilter, SearchInput } from "@patternfly/react-core";
import { sortedUniq } from "lodash";

type ListFilterProps = {
  items: string[];
  categoryName: string;
  placeholderText: string;
  onSearch: (item: string) => void;
  onClear: (item: string) => void;
  showToolbarItem?: boolean;
};

export default function ListFilter({
  items,
  onSearch,
  onClear,
  showToolbarItem = true,
  categoryName,
  placeholderText,
}: ListFilterProps) {
  const [item, setItem] = useState("");
  const uniqItems = sortedUniq(items);
  return (
    <ToolbarFilter
      chips={uniqItems}
      deleteChip={(key, value) => {
        if (key) {
          onClear(value as string);
        }
      }}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <SearchInput
        placeholder={placeholderText}
        aria-label="search item"
        onChange={setItem}
        onSearch={onSearch}
        value={item}
        onClear={() => {
          setItem("");
        }}
      />
    </ToolbarFilter>
  );
}
