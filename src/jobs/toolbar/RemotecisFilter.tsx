import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRemotecis,
  getRemoteciById,
  isFetchingRemotecis,
} from "remotecis/remotecisSelectors";
import { IRemoteci } from "types";
import remotecisActions from "remotecis/remotecisActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";

export function RemoteciSelect({
  remoteci,
  placeholderText,
  onSelect,
  onClear,
}: {
  remoteci: IRemoteci | null;
  onSelect: (remoteci: IRemoteci) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
}) {
  const [searchValue, setSearchValue] = useState("");
  const remotecis = useSelector(getRemotecis);
  const isFetching = useSelector(isFetchingRemotecis);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    if (debouncedSearchValue) {
      dispatch(
        remotecisActions.all({ where: `name:${debouncedSearchValue}*` })
      );
    }
  }, [debouncedSearchValue, dispatch]);

  return (
    <Select
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel={placeholderText}
      onToggle={setIsOpen}
      onSelect={(event, selection) => {
        setIsOpen(false);
        const s = selection as IRemoteci;
        onSelect(s);
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

type RemotecisFilterProps = {
  remoteci_id: string | null;
  onSelect: (remoteci: IRemoteci) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function RemotecisFilter({
  remoteci_id,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search a name",
  categoryName = "Remoteci",
}: RemotecisFilterProps) {
  const remoteci = useSelector(getRemoteciById(remoteci_id));
  return (
    <ToolbarFilter
      chips={remoteci === null ? [] : [remoteci.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <RemoteciSelect
        remoteci={remoteci}
        placeholderText={placeholderText}
        onClear={onClear}
        onSelect={onSelect}
      />
    </ToolbarFilter>
  );
}
