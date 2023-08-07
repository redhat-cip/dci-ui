import {
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { TextArea } from "ui/formik";
import * as Yup from "yup";

export function splitTeamMembersString(teamMembersString: string) {
  const teamMembers = teamMembersString.split(/\r?\n/);
  return [...new Set(teamMembers)].filter((team) => team !== "");
}

export const TeamMembersFormSchema = Yup.object().shape({
  teamMembers: Yup.lazy((value) =>
    Array.isArray(value) ? Yup.array().of(Yup.string()) : Yup.string(),
  ),
});

export interface TeamMembersFormValues {
  teamMembers: "";
}

export default function TeamMembersForm() {
  return (
    <>
      <TextArea
        id="users_list_form__team_members"
        label="Team members"
        name="teamMembers"
        placeholder="rh-login-1&#10;rh-login-2"
      />
      <FormHelperText>
        <HelperText>
          <HelperTextItem>
            The list of Red Hat SSO logins that will be attached to the team.
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </>
  );
}
