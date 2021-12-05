import { useState } from "react";
import { IJobFilters } from "types";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

type NameFilterProps = {
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
};

export default function NameFilter({ filters, setFilters }: NameFilterProps) {
  const [name, setName] = useState("");
  return (
    <ToolbarFilter
      chips={filters.name ? [filters.name] : []}
      deleteChip={() => setFilters({ ...filters, name: null })}
      categoryName="Name"
      showToolbarItem
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({
            ...filters,
            name: name,
          });
          setName("");
        }}
      >
        <InputGroup>
          <TextInput
            name="name"
            id="input-name"
            type="search"
            aria-label="name filter"
            onChange={setName}
            value={name}
            placeholder="Filter by name"
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
