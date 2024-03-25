import { useEffect, useState } from "react";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Button,
  Spinner,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

type Item = {
  value: string;
  label: string;
};

export default function DCISelect<T extends Item>({
  item,
  items,
  onClear,
  onSelect,
  placeholder = "Select a value",
  isLoading = false,
}: {
  item?: T | undefined | null;
  items: T[];
  onSelect: (item: T | null) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(placeholder);

  useEffect(() => {
    setSelected(item?.label || placeholder);
  }, [item, placeholder]);

  const toggleSetIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const SelectToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      isExpanded={isOpen}
      onClick={toggleSetIsOpen}
      isFullWidth
      badge={
        !!item && (
          <Button
            variant="plain"
            onClick={() => {
              setSelected(placeholder);
              onClear();
            }}
            aria-label="Clear input value"
            className="pf-v5-u-p-0 pf-v5-u-pl-md"
          >
            <TimesIcon aria-hidden />
          </Button>
        )
      }
    >
      {selected}
    </MenuToggle>
  );

  return (
    <Select
      isOpen={isOpen}
      selected={selected}
      onSelect={(e, v) => {
        const selectedItem = items.find((i) => i.value === (v as string));
        if (selectedItem) {
          setSelected(selectedItem.label);
          onSelect(selectedItem);
          setIsOpen(false);
        }
      }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={SelectToggle}
      shouldFocusToggleOnSelect
    >
      {isLoading ? (
        <div className="pf-v5-u-m-md">
          <Spinner size="md" aria-label="loading" />
        </div>
      ) : (
        <SelectList>
          {items.map((item) => (
            <SelectOption key={item.value} value={item.value}>
              {item.label}
            </SelectOption>
          ))}
        </SelectList>
      )}
    </Select>
  );
}
