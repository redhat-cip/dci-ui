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

type ConfigurationFilterProps = {
  configuration: string | null;
  onSubmit: (configuration: string) => void;
  onClear: () => void;
  showToolbarItem: boolean;
};

export default function ConfigurationFilter({
  configuration,
  onSubmit,
  onClear,
  showToolbarItem,
}: ConfigurationFilterProps) {
  const [innerConfiguration, setInnerConfiguration] = useState("");
  return (
    <ToolbarFilter
      chips={configuration === null ? [] : [configuration]}
      deleteChip={onClear}
      categoryName="Configuration"
      showToolbarItem={showToolbarItem}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(innerConfiguration);
          setInnerConfiguration("");
        }}
      >
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              name="configuration"
              id="input-configuration"
              type="search"
              aria-label="configuration filter"
              onChange={(_event, val) => setInnerConfiguration(val)}
              value={innerConfiguration}
              placeholder="Filter by configuration"
              isRequired
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant={ButtonVariant.control}
              aria-label="search configuration button"
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
