import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRemotecis, getRemoteciById } from "remotecis/remotecisSelectors";
import { IRemoteci } from "types";
import remotecisActions from "remotecis/remotecisActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
import { AppDispatch } from "store";

type RemotecisFilterProps = {
  remoteci_id: string | null;
  onSelect: (remoteci: IRemoteci) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function RemotecisFilter({
  remoteci_id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: RemotecisFilterProps) {
  const remotecis = useSelector(getRemotecis);
  const remoteci = useSelector(getRemoteciById(remoteci_id));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(remotecisActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={remoteci === null ? [] : [remoteci.name]}
      deleteChip={onClear}
      categoryName="Remoteci"
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Filter by remoteci"
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
        placeholderText="Filter by remoteci"
        maxHeight="220px"
      >
        {remotecis
          .map((p) => ({ ...p, toString: () => p.name }))
          .map((remoteci) => (
            <SelectOption key={remoteci.id} value={remoteci} />
          ))}
      </Select>
    </ToolbarFilter>
  );
}
