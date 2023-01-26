import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getActiveTopics, getTopicById } from "topics/topicsSelectors";
import { ITopic } from "types";
import topicsActions from "topics/topicsActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { AppDispatch } from "store";

export function TopicSelect({
  topicId,
  placeholderText = "",
  onSelect,
  onClear,
}: {
  topicId: string | null;
  placeholderText?: string;
  onSelect: (topicId: string) => void;
  onClear: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const topics = useSelector(getActiveTopics);
  const topic = useSelector(getTopicById(topicId));

  useEffect(() => {
    dispatch(topicsActions.all());
  }, [dispatch]);

  return (
    <Select
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel={placeholderText}
      onToggle={setIsOpen}
      onSelect={(event, selection) => {
        setIsOpen(false);
        const s = selection as ITopic;
        onSelect(s.id);
      }}
      onClear={onClear}
      selections={topic === null ? "" : topic.name}
      isOpen={isOpen}
      aria-labelledby="select"
      placeholderText={placeholderText}
      maxHeight="220px"
    >
      {topics
        .map((t) => ({ ...t, toString: () => t.name }))
        .map((topic) => (
          <SelectOption key={topic.id} value={topic} />
        ))}
    </Select>
  );
}

type TopicFilterProps = {
  topicId: string | null;
  onSelect: (topicId: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TopicFilter({
  topicId,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Topic",
}: TopicFilterProps) {
  const topic = useSelector(getTopicById(topicId));
  return (
    <ToolbarFilter
      chips={topic === null ? [] : [topic.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TopicSelect
        placeholderText={placeholderText}
        topicId={topicId}
        onSelect={onSelect}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
