import { useState } from "react";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { sortedUniq } from "lodash";

type TagsFilterProps = {
  tags: string[];
  onSubmit: (tags: string[]) => void;
  showToolbarItem?: boolean;
};

export default function TagsFilter({
  tags,
  onSubmit,
  showToolbarItem = true,
}: TagsFilterProps) {
  const [tag, setTag] = useState("");
  const uniqTags = sortedUniq(tags);
  return (
    <ToolbarFilter
      chips={tags}
      deleteChip={(key, value) => {
        if (key) {
          onSubmit(uniqTags?.filter((f) => f !== value));
        }
      }}
      categoryName="Tags"
      showToolbarItem={showToolbarItem}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (uniqTags?.indexOf(tag) === -1) {
            onSubmit(uniqTags.concat(tag));
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
            placeholder="Filter by tag"
            isRequired
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
}
