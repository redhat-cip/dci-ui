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
import { TimesIcon } from "@patternfly/react-icons";

type Item = {
  id: string;
  name: string;
};

export default function TypeaheadSelect<T extends Item>({
  id,
  name = "",
  item,
  items,
  onSelect,
  onSearch,
  placeholder = "",
  isFetching = false,
  hasError = false,
  ...props
}: {
  id: string;
  name?: string;
  item?: T | null;
  items: T[];
  onSelect: (item: T | null) => void;
  onSearch: (s: string) => void;
  placeholder?: string;
  isFetching?: boolean;
  hasError?: boolean;
  [key: string]: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputSearch, setInputSearch] = useState<string>("");
  const debouncedSearch = useDebouncedValue(inputSearch, 500);
  const textInputRef = useRef<HTMLInputElement>(null);
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(inputSearch.toLowerCase()),
  );
  const isLoading = isFetching || inputSearch !== debouncedSearch;

  const toggleSetIsOpen = () => {
    if (!isOpen) {
      textInputRef?.current?.select();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      onSearch(debouncedSearch);
    }
  }, [isOpen, onSearch, debouncedSearch]);

  useEffect(() => {
    setInputValue(item?.name || "");
  }, [setInputValue, item]);

  const SelectToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label={`Toggle ${name} select`}
      isFullWidth
      isExpanded={isOpen}
      onClick={toggleSetIsOpen}
      status={hasError ? "danger" : undefined}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          placeholder={placeholder}
          value={isOpen ? inputSearch : inputValue}
          onClick={toggleSetIsOpen}
          onChange={(e, v) => {
            setInputSearch(v);
            if (!isOpen) {
              setIsOpen(true);
            }
          }}
          id={`toggle-${id}`}
          autoComplete="off"
          ref={textInputRef}
        />
        <TextInputGroupUtilities>
          {!!inputSearch && (
            <Button
              icon={<TimesIcon aria-hidden />}
              variant="plain"
              onClick={() => {
                setInputSearch("");
                onSelect(null);
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            />
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id={id}
      isOpen={isOpen}
      onSelect={(e, v) => {
        const selectedItem = items.find((i) => i.id === (v as string));
        if (selectedItem) {
          onSelect(selectedItem);
          setInputSearch("");
          setInputValue(selectedItem.name);
        }
        setIsOpen(false);
      }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={SelectToggle}
      shouldFocusToggleOnSelect
      {...props}
    >
      <SelectList>
        {isLoading && (
          <div className="pf-v6-u-px-lg pf-v6-u-py-xs">
            <Spinner size="md" aria-label="loading" />
          </div>
        )}
        {filteredItems.length === 0 && !isLoading && (
          <SelectOption value="" isAriaDisabled={true} isDisabled>
            {inputSearch === ""
              ? "No results"
              : `No results found for "${inputSearch}"`}
          </SelectOption>
        )}
        {filteredItems.map((filteredItem, index) => (
          <SelectOption
            id={`${id}[${index}]`}
            key={filteredItem.id}
            value={filteredItem.id}
            isSelected={filteredItem.id === item?.id}
          >
            {filteredItem.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
}
