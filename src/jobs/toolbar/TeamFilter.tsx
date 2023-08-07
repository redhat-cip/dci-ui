import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ITeam } from "types";
import { getTeams, getTeamById, isFetchingTeams } from "teams/teamsSelectors";
import teamsActions from "teams/teamsActions";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";

type TeamFilterProps = {
  team_id: string | null;
  onSelect: (team: ITeam) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TeamFilter({
  team_id,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Team",
}: TeamFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const teams = useSelector(getTeams);
  const team = useSelector(getTeamById(team_id));
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isFetching = useSelector(isFetchingTeams);

  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    if (debouncedSearchValue) {
      dispatch(teamsActions.all({ where: `name:${debouncedSearchValue}*` }));
    }
  }, [debouncedSearchValue, dispatch]);

  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <ToolbarFilter
      chips={team === null ? [] : [team.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={placeholderText}
        onToggle={(_event, val) => setIsOpen(val)}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as ITeam;
          onSelect(s);
        }}
        onClear={onClear}
        selections={team === null ? "" : team.name}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText={placeholderText}
        maxHeight="220px"
        onTypeaheadInputChanged={setSearchValue}
        noResultsFoundText={
          debouncedSearchValue === ""
            ? "Search a team by name"
            : isFetching
            ? "Searching..."
            : "No team matching this name"
        }
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
