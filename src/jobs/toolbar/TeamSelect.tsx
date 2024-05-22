import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useListTeamsQuery, useGetTeamQuery } from "teams/teamsApi";
import TypeheadSelect from "ui/form/TypeheadSelect";
import { SelectProps, ITeam } from "types";

export default function TeamSelect({
  id,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: SelectProps<ITeam>) {
  const [search, setSearch] = useState("");
  const { data, isFetching } = useListTeamsQuery({
    name: search.endsWith("*") ? search : `${search}*`,
  });
  const { data: getTeamData, isFetching: isFetchingTeam } = useGetTeamQuery(
    id ? id : skipToken,
  );
  const teams = data?.teams || [];
  const team = isFetchingTeam || getTeamData === undefined ? null : getTeamData;
  return (
    <TypeheadSelect
      id="select-team"
      placeholder={placeholder}
      onClear={onClear}
      onSelect={(item) => {
        const selectedTeam = item && teams.find((r) => r.id === item.value);
        if (selectedTeam) {
          onSelect(selectedTeam);
        }
      }}
      item={
        id
          ? team === null
            ? { value: id, label: "" }
            : { value: team.id, label: team.name }
          : null
      }
      items={teams.map((team) => ({
        value: team.id,
        label: team.name,
      }))}
      isLoading={isFetching}
      search={setSearch}
    />
  );
}
