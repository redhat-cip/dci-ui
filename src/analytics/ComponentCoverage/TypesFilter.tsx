import { useState } from "react";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";

type TypesFilterProps = {
  types: string[];
  typesSelected: string[];
  onSelect: (type: string) => void;
  deleteChip: (type: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function TypesFilter({
  types,
  typesSelected,
  onSelect,
  deleteChip,
  onClear,
  showToolbarItem = true,
}: TypesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolbarFilter
      chips={typesSelected}
      deleteChip={(cat, chip) => deleteChip(chip as string)}
      categoryName="Types"
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeaheadMulti}
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          onSelect(selection as string);
        }}
        onClear={onClear}
        selections={typesSelected}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by types"
      >
        {types.map((s, index) => (
          <SelectOption key={index} value={s} />
        ))}
      </Select>
    </ToolbarFilter>
  );
}
