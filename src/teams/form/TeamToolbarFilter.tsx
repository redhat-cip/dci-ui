import { ToolbarFilter } from "@patternfly/react-core";
import TeamSelect from "./TeamSelect";
import type { ITeam, IToolbarFilterProps } from "types";
import { useGetTeamQuery } from "teams/teamsApi";
import { skipToken } from "@reduxjs/toolkit/query";

export default function TeamToolbarFilter({
  id,
  showToolbarItem = true,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: IToolbarFilterProps<ITeam>) {
  const { data: team, isFetching } = useGetTeamQuery(id ? id : skipToken);
  const labels = isFetching ? ["..."] : id === null || !team ? [] : [team.name];
  return (
    <ToolbarFilter
      labels={labels}
      categoryName="Team name"
      deleteLabel={() => onClear()}
      showToolbarItem={showToolbarItem}
    >
      <TeamSelect
        onSelect={(team) => {
          if (team) {
            onSelect(team);
          }
        }}
        placeholder={placeholder}
      />
    </ToolbarFilter>
  );
}
