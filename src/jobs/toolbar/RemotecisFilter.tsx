import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRemotecis, getRemoteciById } from "remotecis/remotecisSelectors";
import { Remoteci } from "types";
import remotecisActions from "remotecis/remotecisActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";

type RemotecisFilterProps = {
  remoteci_id: string | null;
  onSelect: (remoteci: Remoteci) => void;
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
  const dispatch = useDispatch();
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
        onSelect={onSelect}
        option={remoteci}
        options={remotecis}
      />
    </ToolbarFilter>
  );
};

export default RemotecisFilter;
