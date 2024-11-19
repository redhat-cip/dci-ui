import { ToolbarFilter } from "@patternfly/react-core";
import { ITeam } from "types";
import TeamSelect from "./TeamSelect";

type TeamsToolbarFilterProps = {
  ids: string[];
  categoryName?: string;
  onSelect: (team: ITeam) => void;
  onClear: (teamId: string) => void;
  showToolbarItem?: boolean;
  placeholder?: string;
};

export default function TeamsToolbarFilter({
  ids,
  onSelect,
  onClear,
  showToolbarItem = true,
  placeholder = "Search team by name",
  categoryName = "Teams",
}: TeamsToolbarFilterProps) {
  return (
    <ToolbarFilter
      labels={ids}
      deleteLabel={(category, chip) => {
        const teamId = chip as string;
        if (teamId) {
          onClear(teamId);
        }
      }}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      <TeamSelect
        id={null}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={() => void 0}
      />
    </ToolbarFilter>
  );
}
