import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import {
  applyCompletion,
  Completion,
  getCompletions,
} from "analytics/autocompletion/autocompletion";
import { useCallback, useEffect, useRef, useState } from "react";

export interface QueryToolBarInputSearchProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export default function QueryToolBarInputSearch({
  value,
  onChange,
}: QueryToolBarInputSearchProps) {
  const [cursor, setCursor] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const isAutocompleteOpen = completions.length > 0;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  const _applyCompletion = useCallback(
    (value: string, cursor: number, completion: Completion | undefined) => {
      if (completion) {
        const { newValue, newCursor } = applyCompletion({
          value,
          cursor,
          completion,
        });
        onChange(newValue);
        setCursor(newCursor);
        setFocusedIndex(null);
      }
    },
    [onChange],
  );

  const handleCursorPosition = () => {
    const input = searchInputRef.current;
    if (input) {
      setCursor(input.selectionStart || 0);
    }
  };

  useEffect(() => {
    if (value) {
      setCompletions(getCompletions(value, cursor));
    }
  }, [value, cursor]);

  useEffect(() => {
    if (completions.length === 0) {
      setFocusedIndex(null);
    }
  }, [completions]);

  useEffect(() => {
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (isAutocompleteOpen && searchInputRef.current === event.target) {
        if (event.key === "Escape") {
          setCompletions([]);
          setFocusedIndex(null);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === null || prev >= completions.length - 1) return 0;
            return prev + 1;
          });
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === null || prev <= 0) return completions.length - 1;
            return prev - 1;
          });
        } else if (event.key === "Enter" && focusedIndex !== null) {
          event.preventDefault();
          const completion = completions[focusedIndex];
          _applyCompletion(value, cursor, completion);
        }
      }
    };
    window.addEventListener("keydown", handleMenuKeys);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
    };
  }, [
    isAutocompleteOpen,
    focusedIndex,
    _applyCompletion,
    value,
    cursor,
    completions,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAutocompleteOpen &&
        autocompleteRef &&
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setCompletions([]);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen]);

  return (
    <Popper
      trigger={
        <SearchInput
          id="job-search"
          value={value}
          onChange={(event, value) => {
            onChange(value);
            handleCursorPosition();
          }}
          onClear={() => onChange("")}
          ref={searchInputRef}
        />
      }
      triggerRef={searchInputRef}
      popper={
        <Menu
          ref={autocompleteRef}
          onSelect={(
            event?: React.MouseEvent,
            completionValue?: string | number,
          ) => {
            event?.stopPropagation();
            const completion = completions.find(
              (c) => c.value === completionValue,
            );
            _applyCompletion(value, cursor, completion);
            searchInputRef?.current?.focus();
          }}
        >
          <MenuContent>
            <MenuList>
              {completions.map((option, index) => (
                <MenuItem
                  itemId={option.value}
                  key={index}
                  isFocused={index === focusedIndex}
                  isActive={index === focusedIndex}
                >
                  {option.value}
                </MenuItem>
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      }
      popperRef={autocompleteRef}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
    />
  );
}
