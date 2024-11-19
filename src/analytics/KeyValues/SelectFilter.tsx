import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ToolbarFilter,
} from "@patternfly/react-core";
import { useState } from "react";

type Item = {
  label: string;
  value: string;
};

export default function SelectFilter<T extends Item>({
  item,
  items,
  onSelect,
  onClear,
  categoryName,
  placeholder,
}: {
  item?: T | undefined | null;
  items: T[];
  onSelect: (itemSelected: T) => void;
  onClear?: () => void | undefined;
  showToolbarItem?: boolean;
  categoryName: string;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const SelectToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      isExpanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      isFullWidth
    >
      {placeholder}
    </MenuToggle>
  );

  return (
    <ToolbarFilter
      labels={item === null || item === undefined ? [] : [item.label]}
      deleteLabel={onClear}
      categoryName={categoryName}
      showToolbarItem
    >
      <Select
        isOpen={isOpen}
        onSelect={(e, v) => {
          const selectedItem = items.find((i) => i.value === (v as string));
          if (selectedItem) {
            onSelect(selectedItem);
            setIsOpen(false);
          }
        }}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        toggle={SelectToggle}
        shouldFocusToggleOnSelect
      >
        <SelectList>
          {items.map((item) => (
            <SelectOption key={item.value} value={item.value}>
              {item.label}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarFilter>
  );
}
