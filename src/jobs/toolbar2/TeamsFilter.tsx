import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Team } from "types";
import { getTeams, getTeamById } from "teams/teamsSelectors";
import teamsActions from "teams/teamsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";

type TeamsFilterProps = {
  team_id: string | null;
  onSelect: (team: Team) => void;
  onClear: () => void;
  showToolbarItem: boolean;
};

const TeamsFilter = ({
  team_id,
  onSelect,
  onClear,
  showToolbarItem,
}: TeamsFilterProps) => {
  const teams = useSelector(getTeams);
  const team = useSelector((state) => getTeamById(team_id)(state));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(teamsActions.all());
  }, []);
  return (
    <ToolbarFilter
      chips={team ? [team.name] : []}
      deleteChip={onClear}
      categoryName="Team"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by team..."
        onClear={onClear}
        onSelect={onSelect}
        option={team}
        options={teams}
      />
    </ToolbarFilter>
  );
};

export default TeamsFilter;
