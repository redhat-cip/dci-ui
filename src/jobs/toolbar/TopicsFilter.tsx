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

type TopicsFilterProps = {
  topic_id: string | null;
  onSelect: (topic: ITopic) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function TopicsFilter({
  topic_id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: TopicsFilterProps) {
  const topics = useSelector(getActiveTopics);
  const topic = useSelector(getTopicById(topic_id));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(topicsActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={topic === null ? [] : [topic.name]}
      deleteChip={onClear}
      categoryName="Topic"
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Filter by topic"
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
        placeholderText="Filter by topic"
        maxHeight="220px"
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
