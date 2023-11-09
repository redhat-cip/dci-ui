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

export function TeamSelect({
  teamId,
  filteredTeamsIds = [],
  placeholderText = "",
  onSelect,
  onClear,
  ...props
}: {
  teamId: string | null;
  filteredTeamsIds?: string[];
  placeholderText?: string;
  onSelect: (team: ITeam) => void;
  onClear: () => void;
  [k: string]: any;
}) {
  const [searchValue, setSearchValue] = useState("");
  const isFetching = useSelector(isFetchingTeams);

  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const teams = useSelector(getTeams);
  const team = useSelector(getTeamById(teamId));

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
      {...props}
    >
      {teams
        .filter((t) => filteredTeamsIds.indexOf(t.id) === -1)
        .map((t) => ({ ...t, toString: () => t.name }))
        .map((team) => (
          <SelectOption key={team.id} value={team} />
        ))}
    </Select>
  );
}

type TeamFilterProps = {
  teamId: string | null;
  onSelect: (team: ITeam) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TeamFilter({
  teamId,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholderText = "Search by name",
  categoryName = "Team",
}: TeamFilterProps) {
  const team = useSelector(getTeamById(teamId));
  return (
    <ToolbarFilter
      chips={team === null ? [] : [team.name]}
      deleteChip={onClear}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TeamSelect
        teamId={teamId}
        onSelect={onSelect}
        onClear={onClear}
        placeholderText={placeholderText}
      />
    </ToolbarFilter>
  );
}
