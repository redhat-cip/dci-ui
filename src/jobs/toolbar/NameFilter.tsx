import { useState } from "react";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

type NameFilterProps = {
  categoryName?: string;
  name: string | null;
  onSubmit: (name: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function NameFilter({
  name,
  onSubmit,
  onClear,
  showToolbarItem = true,
  categoryName = "Name",
}: NameFilterProps) {
  const [innerName, setInnerName] = useState("");
  const lowerCategoryName = categoryName.toLowerCase();
  return (
    <ToolbarFilter
      chips={name === null ? [] : [name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(innerName);
          setInnerName("");
        }}
      >
        <InputGroup>
          <TextInput
            name={lowerCategoryName}
            id={`input-${lowerCategoryName}`}
            type="search"
            aria-label={`${lowerCategoryName} filter`}
            onChange={setInnerName}
            value={innerName}
            placeholder={`Filter by ${lowerCategoryName}`}
            isRequired
          />
          <Button
            variant={ButtonVariant.control}
            aria-label={`Search by ${lowerCategoryName} button`}
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}
