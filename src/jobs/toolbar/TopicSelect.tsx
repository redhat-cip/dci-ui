import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useListTopicsQuery, useGetTopicQuery } from "topics/topicsApi";
import TypeheadSelect from "ui/form/TypeheadSelect";
import { SelectProps, ITopic } from "types";

export default function TopicSelect({
  id,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: SelectProps<ITopic>) {
  const [search, setSearch] = useState("");
  const { data, isFetching } = useListTopicsQuery({
    name: search.endsWith("*") ? search : `${search}*`,
  });
  const { data: getTopicData, isFetching: isFetchingTopic } = useGetTopicQuery(
    id ? id : skipToken,
  );
  const topics = data?.topics || [];
  const topic =
    isFetchingTopic || getTopicData === undefined ? null : getTopicData;
  return (
    <TypeheadSelect
      placeholder={placeholder}
      onClear={onClear}
      onSelect={(item) => {
        const selectedTopic = item && topics.find((r) => r.id === item.value);
        if (selectedTopic) {
          onSelect(selectedTopic);
        }
      }}
      item={
        id
          ? topic === null
            ? { value: id, label: "" }
            : { value: topic.id, label: topic.name }
          : null
      }
      items={topics.map((topic) => ({
        value: topic.id,
        label: topic.name,
      }))}
      isLoading={isFetching}
      search={setSearch}
    />
  );
}
