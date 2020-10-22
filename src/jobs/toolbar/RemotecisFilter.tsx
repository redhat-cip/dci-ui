import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRemotecis, getRemoteciById } from "remotecis/remotecisSelectors";
import { IRemoteci } from "types";
import remotecisActions from "remotecis/remotecisActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { AppDispatch } from "store";

type RemotecisFilterProps = {
  remoteci_id: string | null;
  onSelect: (remoteci: IRemoteci) => void;
  onClear: () => void;
  showToolbarItem: boolean;
};

const RemotecisFilter = ({
  remoteci_id,
  onSelect,
  onClear,
  showToolbarItem,
}: RemotecisFilterProps) => {
  const remotecis = useSelector(getRemotecis);
  const remoteci = useSelector((state) => getRemoteciById(remoteci_id)(state));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(remotecisActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={remoteci ? [remoteci.name] : []}
      deleteChip={onClear}
      categoryName="Remoteci"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by remoteci..."
        onClear={onClear}
        onSelect={(r) => onSelect(r as IRemoteci)}
        option={remoteci}
        options={remotecis}
      />
    </ToolbarFilter>
  );
};

export default RemotecisFilter;
