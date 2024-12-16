import { ToolbarFilter } from "@patternfly/react-core";
import TopicSelect from "./TopicSelect";
import { ITopic, IToolbarFilterProps } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTopicQuery } from "topics/topicsApi";

export default function TopicToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: IToolbarFilterProps<ITopic>) {
  const { data: topic, isFetching } = useGetTopicQuery(id ? id : skipToken);
  const labels = isFetching
    ? ["..."]
    : id === null || !topic
      ? []
      : [topic.name];
  return (
    <ToolbarFilter
      labels={labels}
      categoryName="Topic name"
      deleteLabel={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <TopicSelect
        onSelect={(topic) => {
          if (topic) {
            onSelect(topic);
          }
        }}
        placeholder={placeholder}
      />
    </ToolbarFilter>
  );
}
