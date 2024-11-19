import { useState } from "react";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";

type MultiSelectFilterProps = {
  items: string[];
  itemsSelected: string[];
  onSelect: (type: string) => void;
  itemRemoved: (type: string) => void;
  categoryName: string;
  showToolbarItem?: boolean;
  placeholder?: string;
};

export default function MultiSelectFilter({
  items,
  itemsSelected,
  onSelect,
  itemRemoved,
  categoryName,
  showToolbarItem = true,
  placeholder = "Filter by",
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolbarFilter
      labels={itemsSelected}
      deleteLabel={(cat, key) => itemRemoved(key as string)}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        role="menu"
        id={`multi-${categoryName}-select`}
        isOpen={isOpen}
        selected={itemsSelected}
        onSelect={(e, newTypeSelected) => {
          onSelect(newTypeSelected as string);
        }}
        onOpenChange={(nextOpen: boolean) => setIsOpen(nextOpen)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
          >
            {placeholder}
          </MenuToggle>
        )}
      >
        <SelectList>
          {items.map((type, i) => (
            <SelectOption
              hasCheckbox
              value={type}
              isSelected={itemsSelected.includes(type)}
            >
              {type}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarFilter>
  );
}
