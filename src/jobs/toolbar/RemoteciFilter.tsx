import { useState } from "react";
import { IRemoteci } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import {
  useListRemotecisQuery,
  useGetRemoteciQuery,
} from "remotecis/remotecisApi";
import { skipToken } from "@reduxjs/toolkit/query";

export function RemoteciSelect({
  remoteciId,
  placeholderText,
  onSelect,
  onClear,
}: {
  remoteciId: string | null;
  onSelect: (remoteciId: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);
  const { data, isLoading } = useListRemotecisQuery({
    name: debouncedSearchValue,
  });
  const { data: remoteci } = useGetRemoteciQuery(
    remoteciId ? remoteciId : skipToken,
  );

  if (!data) return null;

  return (
    <Select
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel={placeholderText}
      onToggle={(_event, val) => setIsOpen(val)}
      onSelect={(event, selection) => {
        setIsOpen(false);
        const s = selection as IRemoteci;
        onSelect(s.id);
      }}
      onClear={onClear}
      selections={remoteci === undefined ? "" : remoteci.name}
      isOpen={isOpen}
      aria-labelledby="select"
      placeholderText={placeholderText}
      maxHeight="220px"
      onTypeaheadInputChanged={setSearchValue}
      noResultsFoundText={
        debouncedSearchValue === ""
          ? "Search a remoteci by name"
          : isLoading
            ? "Searching..."
            : "No remoteci matching this name"
      }
    >
      {data.remotecis
        .map((p) => ({ ...p, toString: () => p.name }))
        .map((remoteci) => (
          <SelectOption key={remoteci.id} value={remoteci} />
        ))}
    </Select>
  );
}

type RemoteciFilterProps = {
  remoteciId: string | null;
  onSelect: (remoteci: string) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function RemoteciFilter({
  remoteciId,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search a name",
  categoryName = "Remoteci",
}: RemoteciFilterProps) {
  const { data: remoteci } = useGetRemoteciQuery(
    remoteciId ? remoteciId : skipToken,
  );
  return (
    <ToolbarFilter
      chips={remoteci === undefined ? [] : [remoteci.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <RemoteciSelect
        remoteciId={remoteciId}
        placeholderText={placeholderText}
        onClear={onClear}
        onSelect={onSelect}
      />
    </ToolbarFilter>
  );
}
