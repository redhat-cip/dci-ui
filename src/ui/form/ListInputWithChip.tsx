import { useState } from "react";
import {
  Button,
  TextInputGroup,
  TextInputGroupMain,
  ChipGroup,
  Chip,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { SearchIcon, TimesIcon } from "@patternfly/react-icons";

export default function ListInputWithChip({
  items,
  setItems,
  placeholder = "",
  ...props
}: {
  items: string[];
  setItems: (items: string[]) => void;
  placeholder?: string;
  [k: string]: any;
}) {
  const [inputValue, setInputValue] = useState("");

  const showSearchIcon = !items.length;

  const deleteChip = (chipToDelete: string) => {
    const newChips = items.filter((chip) => !Object.is(chip, chipToDelete));
    setItems(newChips);
  };

  const showClearButton = !!inputValue || !!items.length;

  const clearChipsAndInput = () => {
    setItems([]);
    setInputValue("");
  };

  return (
    <TextInputGroup {...props}>
      <TextInputGroupMain
        icon={showSearchIcon && <SearchIcon />}
        value={inputValue}
        onChange={(e, value) => setInputValue(value)}
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key === "Enter" && items.indexOf(inputValue) === -1) {
            event.preventDefault();
            setItems([...items, inputValue]);
            setInputValue("");
          }
        }}
      >
        <ChipGroup>
          {items.map((tag) => (
            <Chip key={tag} onClick={() => deleteChip(tag)}>
              {tag}
            </Chip>
          ))}
        </ChipGroup>
      </TextInputGroupMain>
      {showClearButton && (
        <TextInputGroupUtilities>
          <Button
            variant="plain"
            onClick={clearChipsAndInput}
            aria-label="clear items"
          >
            <TimesIcon />
          </Button>
        </TextInputGroupUtilities>
      )}
    </TextInputGroup>
  );
}
