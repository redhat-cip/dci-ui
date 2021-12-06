import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ITeam } from "types";
import { getTeams, getTeamById } from "teams/teamsSelectors";
import teamsActions from "teams/teamsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { AppDispatch } from "store";

type TeamsFilterProps = {
  team_id: string | null;
  onSelect: (team: ITeam) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
};

export default function TeamsFilter({
  team_id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: TeamsFilterProps) {
  const teams = useSelector(getTeams);
  const team = useSelector(getTeamById(team_id));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);
  return (
    <ToolbarFilter
      chips={team === null ? [] : [team.name]}
      deleteChip={onClear}
      categoryName="Team"
      showToolbarItem={showToolbarItem}
    >
      <SelectWithSearch
        placeholder="Filter by team"
        onClear={onClear}
        onSelect={(t) => onSelect(t as ITeam)}
        option={team}
        options={teams}
      />
    </ToolbarFilter>
  );
}
