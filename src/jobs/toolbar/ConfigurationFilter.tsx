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

type ConfigurationFilterProps = {
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
};

export default function ConfigurationFilter({
  filters,
  setFilters,
}: ConfigurationFilterProps) {
  const [configuration, setConfiguration] = useState("");
  return (
    <ToolbarFilter
      chips={filters.configuration ? [filters.configuration] : []}
      deleteChip={() => setFilters({ ...filters, configuration: null })}
      categoryName="Configuration"
      showToolbarItem
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({
            ...filters,
            configuration: configuration,
          });
          setConfiguration("");
        }}
      >
        <InputGroup>
          <TextInput
            name="configuration"
            id="input-configuration"
            type="search"
            aria-label="configuration filter"
            onChange={setConfiguration}
            value={configuration}
            placeholder="Filter by configuration"
          />
          <Button
            variant={ButtonVariant.control}
            aria-label="search configuration button"
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}
