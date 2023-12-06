import { useState } from "react";
import { ITopic } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { useGetTopicQuery, useListTopicsQuery } from "topics/topicsApi";
import { skipToken } from "@reduxjs/toolkit/query";

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
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useListTopicsQuery();
  const { data: topic } = useGetTopicQuery(topicId ? topicId : skipToken);

  if (!data) return null;

  return (
    <Select
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel={placeholderText}
      onToggle={(_event, val) => setIsOpen(val)}
      onSelect={(event, selection) => {
        setIsOpen(false);
        const s = selection as ITopic;
        onSelect(s.id);
      }}
      onClear={onClear}
      selections={topic === undefined ? "" : topic.name}
      isOpen={isOpen}
      aria-labelledby="select"
      placeholderText={placeholderText}
      maxHeight="220px"
    >
      {data.topics
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
  const { data: topic } = useGetTopicQuery(topicId ? topicId : skipToken);
  return (
    <ToolbarFilter
      chips={topic === undefined ? [] : [topic.name]}
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
