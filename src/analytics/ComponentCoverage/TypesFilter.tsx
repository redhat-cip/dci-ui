import { useState } from "react";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";

type TypesFilterProps = {
  types: string[];
  typesSelected: string[];
  onSelect: (type: string) => void;
  deleteChip: (type: string) => void;
  showToolbarItem?: boolean;
};

export default function TypesFilter({
  types,
  typesSelected,
  onSelect,
  deleteChip,
  showToolbarItem = true,
}: TypesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolbarFilter
      labels={typesSelected}
      deleteLabel={(cat, chip) => deleteChip(chip as string)}
      categoryName="Types"
      showToolbarItem={showToolbarItem}
    >
      <Select
        role="menu"
        id="multi-type-select"
        isOpen={isOpen}
        selected={typesSelected}
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
            Filter by types
          </MenuToggle>
        )}
      >
        <SelectList>
          {types.map((type, i) => (
            <SelectOption
              hasCheckbox
              value={type}
              isSelected={typesSelected.includes(type)}
            >
              {type}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarFilter>
  );
}
