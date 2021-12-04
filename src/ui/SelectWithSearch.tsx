import { useState } from "react";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";

type ObjectWithIdAndName = {
  id: string;
  name: string;
  toString?: () => string;
  [x: string]: any;
};

type SelectWithSearchProps = {
  option: ObjectWithIdAndName | null;
  options: ObjectWithIdAndName[];
  onClear: () => void;
  onSelect: (selection: ObjectWithIdAndName) => void;
  placeholder?: string;
};

export default function SelectWithSearch({
  option,
  options,
  onClear,
  onSelect,
  placeholder = "...",
}: SelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Select
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel={placeholder}
      onToggle={setIsOpen}
      onSelect={(event, selection) => {
        setIsOpen(false);
        const s = selection as ObjectWithIdAndName;
        delete s.toString;
        onSelect(s);
      }}
      onClear={onClear}
      selections={
        option
          ? {
              ...option,
              toString: () => option.name,
            }
          : ""
      }
      isOpen={isOpen}
      aria-labelledby="select"
      placeholderText={placeholder}
      maxHeight="220px"
    >
      {options
        .map((o) => ({ ...o, toString: () => o.name }))
        .map((option) => (
          <SelectOption key={option.id} value={option} />
        ))}
    </Select>
  );
}
