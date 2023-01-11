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
  topic,
  placeholderText = "",
  onSelect,
  onClear,
}: {
  topic: ITopic | null;
  placeholderText?: string;
  onSelect: (topic: ITopic) => void;
  onClear: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const topics = useSelector(getActiveTopics);

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
        onSelect(s);
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
  topic_id: string | null;
  onSelect: (topic: ITopic) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TopicFilter({
  topic_id,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Topic",
}: TopicFilterProps) {
  const topic = useSelector(getTopicById(topic_id));
  return (
    <ToolbarFilter
      chips={topic === null ? [] : [topic.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TopicSelect
        placeholderText={placeholderText}
        topic={topic}
        onSelect={onSelect}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
