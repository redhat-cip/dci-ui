import { ToolbarFilter } from "@patternfly/react-core";
import RemoteciSelect from "./RemoteciSelect";
import { IRemoteci, IToolbarFilterProps } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetRemoteciQuery } from "remotecis/remotecisApi";

export default function RemoteciToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: IToolbarFilterProps<IRemoteci>) {
  const { data: remoteci, isFetching } = useGetRemoteciQuery(
    id ? id : skipToken,
  );
  const labels = isFetching
    ? ["..."]
    : id === null || !remoteci
      ? []
      : [remoteci.name];
  return (
    <ToolbarFilter
      labels={labels}
      categoryName="Remoteci name"
      deleteLabel={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <RemoteciSelect
        onSelect={(remoteci) => {
          if (remoteci) {
            onSelect(remoteci);
          }
        }}
        placeholder={placeholder}
      />
    </ToolbarFilter>
  );
}
