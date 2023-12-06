import { useState } from "react";
import { ITeam } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTeamQuery, useListTeamsQuery } from "teams/teamsApi";

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
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchValue = useDebouncedValue(searchValue, 1000);
  const { data, isLoading } = useListTeamsQuery({ name: debouncedSearchValue });
  const { data: team } = useGetTeamQuery(teamId ? teamId : skipToken);

  if (!data) return null;

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
      selections={team === undefined || teamId === null ? "" : team.name}
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
      {...props}
    >
      {data.teams
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
  const { data: team } = useGetTeamQuery(teamId ? teamId : skipToken);

  return (
    <ToolbarFilter
      chips={team === undefined || teamId === null ? [] : [team.name]}
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
