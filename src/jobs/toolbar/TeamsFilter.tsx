import { useState } from "react";
import { ToolbarFilter, ToolbarChip } from "@patternfly/react-core";
import {
  Select,
  SelectVariant,
  SelectOption,
} from "@patternfly/react-core/deprecated";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { ITeam } from "types";
import { useListTeamsQuery } from "teams/teamsApi";

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
  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);
  const { data, isLoading } = useListTeamsQuery({ name: debouncedSearchValue });

  if (!data) return null;

  const teamsOptions = data.teams.map((t) => ({
    ...t,
    toString: () => t.name,
  }));
  const selectedTeams = teamsOptions
    .filter((t) => teamsIds.indexOf(t.id) !== -1)
    .map((t) => ({ ...t, toString: () => t.name }));

  return (
    <ToolbarFilter
      chips={selectedTeams.map((t) => ({
        key: t.id,
        node: <>{t.name}</>,
      }))}
      deleteChip={(category, chip) => {
        const teamToUnselect = selectedTeams.find(
          (t) => t.id === (chip as ToolbarChip).key,
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
        onToggle={(_event, val) => setIsOpen(val)}
        onSelect={(event, teamSelected) => {
          const teamDeleted = selectedTeams.find(
            (t) => t.id === (teamSelected as ITeam).id,
          );
          if (teamDeleted) {
            onClear(teamDeleted);
          } else {
            onSelect(teamSelected as ITeam);
          }
        }}
        onClear={onClearAll}
        selections={selectedTeams}
        isOpen={isOpen}
        aria-labelledby="select"
        placeholderText={placeholderText}
        maxHeight="220px"
        onTypeaheadInputChanged={setSearchValue}
        noResultsFoundText={
          debouncedSearchValue === ""
            ? "Search a team by name"
            : isLoading
              ? "Searching..."
              : "No team matching this name"
        }
      >
        {teamsOptions.map((team) => (
          <SelectOption key={team.id} value={team} />
        ))}
      </Select>
    </ToolbarFilter>
  );
}
