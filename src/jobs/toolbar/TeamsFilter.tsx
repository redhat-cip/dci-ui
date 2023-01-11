import { useEffect, useState } from "react";
import {
  ToolbarFilter,
  Select,
  SelectVariant,
  SelectOption,
  ToolbarChip,
} from "@patternfly/react-core";
import { useDispatch, useSelector } from "react-redux";
import { getTeams, isFetchingTeams } from "teams/teamsSelectors";
import { AppDispatch } from "store";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import teamsActions from "teams/teamsActions";
import { ITeam } from "types";

type TeamsFilterProps = {
  teamsIds: string[];
  onSelect: (team: ITeam) => void;
  onClear: (team: ITeam) => void;
  onClearAll: () => void;
  showToolbarItem?: boolean;
  placeholderText?: string;
  categoryName?: string;
};

export default function TeamsFilter({
  teamsIds,
  onSelect,
  onClear,
  onClearAll,
  showToolbarItem = true,
  placeholderText = "Search team by name",
  categoryName = "Teams",
}: TeamsFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const teams = useSelector(getTeams);
  const selectedTeams = teams.filter((t) => teamsIds.indexOf(t.id) !== -1);
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
      chips={selectedTeams.map((t) => ({
        key: t.id,
        node: <>{t.name}</>,
      }))}
      deleteChip={(category, chip) => {
        const teamToUnselect = selectedTeams.find(
          (t) => t.id === (chip as ToolbarChip).key
        );
        if (teamToUnselect) {
          onClear(teamToUnselect);
        }
      }}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <Select
        variant={SelectVariant.typeaheadMulti}
        typeAheadAriaLabel={placeholderText}
        onToggle={setIsOpen}
        onSelect={(event, selection) => {
          setIsOpen(false);
          const s = selection as ITeam;
          onSelect(s);
        }}
        onClear={onClearAll}
        selections={selectedTeams.map((t) => t.name)}
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
