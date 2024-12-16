import { useState } from "react";
import { useListTopicsQuery } from "topics/topicsApi";
import { ITopic } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

export default function TopicSelect({
  onSelect,
  id = "topic-select",
  name = "topic_id",
  ...props
}: {
  onSelect: (item: ITopic | null) => void;
  name?: string;
  id?: string;
  [key: string]: any;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListTopicsQuery({ name: search });
  return (
    <TypeaheadSelect
      id={id}
      name={name}
      isFetching={isFetching}
      items={data?.topics || []}
      onSelect={onSelect}
      onSearch={(newSearch) => {
        if (newSearch.trim().endsWith("*")) {
          setSearch(newSearch);
        } else {
          setSearch(`${newSearch}*`);
        }
      }}
      {...props}
    />
  );
}
