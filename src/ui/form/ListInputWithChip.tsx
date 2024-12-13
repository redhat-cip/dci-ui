import { useState } from "react";
import {
  Label,
  LabelGroup,
  Button,
  TextInputGroup,
  TextInputGroupMain,
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
  [key: string]: any;
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
        <LabelGroup>
          {items.map((tag) => (
            <Label variant="outline" key={tag} onClose={() => deleteChip(tag)}>
              {tag}
            </Label>
          ))}
        </LabelGroup>
      </TextInputGroupMain>
      {showClearButton && (
        <TextInputGroupUtilities>
          <Button
            icon={<TimesIcon />}
            variant="plain"
            onClick={clearChipsAndInput}
            aria-label="clear items"
          />
        </TextInputGroupUtilities>
      )}
    </TextInputGroup>
  );
}
