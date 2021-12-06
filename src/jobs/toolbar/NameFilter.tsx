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
}: NameFilterProps) {
  const [innerName, setInnerName] = useState("");
  return (
    <ToolbarFilter
      chips={name === null ? [] : [name]}
      deleteChip={onClear}
      categoryName="Name"
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
            name="name"
            id="input-name"
            type="search"
            aria-label="name filter"
            onChange={setInnerName}
            value={innerName}
            placeholder="Filter by name"
            isRequired
          />
          <Button
            variant={ButtonVariant.control}
            aria-label="search name button"
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}
