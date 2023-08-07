import { useState } from "react";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  InputGroupItem,
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
          <InputGroupItem isFill>
            <TextInput
              name={lowerCategoryName}
              id={`input-${lowerCategoryName}`}
              type="search"
              aria-label={`${lowerCategoryName} filter`}
              onChange={(_event, val) => setInnerName(val)}
              value={innerName}
              placeholder={`Filter by ${lowerCategoryName}`}
              isRequired
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant={ButtonVariant.control}
              aria-label={`Search by ${lowerCategoryName} button`}
              type="submit"
            >
              <SearchIcon />
            </Button>
          </InputGroupItem>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}
