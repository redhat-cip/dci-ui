import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  Spinner,
  TextInputGroupUtilities,
  Button,
} from "@patternfly/react-core";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import useEffectAfterFirstMount from "hooks/useEffectAfterFirstMount";
import { TimesIcon } from "@patternfly/react-icons";

type Item = {
  value: string;
  label: string;
};

export default function TypeheadSelect<T extends Item>({
  id,
  item,
  items,
  onClear,
  onSelect,
  placeholder = "",
  isLoading = false,
  filterItems = (item: T, inputValue: string) =>
    item.label
      .toLowerCase()
      .includes(inputValue.replace(/\*$/, "").toLowerCase()),
  search = (_inputSearch: string) => void 0,
}: {
  id: string;
  item?: T | undefined | null;
  items: T[];
  onSelect: (item: T | null) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  filterItems?: (item: T, inputValue: string) => boolean;
  search?: (searchValue: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const textInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedInputValue = useDebouncedValue(searchValue, 1000);
  const filteredItems = items.filter((item) => filterItems(item, searchValue));
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const userIsTyping =
    searchValue !== "" && searchValue !== debouncedInputValue;

  useEffectAfterFirstMount(() => {
    search(debouncedInputValue);
  }, [debouncedInputValue]);

  useEffect(() => {
    if (searchValue && !isOpen) {
      setIsOpen(true);
    }
  }, [searchValue, isOpen]);

  useEffect(() => {
    setInputValue(item?.label || "");
  }, [item?.label]);

  const toggleSetIsOpen = () => {
    if (!isOpen) {
      textInputRef?.current?.select();
    }
    setIsOpen(!isOpen);
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === "ArrowUp") {
        if (focusedItemIndex === null || focusedItemIndex <= 0) {
          indexToFocus = filteredItems.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === "ArrowDown") {
        if (
          focusedItemIndex === null ||
          focusedItemIndex >= filteredItems.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      if (indexToFocus !== undefined) {
        setFocusedItemIndex(indexToFocus);
      }
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        if (isOpen && focusedItemIndex !== null) {
          const selectedItem = filteredItems[focusedItemIndex];
          onSelect(selectedItem);
          setInputValue(selectedItem.label);
          setSearchValue("");
        }
        setIsOpen((prevIsOpen) => !prevIsOpen);
        setFocusedItemIndex(null);
        break;
      case "Tab":
      case "Escape":
        setIsOpen(false);
        setFocusedItemIndex(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        setIsOpen(true);
        break;
    }
  };

  const ToolbarFilterToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      isFullWidth
      isExpanded={isOpen}
      onClick={toggleSetIsOpen}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          placeholder={placeholder}
          value={inputValue}
          onClick={toggleSetIsOpen}
          onChange={(e, v) => {
            setInputValue(v);
            setSearchValue(v);
          }}
          onKeyDown={onInputKeyDown}
          id={`toggle-${id}`}
          autoComplete="off"
          ref={textInputRef}
        />
        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={() => {
                setInputValue("");
                setSearchValue("");
                onClear();
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id={id}
      isOpen={isOpen}
      selected={item?.value}
      onSelect={(e, v) => {
        const selectedItem = items.find((i) => i.value === (v as string));
        if (selectedItem) {
          setInputValue(selectedItem.label);
          setSearchValue("");
          onSelect(selectedItem);
        }
        setFocusedItemIndex(null);
        setIsOpen(false);
      }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={ToolbarFilterToggle}
      shouldFocusToggleOnSelect
    >
      {isLoading || userIsTyping ? (
        <div className="pf-v5-u-m-md">
          <Spinner size="md" aria-label="loading" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="pf-v5-u-m-md">No results</div>
      ) : (
        <SelectList style={{ maxHeight: 320, overflowY: "auto" }}>
          {filteredItems.map((filteredItem, index) => (
            <SelectOption
              id={`${id}[${index}]`}
              data-testid={`${id}[${index}]`}
              key={filteredItem.value}
              value={filteredItem.value}
              isFocused={focusedItemIndex === index}
            >
              {filteredItem.label}
            </SelectOption>
          ))}
        </SelectList>
      )}
    </Select>
  );
}
