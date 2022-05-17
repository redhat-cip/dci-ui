import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getActiveTopics,
  getTopicById,
  isFetchingTopics,
} from "topics/topicsSelectors";
import { ITopic } from "types";
import topicsActions from "topics/topicsActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";

type TopicsFilterProps = {
  topic_id: string | null;
  onSelect: (topic: ITopic) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TopicsFilter({
  topic_id,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Topic",
}: TopicsFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const topics = useSelector(getActiveTopics);
  const topic = useSelector(getTopicById(topic_id));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(isFetchingTopics);

  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    if (debouncedSearchValue) {
      dispatch(topicsActions.all({ where: `name:${debouncedSearchValue}*` }));
    }
  }, [debouncedSearchValue, dispatch]);

  return (
    <ToolbarFilter
      chips={topic === null ? [] : [topic.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={placeholderText}
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as ITopic;
          onSelect(s);
        }}
        onClear={onClear}
        selections={topic === null ? "" : topic.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText={placeholderText}
        maxHeight="220px"
        onTypeaheadInputChanged={setSearchValue}
        noResultsFoundText={
          debouncedSearchValue === ""
            ? "Search a topic by name"
            : isFetching
            ? "Searching..."
            : "No topic matching this name"
        }
      >
        {topics
          .map((t) => ({ ...t, toString: () => t.name }))
          .map((topic) => (
            <SelectOption key={topic.id} value={topic} />
          ))}
      </Select>
    </ToolbarFilter>
  );
}
