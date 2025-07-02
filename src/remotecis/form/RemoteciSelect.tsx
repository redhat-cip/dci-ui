import { useState } from "react";
import { useListRemotecisQuery } from "remotecis/remotecisApi";
import type { IRemoteci } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

export default function RemoteciSelect({
  onSelect,
  id = "remoteci-select",
  name = "remoteci_id",
  ...props
}: {
  onSelect: (item: IRemoteci | null) => void;
  name?: string;
  id?: string;
  [key: string]: any;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListRemotecisQuery({ name: search });
  return (
    <TypeaheadSelect
      id={id}
      name={name}
      isFetching={isFetching}
      items={data?.remotecis || []}
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
