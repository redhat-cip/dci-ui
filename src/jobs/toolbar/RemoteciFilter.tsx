import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRemotecis,
  getRemoteciById,
  isFetchingRemotecis,
} from "remotecis/remotecisSelectors";
import { IRemoteci } from "types";
import remotecisActions from "remotecis/remotecisActions";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";

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
  const [searchValue, setSearchValue] = useState("");
  const remotecis = useSelector(getRemotecis);
  const isFetching = useSelector(isFetchingRemotecis);
  const remoteci = useSelector(getRemoteciById(remoteciId));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    if (debouncedSearchValue) {
      dispatch(
        remotecisActions.all({ where: `name:${debouncedSearchValue}*` }),
      );
    }
  }, [debouncedSearchValue, dispatch]);

  useEffect(() => {
    if (remoteciId) {
      dispatch(remotecisActions.one(remoteciId));
    }
  }, [remoteciId, dispatch]);

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
      selections={remoteci === null ? "" : remoteci.name}
      isOpen={isOpen}
      aria-labelledby="select"
      placeholderText={placeholderText}
      maxHeight="220px"
      onTypeaheadInputChanged={setSearchValue}
      noResultsFoundText={
        debouncedSearchValue === ""
          ? "Search a remoteci by name"
          : isFetching
          ? "Searching..."
          : "No remoteci matching this name"
      }
    >
      {remotecis
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
  const remoteci = useSelector(getRemoteciById(remoteciId));
  return (
    <ToolbarFilter
      chips={remoteci === null ? [] : [remoteci.name]}
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
