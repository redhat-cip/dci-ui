import type { IIdentityTeam } from "types";
import { readValue, saveValue } from "services/localStorage";

const DEFAULT_TEAM_LOCASTORAGE_VALUE = "defaultTeam";

export function getDefaultTeam() {
  return readValue<IIdentityTeam | null>(DEFAULT_TEAM_LOCASTORAGE_VALUE, null);
}

export function changeCurrentTeam(team: IIdentityTeam) {
  saveValue(DEFAULT_TEAM_LOCASTORAGE_VALUE, team);
}
