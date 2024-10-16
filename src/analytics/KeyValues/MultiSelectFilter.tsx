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
  keys: string[];
  keysSelected: string[];
  onSelect: (type: string) => void;
  keyRemoved: (type: string) => void;
  showToolbarItem?: boolean;
};

export default function MultiSelectFilter({
  keys,
  keysSelected,
  onSelect,
  keyRemoved,
  showToolbarItem = true,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolbarFilter
      chips={keysSelected}
      deleteChip={(cat, key) => keyRemoved(key as string)}
      categoryName="Keys"
      showToolbarItem={showToolbarItem}
    >
      <Select
        role="menu"
        id="multi-keys-select"
        isOpen={isOpen}
        selected={keysSelected}
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
            Filter by key
          </MenuToggle>
        )}
      >
        <SelectList>
          {keys.map((type, i) => (
            <SelectOption
              hasCheckbox
              value={type}
              isSelected={keysSelected.includes(type)}
            >
              {type}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarFilter>
  );
}
