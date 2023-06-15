import { TeamMembersFormValues } from "./TeamMembersForm";
import { TeamPermissionValues } from "./TeamPermissionForm";
import { CreateTeamFormValues } from "./CreateTeamForm";

export type TeamCreationWizardValues = CreateTeamFormValues &
  TeamMembersFormValues &
  TeamPermissionValues;
