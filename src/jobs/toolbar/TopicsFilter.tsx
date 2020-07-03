import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTopics, getTopicById } from "topics/topicsSelectors";
import { Topic } from "types";
import topicsActions from "topics/topicsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";

type TopicsFilterProps = {
  topic_id: string | null;
  onSelect: (topic: Topic) => void;
  onClear: () => void;
  showToolbarItem: boolean;
};

const TopicsFilter = ({
  topic_id,
  onSelect,
  onClear,
  showToolbarItem,
}: TopicsFilterProps) => {
  const topics = useSelector(getTopics);
  const topic = useSelector((state) => getTopicById(topic_id)(state));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(topicsActions.all());
  }, []);
  return (
    <ToolbarFilter
      chips={topic ? [topic.name] : []}
      deleteChip={onClear}
      categoryName="Topic"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by topic..."
        onClear={onClear}
        onSelect={onSelect}
        option={topic}
        options={topics}
      />
    </ToolbarFilter>
  );
};

export default TopicsFilter;
