import { useState } from "react";
import {
  ToolbarFilter,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  TextInputGroup,
  TextInputGroupMain,
  ChipGroup,
  Chip,
  TextInputGroupUtilities,
  InputGroupItem,
} from "@patternfly/react-core";
import { SearchIcon, TimesIcon } from "@patternfly/react-icons";
import { sortedUniq } from "lodash";

export function TagsInput({
  tags,
  setTags,
  ...props
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
  [k: string]: any;
}) {
  const [inputValue, setInputValue] = useState("");

  const showSearchIcon = !tags.length;

  const deleteChip = (chipToDelete: string) => {
    const newChips = tags.filter((chip) => !Object.is(chip, chipToDelete));
    setTags(newChips);
  };

  const showClearButton = !!inputValue || !!tags.length;

  const clearChipsAndInput = () => {
    setTags([]);
    setInputValue("");
  };

  return (
    <TextInputGroup {...props}>
      <TextInputGroupMain
        icon={showSearchIcon && <SearchIcon />}
        value={inputValue}
        onChange={(e, value) => setInputValue(value)}
        placeholder="Tags"
        onKeyPress={(event) => {
          if (event.key === "Enter" && tags.indexOf(inputValue) === -1) {
            event.preventDefault();
            setTags([...tags, inputValue]);
            setInputValue("");
          }
        }}
      >
        <ChipGroup>
          {tags.map((tag) => (
            <Chip key={tag} onClick={() => deleteChip(tag)}>
              {tag}
            </Chip>
          ))}
        </ChipGroup>
      </TextInputGroupMain>
      {showClearButton && (
        <TextInputGroupUtilities>
          <Button
            variant="plain"
            onClick={clearChipsAndInput}
            aria-label="clear tags"
          >
            <TimesIcon />
          </Button>
        </TextInputGroupUtilities>
      )}
    </TextInputGroup>
  );
}

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
          <InputGroupItem isFill>
            <TextInput
              name="tag"
              id="input-tag"
              type="search"
              aria-label="tag filter"
              onChange={(_event, tag) => setTag(tag)}
              value={tag}
              placeholder="Filter by tag"
              isRequired
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant={ButtonVariant.control}
              aria-label="search tag button"
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
