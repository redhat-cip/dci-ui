import React from "react";
import { Filters } from "types";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

type TagsFilterProps = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

const TagsFilter = ({ filters, setFilters }: TagsFilterProps) => {
  const [tag, setTag] = React.useState("");
  return (
    <ToolbarFilter
      chips={filters.tags}
      deleteChip={(key, value) => {
        if (key) {
          setFilters({
            ...filters,
            tags: filters.tags.filter((f) => f !== value),
          });
        }
      }}
      categoryName="Tags"
      showToolbarItem
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (filters.tags.indexOf(tag) === -1) {
            setFilters({
              ...filters,
              tags: filters.tags.concat(tag),
            });
            setTag("");
          }
        }}
      >
        <InputGroup>
          <TextInput
            name="tag"
            id="input-tag"
            type="search"
            aria-label="tag filter"
            onChange={(tag) => setTag(tag)}
            value={tag}
            placeholder="Filter by tag..."
          />
          <Button
            variant={ButtonVariant.control}
            aria-label="search tag button"
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
};

export default TagsFilter;
