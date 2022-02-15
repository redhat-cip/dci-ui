import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ITeam } from "types";
import { getTeams, getTeamById } from "teams/teamsSelectors";
import teamsActions from "teams/teamsActions";
import {
  Select,
  SelectOption,
  SelectVariant,
  ToolbarFilter,
} from "@patternfly/react-core";
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
  const [isOpen, setIsOpen] = useState(false);
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
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Filter by team"
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as ITeam;
          onSelect(s);
        }}
        onClear={onClear}
        selections={team === null ? "" : team.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText="Filter by team"
        maxHeight="220px"
      >
        {teams
          .map((t) => ({ ...t, toString: () => t.name }))
          .map((team) => (
            <SelectOption key={team.id} value={team} />
          ))}
      </Select>
    </ToolbarFilter>
  );
}
