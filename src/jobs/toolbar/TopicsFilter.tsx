import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTopics, getTopicById } from "topics/topicsSelectors";
import { ITopic } from "types";
import topicsActions from "topics/topicsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { AppDispatch } from "store";

type TopicsFilterProps = {
  topic_id: string | null;
  onSelect: (topic: ITopic) => void;
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
  const topic = useSelector(getTopicById(topic_id));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(topicsActions.all());
  }, [dispatch]);
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
        onSelect={(t) => onSelect(t as ITopic)}
        option={topic}
        options={topics}
      />
    </ToolbarFilter>
  );
};

export default TopicsFilter;
